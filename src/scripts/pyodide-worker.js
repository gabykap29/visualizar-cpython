/**
 * pyodide-worker.js
 * Runs Pyodide (Python via WebAssembly) in a Web Worker to avoid blocking the main UI thread.
 * Communicates with the main thread via postMessage / onmessage.
 */

importScripts('https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js');

let pyodide = null;

// Initialize Pyodide and notify main thread when ready
async function init() {
    try {
        pyodide = await loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
        });
        self.postMessage({ type: 'ready' });
    } catch (error) {
        self.postMessage({ type: 'init_error', error: error.message });
    }
}

// Handle messages from the main thread

async function doAction(action, sourceCode) {
    if (action === 'compile')       return doCompile(sourceCode);
    if (action === 'getBytecode')   return doGetBytecode(sourceCode);
    if (action === 'captureStates') return doCaptureStates(sourceCode);
    if (action === 'getTokens')     return doGetTokens(sourceCode);
    throw new Error('Unknown action: ' + action);
}


self.onmessage = async function(event) {
    const { id, action, sourceCode } = event.data;

    if (!pyodide) {
        self.postMessage({ id, type: 'error', error: 'Pyodide not initialized yet.' });
        return;
    }

    try {
        const data = await doAction(action, sourceCode);
        self.postMessage({ id, type: 'result', data });
    } catch (error) {
        self.postMessage({ id, type: 'error', error: error.message });
    }
};

// ── Compile ─────────────────────────────────────────────────────────────────

async function doCompile(sourceCode) {
    pyodide.globals.set('source_code', sourceCode);
    await pyodide.runPythonAsync(`
import ast
try:
    ast.parse(source_code)
except SyntaxError as e:
    raise e
`);
    return { success: true, error: null };
}

// ── Get Bytecode ─────────────────────────────────────────────────────────────

async function doGetBytecode(sourceCode) {
    pyodide.globals.set('source_code', sourceCode);
    const bytecodeData = await pyodide.runPythonAsync(`
import dis

code_obj = compile(source_code, '<string>', 'exec')
instructions = []
for instr in dis.get_instructions(code_obj):
    instructions.append({
        'offset': instr.offset,
        'opname': instr.opname,
        'arg': instr.arg,
        'argval': str(instr.argval) if instr.argval is not None else None,
        'lineno': instr.starts_line if instr.starts_line is not None else 0
    })
instructions
`);
    const result = bytecodeData.toJs({ dict_converter: Object.fromEntries });
    bytecodeData.destroy();
    return result;
}

// ── Capture States ───────────────────────────────────────────────────────────

