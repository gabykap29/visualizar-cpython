/**
 * ExecutionEngine - Orchestrates Python code execution via a Web Worker running Pyodide.
 * The Worker runs Python in a background thread so the main UI never freezes.
 *
 * Public API (same as before):
 *   compile(sourceCode)      → Promise<{ success, error }>
 *   getBytecode(sourceCode)  → Promise<BytecodeInstruction[]>
 *   captureStates(sourceCode)→ Promise<ExecutionState[]>
 */
class ExecutionEngine {
    /**
     * @param {Worker} worker - An already-created Web Worker running pyodide-worker.js
     */
    constructor(worker) {
        this._worker = worker;
        this._pending = new Map(); // id → { resolve, reject }
        this._idCounter = 0;

        this._worker.onmessage = (event) => {
            const { id, type, data, error } = event.data;
            const pending = this._pending.get(id);
            if (!pending) return;
            this._pending.delete(id);
            if (type === 'error') {
                pending.reject(new Error(error));
            } else {
                pending.resolve(data);
            }
        };

        this._worker.onerror = (event) => {
            // Reject all pending promises on unhandled worker errors
            for (const [, pending] of this._pending) {
                pending.reject(new Error(event.message || 'Worker error'));
            }
            this._pending.clear();
        };
    }

    // ── Internal helper ──────────────────────────────────────────────────────

    _call(action, sourceCode) {
        return new Promise((resolve, reject) => {
            const id = ++this._idCounter;
            this._pending.set(id, { resolve, reject });
            this._worker.postMessage({ id, action, sourceCode });
        });
    }

    // ── Public API ───────────────────────────────────────────────────────────

    /**
     * Compiles Python code and reports syntax errors.
     * @param {string} sourceCode
     * @returns {Promise<{success: boolean, states: [], error: string|null}>}
     */
    async compile(sourceCode) {
        try {
            const result = await this._call('compile', sourceCode);
            return { success: result.success, states: [], error: result.error };
        } catch (error) {
            return {
                success: false,
                states: [],
                error: `Compilation Error: ${error.message}\n\nPlease check your Python syntax and try again.`
            };
        }
    }

    /**
     * Retrieves bytecode instructions for the given Python source.
     * @param {string} sourceCode
     * @returns {Promise<BytecodeInstruction[]>}
     */
    async getBytecode(sourceCode) {
        try {
            const rawList = await this._call('getBytecode', sourceCode);
            return rawList.map(instr => new BytecodeInstruction({
                offset: instr.offset,
                opname: instr.opname,
                arg:    instr.arg,
                argval: instr.argval,
                lineno: instr.lineno
            }));
        } catch (error) {
            console.error('Bytecode generation error:', error);
            return [];
        }
    }

    /**
     * Tokenizes Python code using Python's tokenize module.
     * Returns an array of plain token objects with type, string, line, col.
     * @param {string} sourceCode
     * @returns {Promise<Array<{type:string, string:string, line:number, col:number}>>}
     */
    async getTokens(sourceCode) {
        try {
            return await this._call('getTokens', sourceCode);
        } catch (error) {
            console.error('Tokenization error:', error);
            return [];
        }
    }

    /**
     * Executes Python code step-by-step and returns all captured execution states.
     * @param {string} sourceCode
     * @returns {Promise<ExecutionState[]>}
     */
    async captureStates(sourceCode) {
        // Get bytecode for display in the panel
        const bytecode = await this.getBytecode(sourceCode);

        let rawStates;
        try {
            rawStates = await this._call('captureStates', sourceCode);
        } catch (error) {
            console.error('State capture error:', error);
            return [];
        }

        const states = [];
        for (const stateData of rawStates) {
            // Convert call stack frames
            const callStack = (stateData.callStack || []).map(frameData => {
                const localVars = new Map(Object.entries(frameData.localVariables || {}));
                return new StackFrame({
                    frameId:        frameData.frameId,
                    functionName:   frameData.functionName,
                    localVariables: localVars,
                    returnAddress:  frameData.returnAddress,
                    lineNumber:     frameData.lineNumber
                });
            });

            // Convert heap objects
            const heap = (stateData.heap || []).map(objData => new HeapObject({
                objectId:   objData.objectId,
                type:       objData.type,
                value:      objData.value,
                refCount:   objData.refCount,
                references: objData.references || []
            }));

            // Convert GIL status
            const gilData = stateData.gilStatus || {};
            const gilStatus = new GILStatus({
                state:       gilData.state,
                threadId:    gilData.threadId,
                explanation: gilData.explanation
            });

            states.push(new ExecutionState({
                stepNumber:         stateData.stepNumber,
                lineNumber:         stateData.lineNumber,
                pipelineStage:      stateData.pipelineStage,
                instructionPointer: stateData.instructionPointer,
                bytecode:           bytecode,
                callStack:          callStack,
                heap:               heap,
                gilStatus:          gilStatus,
                explanation:        stateData.explanation
            }));
        }

        return states;
    }
}
