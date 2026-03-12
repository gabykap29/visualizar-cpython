/**
         * AnimationManager - Handles synchronized updates across all visualization panels
         * Coordinates CSS transitions and ensures all panels update within 50ms budget
         * 
         * Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5, 11.6
         */
        class AnimationManager {
            /**
             * Creates an AnimationManager instance
             * @param {Object} panels - Object containing references to all panel elements
             *   - monacoEditor: Monaco Editor instance
             *   - pipelineDiagram: Pipeline diagram DOM element
             *   - bytecodePanel: Bytecode panel DOM element
             *   - stackPanel: Stack panel DOM element
             *   - memoryPanel: Memory panel DOM element
             *   - gilIndicator: GIL indicator DOM element
             */
            constructor(panels) {
                this.monacoEditor = panels.monacoEditor;
                this.pipelineDiagram = panels.pipelineDiagram;
                this.bytecodePanel = panels.bytecodePanel;
                this.stackPanel = panels.stackPanel;
                this.memoryPanel = panels.memoryPanel;
                this.gilIndicator = panels.gilIndicator;

                // Store current decorations for Monaco Editor
                this.currentDecorations = [];

                // Token state
                this._tokens = [];
                this._currentTab = 'bytecode'; // 'bytecode' | 'tokens'
                this._lastBytecode = [];
                this._lastInstructionPointer = null;
            }

            /**
             * Stores the token list generated for the current code.
             * Called once after a successful Run before stepping.
             * @param {Array} tokens - [{type, string, line, col}]
             */
            setTokens(tokens) {
                this._tokens = tokens || [];
                if (this._currentTab === 'tokens') {
                    this._renderTokens();
                }
            }

            /**
             * Switches the bytecode panel between 'bytecode' and 'tokens' views.
             * @param {'bytecode'|'tokens'} tab
             */
            switchTab(tab) {
                this._currentTab = tab;

                const tabBytecode = document.getElementById('tab-bytecode');
                const tabTokens = document.getElementById('tab-tokens');
                if (tabBytecode) tabBytecode.classList.toggle('active', tab === 'bytecode');
                if (tabTokens) tabTokens.classList.toggle('active', tab === 'tokens');

                if (tab === 'tokens') {
                    this._renderTokens();
                } else {
                    this.updateBytecodePointer(this._lastInstructionPointer, this._lastBytecode);
                }
            }

            /** Renders the token list into the bytecode panel content area. */
            _renderTokens() {
                const bytecodeContent = this.bytecodePanel
                    ? this.bytecodePanel.querySelector('#bytecode-content')
                    : null;
                if (!bytecodeContent) return;

                if (!this._tokens || this._tokens.length === 0) {
                    bytecodeContent.innerHTML = `
                        <div class="bytecode-placeholder">
                            <p>No tokens yet</p>
                            <p class="placeholder-hint">Run code to see the tokenizer output</p>
                        </div>`;
                    return;
                }

                // Token type → colour class
                const typeClass = {
                    NAME:    'tok-name',
                    NUMBER:  'tok-number',
                    STRING:  'tok-string',
                    OP:      'tok-op',
                    COMMENT: 'tok-comment',
                    NEWLINE: 'tok-newline',
                    INDENT:  'tok-indent',
                    DEDENT:  'tok-dedent',
                };

                let html = '<div class="token-list">';
                let currentLine = -1;
                for (const tok of this._tokens) {
                    if (tok.line !== currentLine) {
                        if (currentLine !== -1) html += '</div>';
                        html += `<div class="token-line"><span class="token-lineno">L${tok.line}</span>`;
                        currentLine = tok.line;
                    }
                    const cls = typeClass[tok.type] || 'tok-other';
                    const display = tok.string.replace(/&/g, '&amp;').replace(/</g, '&lt;');
                    html += `<span class="token ${cls}" title="${tok.type}">${display}</span>`;
                }
                if (currentLine !== -1) html += '</div>';
                html += '</div>';

                bytecodeContent.innerHTML = html;
            }
            
            /**
             * Synchronously updates all panels within 50ms
             * @param {ExecutionState} state - Current execution state to visualize
             */
            updateAll(state) {
                const startTime = performance.now();
                
                this.updateMonacoHighlight(state.lineNumber);
                this.updatePipelineStage(state.pipelineStage);
                this.updateBytecodePointer(state.instructionPointer, state.bytecode);
                this.updateStackFrames(state.callStack);
                this.updateMemoryObjects(state.heap);
                this.updateGILStatus(state.gilStatus);
                
                const elapsed = performance.now() - startTime;
                if (elapsed > 50) {
                    console.warn(`Panel update took ${elapsed.toFixed(2)}ms (exceeds 50ms budget)`);
                }
            }
            
            /**
             * Highlights the specified line in Monaco Editor using decorations API
             * @param {number} lineNumber - Line number to highlight (1-indexed)
             * 
             * Validates: Requirements 1.4 (highlight current source code line)
             * 
             * Monaco Editor's decorations API allows us to add visual styling to specific
             * ranges of text. We use it to highlight the current execution line with the
             * accent color defined in the design spec (#58a6ff).
             */
            updateMonacoHighlight(lineNumber) {
                if (!this.monacoEditor) {
                    console.warn('Monaco Editor not available for highlighting');
                    return;
                }
                
                // Clear previous decorations and set new ones
                // Monaco's deltaDecorations method efficiently updates decorations
                // by removing old ones and adding new ones in a single operation
                this.currentDecorations = this.monacoEditor.deltaDecorations(
                    this.currentDecorations,
                    [
                        {
                            // Range specifies the text range to decorate
                            // Format: new monaco.Range(startLine, startColumn, endLine, endColumn)
                            // We highlight the entire line from column 1 to the end
                            range: new monaco.Range(lineNumber, 1, lineNumber, 1),
                            options: {
                                // isWholeLine: true highlights the entire line including margins
                                isWholeLine: true,
                                // className applies a CSS class to the line content
                                className: 'current-execution-line',
                                // glyphMarginClassName adds a marker in the glyph margin (left side)
                                glyphMarginClassName: 'current-execution-glyph',
                                // linesDecorationsClassName adds a marker in the line decorations area
                                linesDecorationsClassName: 'current-execution-line-decoration',
                                // Background color for the highlighted line (accent color with transparency)
                                backgroundColor: 'rgba(88, 166, 255, 0.15)',
                                // Override options for more specific styling
                                overviewRuler: {
                                    color: '#58a6ff',
                                    position: monaco.editor.OverviewRulerLane.Full
                                }
                            }
                        }
                    ]
                );
                
                // Scroll the editor to reveal the highlighted line
                // This ensures the current execution line is visible to the user
                this.monacoEditor.revealLineInCenter(lineNumber);
            }
            
            /**
             * Animates the active pipeline stage
             * @param {string} stage - Pipeline stage: 'source' | 'tokenizer' | 'parser' | 'compiler' | 'bytecode' | 'pvm'
             * 
             * Validates: Requirements 2.2 (animate active stage with visual highlighting)
             * 
             * Applies CSS transitions to highlight the active stage with accent color #58a6ff
             * and 300ms duration as specified in the design requirements.
             */
            updatePipelineStage(stage) {
                if (!this.pipelineDiagram) {
                    console.warn('Pipeline diagram not available for animation');
                    return;
                }
                
                // Get all pipeline stage elements
                const stages = this.pipelineDiagram.querySelectorAll('.pipeline-stage');
                const arrows = this.pipelineDiagram.querySelectorAll('.pipeline-arrow');
                
                // Remove active class from all stages and arrows
                stages.forEach(stageElement => {
                    stageElement.classList.remove('active');
                });
                arrows.forEach(arrow => {
                    arrow.classList.remove('active');
                });
                
                // Find and activate the current stage
                let foundStage = false;
                stages.forEach((stageElement, index) => {
                    const stageData = stageElement.getAttribute('data-stage');
                    
                    if (stageData === stage) {
                        // Add active class to current stage
                        stageElement.classList.add('active');
                        foundStage = true;
                        
                        // Activate all arrows up to and including this stage
                        for (let i = 0; i < index && i < arrows.length; i++) {
                            arrows[i].classList.add('active');
                        }
                    }
                });
                
                if (!foundStage) {
                    console.warn(`Pipeline stage '${stage}' not found`);
                }
            }
            
            /**
             * Highlights the current bytecode instruction
             * @param {number} instructionPointer - Bytecode offset of current instruction
             * @param {BytecodeInstruction[]} bytecode - Array of bytecode instructions to display
             * 
             * Validates: Requirements 3.2, 3.3, 3.4, 3.5
             * - 3.2: Show instruction names (opname)
             * - 3.3: Show instruction arguments where applicable
             * - 3.4: Highlight current instruction pointer
             * - 3.5: Display bytecode offset numbers
             * 
             * Renders the complete bytecode listing with offset, opname, and arg for each instruction.
             * Highlights the instruction at the current instruction pointer with accent color.
             */
            updateBytecodePointer(instructionPointer, bytecode = []) {
                // Cache for tab switching
                this._lastInstructionPointer = instructionPointer;
                this._lastBytecode = bytecode;

                // If tokens tab is active, don't overwrite the token view
                if (this._currentTab === 'tokens') return;

                if (!this.bytecodePanel) {
                    console.warn('Bytecode panel not available for update');
                    return;
                }

                const bytecodeContent = this.bytecodePanel.querySelector('#bytecode-content');
                if (!bytecodeContent) {
                    console.warn('Bytecode content element not found');
                    return;
                }

                // If no bytecode is provided, show placeholder
                if (!bytecode || bytecode.length === 0) {
                    bytecodeContent.innerHTML = `
                        <div class="bytecode-placeholder">
                            <p>No bytecode generated yet</p>
                            <p class="placeholder-hint">Write Python code and execute to see bytecode instructions</p>
                        </div>
                    `;
                    return;
                }
                
                // Build HTML for all bytecode instructions
                let html = '';
                for (const instruction of bytecode) {
                    // Determine if this instruction is at the current instruction pointer
                    const isActive = instruction.offset === instructionPointer;
                    const activeClass = isActive ? 'active' : '';
                    
                    // Format the argument display
                    // Show arg value if it exists, otherwise show empty string
                    let argDisplay = '';
                    if (instruction.arg !== null && instruction.arg !== undefined) {
                        // If argval exists and is different from arg, show both
                        if (instruction.argval !== null && instruction.argval !== undefined && 
                            instruction.argval !== instruction.arg) {
                            argDisplay = `${instruction.arg} (${instruction.argval})`;
                        } else {
                            argDisplay = `${instruction.arg}`;
                        }
                    }
                    
                    // Build instruction HTML
                    html += `
                        <div class="bytecode-instruction ${activeClass}" data-offset="${instruction.offset}">
                            <span class="bytecode-offset">${instruction.offset}</span>
                            <span class="bytecode-opname">${instruction.opname}</span>
                            <span class="bytecode-arg">${argDisplay}</span>
                            <span class="bytecode-lineno">line ${instruction.lineno}</span>
                        </div>
                    `;
                }
                
                // Update the panel content
                bytecodeContent.innerHTML = html;
                
                // Scroll to the active instruction if it exists
                if (instructionPointer !== null && instructionPointer !== undefined) {
                    const activeInstruction = bytecodeContent.querySelector('.bytecode-instruction.active');
                    if (activeInstruction) {
                        // Scroll the active instruction into view with smooth behavior
                        activeInstruction.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }
            }
            
            /**
             * Animates stack frame push/pop with CSS transitions
             * @param {StackFrame[]} callStack - Array of stack frames
             * 
             * Validates: Requirements 4.2, 4.3, 4.4, 4.5 (stack frame display and animation)
             * - 4.2: Animate new card pushing onto stack with CSS transition (200-400ms)
             * - 4.3: Animate top card popping from stack with CSS transition (200-400ms)
             * - 4.4: Display function name, local variables with values, and return address
             * - 4.5: Position most recent frame at top of visual stack
             * 
             * The method compares the new callStack with the previously rendered stack to detect
             * push/pop operations and applies appropriate animations. Uses column-reverse flexbox
             * to position most recent frame at top.
             */
            updateStackFrames(callStack) {
                if (!this.stackPanel) {
                    console.warn('Stack panel not available for update');
                    return;
                }
                
                const stackContent = this.stackPanel.querySelector('#stack-content');
                if (!stackContent) {
                    console.warn('Stack content element not found');
                    return;
                }
                
                // If no call stack or empty, show placeholder
                if (!callStack || callStack.length === 0) {
                    stackContent.innerHTML = `
                        <div class="stack-placeholder">
                            <div class="stack-empty-icon">📚</div>
                            <p class="stack-empty-text">No stack frames yet</p>
                            <p class="stack-empty-hint">Execute code to see function call stack</p>
                        </div>
                    `;
                    // Clear stored previous stack
                    this.previousCallStack = [];
                    return;
                }
                
                // Detect push/pop operations by comparing with previous stack
                const previousStack = this.previousCallStack || [];
                let operation = 'none';
                
                if (callStack.length > previousStack.length) {
                    operation = 'push';
                } else if (callStack.length < previousStack.length) {
                    operation = 'pop';
                }
                
                // Build HTML for all stack frames
                let html = '';
                for (let i = 0; i < callStack.length; i++) {
                    const frame = callStack[i];
                    
                    // Most recent frame (last in array) is at top due to column-reverse
                    // Mark it as active
                    const isActive = i === callStack.length - 1;
                    const activeClass = isActive ? 'active' : '';
                    
                    // Apply push animation to the new frame (last frame if operation is push)
                    const animationClass = (operation === 'push' && i === callStack.length - 1) ? 'pushing' : '';
                    
                    // Format local variables
                    let variablesHtml = '';
                    if (frame.localVariables && frame.localVariables.size > 0) {
                        for (const [varName, varValue] of frame.localVariables) {
                            // Format the value for display
                            let displayValue = '';
                            if (varValue === null) {
                                displayValue = 'None';
                            } else if (varValue === undefined) {
                                displayValue = 'undefined';
                            } else if (typeof varValue === 'string') {
                                displayValue = `"${varValue}"`;
                            } else if (typeof varValue === 'object') {
                                try {
                                    displayValue = JSON.stringify(varValue);
                                } catch (e) {
                                    displayValue = '[Object]';
                                }
                            } else {
                                displayValue = String(varValue);
                            }
                            
                            variablesHtml += `
                                <div class="stack-frame-variable">
                                    <span class="stack-frame-var-name">${varName}</span>
                                    <span class="stack-frame-var-separator">=</span>
                                    <span class="stack-frame-var-value">${displayValue}</span>
                                </div>
                            `;
                        }
                    } else {
                        variablesHtml = `
                            <div class="stack-frame-variable">
                                <span class="stack-frame-var-value" style="color: rgba(201, 209, 217, 0.4);">No local variables</span>
                            </div>
                        `;
                    }
                    
                    // Build the complete frame HTML
                    html += `
                        <div class="stack-frame ${activeClass} ${animationClass}" data-frame-id="${frame.frameId}">
                            <div class="stack-frame-header">
                                <span class="stack-frame-function">${frame.functionName}()</span>
                                <span class="stack-frame-id">#${frame.frameId}</span>
                            </div>
                            <div class="stack-frame-body">
                                <div class="stack-frame-locals">
                                    <div class="stack-frame-section-title">Local Variables</div>
                                    ${variablesHtml}
                                </div>
                                <div class="stack-frame-return">
                                    <span class="stack-frame-return-label">Return to:</span>
                                    <span class="stack-frame-return-address">offset ${frame.returnAddress}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }
                
                // Update the panel content
                stackContent.innerHTML = html;
                
                // If this was a pop operation, we need to handle the animation differently
                // since the popped frame is no longer in the DOM
                // For now, the CSS transition on removal provides a smooth effect
                
                // Remove animation classes after animation completes (300ms as per CSS)
                setTimeout(() => {
                    const frames = stackContent.querySelectorAll('.stack-frame');
                    frames.forEach(frame => {
                        frame.classList.remove('pushing', 'popping');
                    });
                }, 300);
                
                // Store current stack for next comparison
                this.previousCallStack = callStack.slice();
            }
            
            /**
             * Animates object allocation/deallocation
             * @param {HeapObject[]} heap - Array of heap objects
             * 
             * Validates: Requirements 5.1, 5.2, 5.3, 5.4 (memory visualization)
             * 
             * TODO: Implement in future task (Task 9.2)
             */
            /**
                         * Animates object allocation/deallocation
                         * @param {HeapObject[]} heap - Array of heap objects
                         * 
                         * Validates: Requirements 5.1, 5.2, 5.3, 5.4 (memory visualization)
                         * - 5.1: Display heap objects (int, str, list, dict)
                         * - 5.2: Display variable names with visual arrows to referenced objects
                         * - 5.3: Animate object allocation with CSS transition (200-400ms)
                         * - 5.4: Animate object deallocation with CSS transition (200-400ms)
                         * 
                         * Renders heap objects as visual cards with type icons, object IDs, values,
                         * and reference counts. Draws SVG arrows from variable references to objects.
                         * Applies allocation/deallocation animations when objects are added/removed.
                         */
                        updateMemoryObjects(heap) {
                            if (!this.memoryPanel) {
                                console.warn('Memory panel not available for update');
                                return;
                            }

                            const memoryContainer = this.memoryPanel.querySelector('#memory-objects-container');
                            const arrowsSvg = this.memoryPanel.querySelector('#memory-arrows');

                            if (!memoryContainer || !arrowsSvg) {
                                console.warn('Memory container or arrows SVG not found');
                                return;
                            }

                            // If no heap or empty, show placeholder
                            if (!heap || heap.length === 0) {
                                memoryContainer.innerHTML = `
                                    <div class="memory-placeholder">
                                        <div class="memory-empty-icon">🧠</div>
                                        <p class="memory-empty-text">No objects allocated yet</p>
                                        <p class="memory-empty-hint">Execute code to see heap objects</p>
                                    </div>
                                `;
                                // Clear arrows
                                arrowsSvg.innerHTML = '';
                                // Clear stored previous heap
                                this.previousHeap = [];
                                return;
                            }

                            // Detect allocation/deallocation by comparing with previous heap
                            const previousHeap = this.previousHeap || [];
                            const previousIds = new Set(previousHeap.map(obj => obj.objectId));
                            const currentIds = new Set(heap.map(obj => obj.objectId));

                            // Find newly allocated objects
                            const allocatedIds = new Set();
                            for (const obj of heap) {
                                if (!previousIds.has(obj.objectId)) {
                                    allocatedIds.add(obj.objectId);
                                }
                            }

                            // Find deallocated objects
                            const deallocatedIds = new Set();
                            for (const obj of previousHeap) {
                                if (!currentIds.has(obj.objectId)) {
                                    deallocatedIds.add(obj.objectId);
                                }
                            }

                            // Build HTML for all heap objects
                            let html = '';
                            for (const obj of heap) {
                                // Determine animation class
                                const animationClass = allocatedIds.has(obj.objectId) ? 'allocating' : '';

                                // Format the value for display based on type
                                let displayValue = '';
                                if (obj.type === 'int' || obj.type === 'float') {
                                    displayValue = String(obj.value);
                                } else if (obj.type === 'str') {
                                    displayValue = `"${obj.value}"`;
                                } else if (obj.type === 'list') {
                                    try {
                                        displayValue = JSON.stringify(obj.value);
                                    } catch (e) {
                                        displayValue = '[...]';
                                    }
                                } else if (obj.type === 'dict') {
                                    try {
                                        displayValue = JSON.stringify(obj.value);
                                    } catch (e) {
                                        displayValue = '{...}';
                                    }
                                } else if (obj.type === 'function') {
                                    displayValue = `<function ${obj.value}>`;
                                } else {
                                    displayValue = String(obj.value);
                                }

                                // Build the object card HTML
                                html += `
                                    <div class="memory-object ${animationClass}" data-object-id="${obj.objectId}" data-type="${obj.type}">
                                        <div class="memory-object-header">
                                            <div class="memory-object-type-container">
                                                <span class="memory-object-type-icon"></span>
                                                <span class="memory-object-type">${obj.type}</span>
                                            </div>
                                            <span class="memory-object-id">id: ${obj.objectId}</span>
                                        </div>
                                        <div class="memory-object-body">
                                            <div class="memory-object-value">${displayValue}</div>
                                            <div class="memory-object-refcount">
                                                <span class="memory-object-refcount-label">Ref Count</span>
                                                <span class="memory-object-refcount-value">${obj.refCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }

                            // Update the container content
                            memoryContainer.innerHTML = html;

                            // Remove animation classes after animation completes (300ms as per CSS)
                            setTimeout(() => {
                                const objects = memoryContainer.querySelectorAll('.memory-object');
                                objects.forEach(obj => {
                                    obj.classList.remove('allocating', 'deallocating');
                                });
                            }, 300);

                            // Draw reference arrows after DOM is updated
                            // Use requestAnimationFrame to ensure DOM has been rendered
                            requestAnimationFrame(() => {
                                this.drawReferenceArrows(heap, memoryContainer, arrowsSvg);
                            });

                            // Store current heap for next comparison
                            this.previousHeap = heap.slice();
                        }

                        /**
                         * Draws SVG arrows from variable references to heap objects
                         * @param {HeapObject[]} heap - Array of heap objects
                         * @param {HTMLElement} memoryContainer - Container element for memory objects
                         * @param {SVGElement} arrowsSvg - SVG element for drawing arrows
                         *
                         * Validates: Requirements 5.2 (display variable names with visual arrows)
                         *
                         * This method creates SVG line elements with arrowhead markers to visually
                         * connect variable names to their referenced objects in the heap.
                         */
                        drawReferenceArrows(heap, memoryContainer, arrowsSvg) {
                            // Clear existing arrows
                            arrowsSvg.innerHTML = '';

                            // Get the bounding rectangle of the memory panel for coordinate calculations
                            const panelRect = this.memoryPanel.getBoundingClientRect();
                            const contentRect = memoryContainer.getBoundingClientRect();

                            // Set SVG dimensions to match the content area
                            arrowsSvg.setAttribute('width', contentRect.width);
                            arrowsSvg.setAttribute('height', contentRect.height);

                            // Define arrowhead marker
                            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
                            marker.setAttribute('id', 'arrowhead');
                            marker.setAttribute('markerWidth', '10');
                            marker.setAttribute('markerHeight', '10');
                            marker.setAttribute('refX', '9');
                            marker.setAttribute('refY', '3');
                            marker.setAttribute('orient', 'auto');
                            marker.setAttribute('markerUnits', 'strokeWidth');

                            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                            polygon.setAttribute('points', '0 0, 10 3, 0 6');
                            polygon.setAttribute('fill', '#58a6ff');

                            marker.appendChild(polygon);
                            defs.appendChild(marker);
                            arrowsSvg.appendChild(defs);

                            // For each heap object, check if there are variable references
                            // In a real implementation, we would need variable-to-object mappings
                            // For now, we'll draw arrows from object cards to show the concept

                            // Note: This is a simplified implementation. In a full implementation,
                            // we would need the execution state to include variable-to-object mappings
                            // so we can draw arrows from variable names (which might be displayed
                            // elsewhere in the UI) to their referenced objects.

                            // For demonstration purposes, if objects have a 'references' array,
                            // we can draw arrows between objects
                            for (const obj of heap) {
                                if (obj.references && obj.references.length > 0) {
                                    const sourceElement = memoryContainer.querySelector(`[data-object-id="${obj.objectId}"]`);
                                    if (!sourceElement) continue;

                                    const sourceRect = sourceElement.getBoundingClientRect();
                                    const sourceX = sourceRect.left - contentRect.left + sourceRect.width / 2;
                                    const sourceY = sourceRect.bottom - contentRect.top;

                                    // Draw arrow to each referenced object
                                    for (const refId of obj.references) {
                                        const targetElement = memoryContainer.querySelector(`[data-object-id="${refId}"]`);
                                        if (!targetElement) continue;

                                        const targetRect = targetElement.getBoundingClientRect();
                                        const targetX = targetRect.left - contentRect.left + targetRect.width / 2;
                                        const targetY = targetRect.top - contentRect.top;

                                        // Create SVG line with arrow
                                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                                        line.setAttribute('x1', sourceX);
                                        line.setAttribute('y1', sourceY);
                                        line.setAttribute('x2', targetX);
                                        line.setAttribute('y2', targetY);
                                        line.setAttribute('class', 'memory-arrow');

                                        arrowsSvg.appendChild(line);
                                    }
                                }
                            }
                        }
            
            /**
             * Updates GIL indicator color and thread ID
             * @param {GILStatus} gilStatus - GIL status object
             * 
             * Validates: Requirements 6.2, 6.5 (GIL status display)
             * 
             * TODO: Implement in future task (Task 10.2)
             */
            updateGILStatus(gilStatus) {
                    // Handle null/undefined gilStatus gracefully
                    if (!gilStatus || !this.gilIndicator) {
                        return;
                    }

                    try {
                        const indicator = this.gilIndicator;
                        const stateElement = indicator.querySelector('.gil-state');
                        const threadElement = indicator.querySelector('.gil-thread');

                        // Handle missing DOM elements gracefully
                        if (!stateElement || !threadElement) {
                            console.warn('GIL indicator DOM elements not found');
                            return;
                        }

                        // Update state class (remove both classes first, then add the correct one)
                        indicator.classList.remove('gil-acquired', 'gil-released');

                        const state = gilStatus.state ? gilStatus.state.toUpperCase() : 'RELEASED';
                        const threadId = gilStatus.threadId !== undefined ? gilStatus.threadId : -1;

                        // Add the appropriate class based on state
                        if (state === 'ACQUIRED') {
                            indicator.classList.add('gil-acquired');
                        } else {
                            indicator.classList.add('gil-released');
                        }

                        // Update state text (display in uppercase)
                        stateElement.textContent = state;

                        // Update thread ID (display as "Thread: X")
                        threadElement.textContent = `Thread: ${threadId}`;

                    } catch (error) {
                        console.error('Error updating GIL status:', error);
                    }
                }
        }