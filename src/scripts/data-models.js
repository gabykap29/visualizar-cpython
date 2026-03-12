/**
         * ExecutionState - Complete snapshot of program state at a single execution step
         * Represents all information needed to visualize one moment in program execution
         */
        class ExecutionState {
            constructor({
                stepNumber,
                lineNumber,
                pipelineStage,
                instructionPointer,
                bytecode,
                callStack,
                heap,
                gilStatus,
                explanation
            }) {
                this.stepNumber = stepNumber;           // Sequential step index
                this.lineNumber = lineNumber;           // Current source code line
                this.pipelineStage = pipelineStage;     // 'source' | 'tokenizer' | 'parser' | 'compiler' | 'bytecode' | 'pvm'
                this.instructionPointer = instructionPointer; // Current bytecode offset
                this.bytecode = bytecode;               // Array of BytecodeInstruction
                this.callStack = callStack;             // Array of StackFrame
                this.heap = heap;                       // Array of HeapObject
                this.gilStatus = gilStatus;             // GILStatus object
                this.explanation = explanation;         // Human-readable step description
            }
        }
        
        /**
         * BytecodeInstruction - Single Python bytecode instruction
         * Represents one compiled instruction from Python's dis module
         */
        class BytecodeInstruction {
            constructor({
                offset,
                opname,
                arg,
                argval,
                lineno
            }) {
                this.offset = offset;       // Bytecode offset
                this.opname = opname;       // Instruction name (e.g., 'LOAD_FAST', 'CALL_FUNCTION')
                this.arg = arg;             // Instruction argument (if applicable)
                this.argval = argval;       // Resolved argument value
                this.lineno = lineno;       // Corresponding source line number
            }
        }
        
        /**
         * StackFrame - Function call frame on the call stack
         * Represents one function invocation with its local state
         */
        class StackFrame {
            constructor({
                frameId,
                functionName,
                localVariables,
                returnAddress,
                lineNumber
            }) {
                this.frameId = frameId;             // Unique frame identifier
                this.functionName = functionName;   // Function name
                this.localVariables = localVariables; // Map<string, any> of local variable bindings
                this.returnAddress = returnAddress; // Bytecode offset to return to
                this.lineNumber = lineNumber;       // Current line in this frame
            }
        }
        
        /**
         * HeapObject - Object allocated in memory
         * Represents a Python object with reference counting
         */
        class HeapObject {
            constructor({
                objectId,
                type,
                value,
                refCount,
                references
            }) {
                this.objectId = objectId;       // Unique object identifier
                this.type = type;               // 'int' | 'str' | 'list' | 'dict' | 'function'
                this.value = value;             // Object value
                this.refCount = refCount;       // Reference count
                this.references = references;   // Array of object IDs this object references
            }
        }
        
        /**
         * GILStatus - Global Interpreter Lock state
         * Represents the current state of Python's GIL
         */
        class GILStatus {
            constructor({
                state,
                threadId,
                explanation
            }) {
                this.state = state;             // 'ACQUIRED' | 'RELEASED'
                this.threadId = threadId;       // Thread holding the GIL (or -1 if released)
                this.explanation = explanation; // Tooltip text explaining GIL purpose
            }
        }
        
        /**
         * CodeExample - Preloaded code example
         * Represents a sample Python program for demonstration
         */
        class CodeExample {
            constructor({
                name,
                description,
                code
            }) {
                this.name = name;               // Display name in dropdown
                this.description = description; // Brief description
                this.code = code;               // Python source code
            }
        }

        /**
         * Preloaded code examples for the Example Selector dropdown.
         * Validates: Requirements 10.1, 10.2, 10.3, 10.4
         */
        const CODE_EXAMPLES = [
            // Example 1: Simple variable assignment and arithmetic (Req 10.2)
            new CodeExample({
                name: 'Simple Arithmetic',
                description: 'Variable assignment and basic arithmetic operations',
                code: `# Simple variable assignment and arithmetic
x = 10
y = 20
result = x + y
print(result)

# More operations
diff = y - x
product = x * y
quotient = y / x
print(diff, product, quotient)
`
            }),

            // Example 2: Recursive Fibonacci (Req 10.3)
            new CodeExample({
                name: 'Recursive Fibonacci',
                description: 'Recursive function demonstrating call stack growth',
                code: `# Recursive Fibonacci sequence
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Compute Fibonacci numbers
for i in range(7):
    result = fibonacci(i)
    print(result)
`
            }),

            // Example 3: List comprehension (Req 10.4)
            new CodeExample({
                name: 'List Comprehension',
                description: 'List creation using comprehension syntax',
                code: `# List comprehension example
numbers = [1, 2, 3, 4, 5]

# Square each number
squares = [x ** 2 for x in numbers]
print(squares)

# Filter even squares only
evens = [x for x in squares if x % 2 == 0]
print(evens)

# Nested comprehension - multiplication table (3x3)
table = [[i * j for j in range(1, 4)] for i in range(1, 4)]
print(table)
`
            }),

            // Example 4: Dictionary operations
            new CodeExample({
                name: 'Dictionary Operations',
                description: 'Creating and manipulating Python dictionaries',
                code: `# Dictionary operations
person = {
    'name': 'Alice',
    'age': 30,
    'city': 'Wonderland'
}

# Access values
print(person['name'])

# Add a new key
person['hobby'] = 'reading'

# Iterate over key-value pairs
for key, value in person.items():
    print(key, ':', value)
`
            })
        ];