async function doCaptureStates(sourceCode) {
    const MAX_STEPS = 200;
    pyodide.globals.set('source_code', sourceCode);
    pyodide.globals.set('max_steps', MAX_STEPS);

    const statesData = await pyodide.runPythonAsync(`
import sys
import dis

code_obj = compile(source_code, '<string>', 'exec')
bytecode_list = list(dis.get_instructions(code_obj))

# Only trace frames that belong to the user's code (exec'd with filename '<string>').
# Without this filter, the tracer enters Pyodide's internal Python code (e.g. the
# implementation of print, stdout.write, etc.) and generates thousands of spurious
# events, causing the worker to hang even for simple for-loops.
USER_FILENAME = '<string>'

execution_states = []
step_number = 0
exec_namespace = {}

class _MaxStepsReached(Exception):
    """Raised by the tracer to stop execution immediately after max_steps."""
    pass

def trace_function(frame, event, arg):
    global step_number, execution_states

    # Ignore every frame that is NOT user-supplied code.
    if frame.f_code.co_filename != USER_FILENAME:
        return None  # do not trace this frame (or its children)

    # Stop execution — raise instead of returning None so that exec() exits
    # immediately rather than continuing to run un-traced.
    if step_number >= max_steps:
        raise _MaxStepsReached()

    if event not in ['line', 'call', 'return']:
        return trace_function

    current_line = frame.f_lineno

    # Build call stack — only user frames
    call_stack = []
    current_frame = frame
    frame_id = 0
    while current_frame is not None:
        if current_frame.f_code.co_filename == USER_FILENAME:
            local_vars = {}
            for var_name, var_value in current_frame.f_locals.items():
                # Skip dunder names (__builtins__, __doc__, etc.)
                if var_name.startswith('__') and var_name.endswith('__'):
                    continue
                try:
                    local_vars[var_name] = str(var_value)
                except:
                    local_vars[var_name] = '<unprintable>'

            call_stack.append({
                'frameId': f'frame_{frame_id}',
                'functionName': current_frame.f_code.co_name,
                'localVariables': local_vars,
                'returnAddress': current_frame.f_lasti,
                'lineNumber': current_frame.f_lineno
            })
            frame_id += 1

        current_frame = current_frame.f_back

    # Build heap snapshot from the current user frame's locals.
    # Skip dunder variables (__builtins__, __doc__, etc.) — they are Python
    # internals, not user-defined values, and produce enormous unreadable output.
    heap = []
    object_id = 0
    for var_name, var_value in frame.f_locals.items():
        if var_name.startswith('__') and var_name.endswith('__'):
            continue
        obj_type = type(var_value).__name__

        if obj_type in ['int', 'float']:
            obj_type = 'int'
        elif obj_type == 'str':
            obj_type = 'str'
        elif obj_type == 'list':
            obj_type = 'list'
        elif obj_type == 'dict':
            obj_type = 'dict'
        elif callable(var_value):
            obj_type = 'function'
        else:
            obj_type = 'object'

        try:
            value_str = str(var_value)
        except:
            value_str = '<unprintable>'

        heap.append({
            'objectId': f'obj_{object_id}',
            'type': obj_type,
            'value': value_str,
            'refCount': sys.getrefcount(var_value),
            'references': []
        })
        object_id += 1

    instruction_pointer = frame.f_lasti

    explanation = f"Executing line {current_line}"
    if event == 'call':
        explanation = f"Llamando a función '{frame.f_code.co_name}' en línea {current_line}"
    elif event == 'return':
        explanation = f"Retornando de función '{frame.f_code.co_name}' en línea {current_line}"

    for instr in bytecode_list:
        if instr.offset == instruction_pointer or (instr.starts_line and instr.starts_line == current_line):
            explanation += f" - Bytecode: {instr.opname}"
            if instr.arg is not None:
                explanation += f"({instr.argval})"
            break

    if len(call_stack) > 1:
        explanation += f" - Profundidad de pila: {len(call_stack)}"
    if len(heap) > 0:
        explanation += f" - {len(heap)} objetos en memoria"

    state = {
        'stepNumber': step_number,
        'lineNumber': current_line,
        'pipelineStage': 'pvm',
        'instructionPointer': instruction_pointer,
        'callStack': call_stack,
        'heap': heap,
        'gilStatus': {
            'state': 'ADQUIRIDO',
            'threadId': 0,
            'explanation': 'El Bloqueo Global del Intérprete (GIL) asegura que solo un hilo ejecute bytecode Python a la vez'
        },
        'explanation': explanation
    }

    execution_states.append(state)
    step_number += 1
    return trace_function

sys.settrace(trace_function)
try:
    exec(code_obj, exec_namespace)
except _MaxStepsReached:
    pass  # Normal — hit the step limit, execution stopped cleanly
except Exception:
    pass  # User code raised an exception — return whatever we captured so far
finally:
    sys.settrace(None)

execution_states
`);

    const result = statesData.toJs({ dict_converter: Object.fromEntries });
    statesData.destroy();
    return result;
}

// ── Get Tokens ────────────────────────────────────────────────────────────────

async function doGetTokens(sourceCode) {
    pyodide.globals.set('source_code', sourceCode);
    const tokensData = await pyodide.runPythonAsync(`
import tokenize
import io

# Tokens worth showing to students (skip pure structural noise)
SHOW_TYPES = {'NAME', 'NUMBER', 'STRING', 'OP', 'COMMENT', 'NEWLINE', 'INDENT', 'DEDENT'}

tokens = []
try:
    for tok in tokenize.generate_tokens(io.StringIO(source_code).readline):
        tok_type = tokenize.tok_name[tok.type]
        if tok_type not in SHOW_TYPES:
            continue
        tokens.append({
            'type': tok_type,
            'string': tok.string,
            'line': tok.start[0],
            'col': tok.start[1]
        })
except tokenize.TokenError:
    pass  # Incomplete code — return whatever was tokenized so far
tokens
`);
    const result = tokensData.toJs({ dict_converter: Object.fromEntries });
    tokensData.destroy();
    return result;
}

init();
