/**
 * ViewController - Coordinates execution control and UI updates
 * Manages navigation through execution states and synchronizes panel updates
 * 
 * Validates: Requirements 8.6, 8.7, 8.8, 8.9
 * - 8.6: Step Forward advances execution by one step
 * - 8.7: Step Back reverses execution by one step
 * - 8.8: Auto-play automatically advances execution at configurable speed
 * - 8.9: Reset returns execution to initial state
 */
class ViewController {
    /**
     * Creates a ViewController instance
     * @param {StateStore} stateStore - State management instance
     * @param {AnimationManager} animationManager - Animation coordination instance
     */
    constructor(stateStore, animationManager) {
        this.stateStore = stateStore;
        this.animationManager = animationManager;
        
        // Auto-play state
        this.autoPlayInterval = null;
        this.isPlaying = false;
        this.currentSpeed = 1.0; // Default speed multiplier
        
        // Get references to control buttons
        this.btnStepForward = document.getElementById('btn-step-forward');
        this.btnStepBack = document.getElementById('btn-step-back');
        this.btnAutoPlay = document.getElementById('btn-auto-play');
        this.btnReset = document.getElementById('btn-reset');
        this.btnExplain = document.getElementById('btn-explain');
        this.speedSlider = document.getElementById('speed-slider');
        this.speedDisplay = document.getElementById('speed-display');
        
        // Get references to explanation tooltip elements
        this.explanationTooltip = document.getElementById('explanation-tooltip');
        this.explanationContent = document.getElementById('explanation-content');
        this.explanationCloseBtn = document.getElementById('explanation-close');
        
        // Connect event handlers
        this.connectEventHandlers();
        
        // Initialize button states
        this.updateButtonStates();
    }
    
    /**
     * Connects event handlers to all control buttons
     */
    connectEventHandlers() {
        // Step Forward button
        if (this.btnStepForward) {
            this.btnStepForward.addEventListener('click', () => this.onStepForward());
        }
        
        // Step Back button
        if (this.btnStepBack) {
            this.btnStepBack.addEventListener('click', () => this.onStepBack());
        }
        
        // Auto-play button
        if (this.btnAutoPlay) {
            this.btnAutoPlay.addEventListener('click', () => {
                if (this.isPlaying) {
                    this.stopAutoPlay();
                } else {
                    this.startAutoPlay();
                }
            });
        }
        
        // Reset button
        if (this.btnReset) {
            this.btnReset.addEventListener('click', () => this.onReset());
        }
        
        // Speed slider
        if (this.speedSlider) {
            this.speedSlider.addEventListener('input', (e) => {
                this.currentSpeed = parseFloat(e.target.value);
                this.updateSpeedDisplay();
                
                // If auto-play is active, restart with new speed
                if (this.isPlaying) {
                    this.stopAutoPlay();
                    this.startAutoPlay();
                }
            });
        }
        
        // Explain button
        // Validates: Requirements 9.2 (Explain this step button)
        if (this.btnExplain) {
            this.btnExplain.addEventListener('click', () => this.onExplain());
        }
        
        // Explanation close button
        if (this.explanationCloseBtn) {
            this.explanationCloseBtn.addEventListener('click', () => this.hideExplanation());
        }
        
        // Close explanation when clicking outside
        if (this.explanationTooltip) {
            document.addEventListener('click', (e) => {
                if (this.explanationTooltip.classList.contains('visible') &&
                    !this.explanationTooltip.contains(e.target) &&
                    e.target !== this.btnExplain) {
                    this.hideExplanation();
                }
            });
        }
    }
    
    /**
     * Advances to the next execution state
     * Validates: Requirements 8.6 (Step Forward advances execution by one step)
     */
    onStepForward() {
        // Hide explanation tooltip when stepping
        // Validates: Requirements 9.6 (tooltip dismissed when advancing to another step)
        this.hideExplanation();
        
        // Attempt to step forward in the state store
        const success = this.stateStore.stepForward();
        
        if (success) {
            // Get the new current state
            const state = this.stateStore.getCurrentState();
            
            // Update all visualization panels
            if (state) {
                this.animationManager.updateAll(state);
            }
            
            // Update button disabled states
            this.updateButtonStates();
        }
    }
    
    /**
     * Returns to the previous execution state
     * Validates: Requirements 8.7 (Step Back reverses execution by one step)
     */
    onStepBack() {
        // Hide explanation tooltip when stepping
        // Validates: Requirements 9.6 (tooltip dismissed when advancing to another step)
        this.hideExplanation();
        
        // Attempt to step back in the state store
        const success = this.stateStore.stepBack();
        
        if (success) {
            // Get the new current state
            const state = this.stateStore.getCurrentState();
            
            // Update all visualization panels
            if (state) {
                this.animationManager.updateAll(state);
            }
            
            // Update button disabled states
            this.updateButtonStates();
        }
    }
    
    /**
     * Resets execution to the initial state
     * Validates: Requirements 8.9 (Reset returns execution to initial state)
     */
    onReset() {
        // Stop auto-play if active
        if (this.isPlaying) {
            this.stopAutoPlay();
        }
        
        // Reset state store to beginning
        this.stateStore.reset();
        
        // Get the initial state
        const state = this.stateStore.getCurrentState();
        
        // Update all visualization panels
        if (state) {
            this.animationManager.updateAll(state);
        }
        
        // Update button disabled states
        this.updateButtonStates();
    }
    
    /**
     * Starts automatic stepping with configurable speed
     * Validates: Requirements 8.8 (Auto-play automatically advances execution at configurable speed)
     * 
     * Speed calculation: interval = 1000ms / speed
     * - 0.5x speed = 2000ms interval (slower)
     * - 1.0x speed = 1000ms interval (default)
     * - 2.0x speed = 500ms interval (faster)
     * - 3.0x speed = 333ms interval (fastest)
     */
    startAutoPlay() {
        // Don't start if already playing
        if (this.isPlaying) {
            return;
        }
        
        // Don't start if at the end
        if (!this.stateStore.canStepForward()) {
            return;
        }
        
        // Mark as playing
        this.isPlaying = true;
        
        // Update button appearance
        if (this.btnAutoPlay) {
            this.btnAutoPlay.classList.add('playing');
            // Change icon to pause symbol
            const icon = this.btnAutoPlay.querySelector('.control-btn-icon');
            if (icon) {
                icon.textContent = '⏸';
            }
        }
        
        // Calculate interval based on speed (1000ms / speed)
        const interval = 1000 / this.currentSpeed;
        
        // Start auto-play interval
        this.autoPlayInterval = setInterval(() => {
            // Step forward
            const success = this.stateStore.stepForward();
            
            if (success) {
                // Get the new current state
                const state = this.stateStore.getCurrentState();
                
                // Update all visualization panels
                if (state) {
                    this.animationManager.updateAll(state);
                }
                
                // Update button disabled states
                this.updateButtonStates();
                
                // Check if we've reached the end
                if (!this.stateStore.canStepForward()) {
                    this.stopAutoPlay();
                }
            } else {
                // Failed to step forward, stop auto-play
                this.stopAutoPlay();
            }
        }, interval);
        
        // Update button states
        this.updateButtonStates();
    }
    
    /**
     * Stops automatic stepping
     * Validates: Requirements 8.8 (Auto-play can be stopped)
     */
    stopAutoPlay() {
        // Clear the interval
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        
        // Mark as not playing
        this.isPlaying = false;
        
        // Update button appearance
        if (this.btnAutoPlay) {
            this.btnAutoPlay.classList.remove('playing');
            // Change icon back to play symbol
            const icon = this.btnAutoPlay.querySelector('.control-btn-icon');
            if (icon) {
                icon.textContent = '▶';
            }
        }
        
        // Update button states
        this.updateButtonStates();
    }
    
    /**
     * Updates button disabled states based on current navigation position
     * 
     * Button state rules:
     * - Step Forward: disabled when at end (canStepForward = false)
     * - Step Back: disabled when at beginning (canStepBack = false)
     * - Auto-play: disabled when at end (canStepForward = false)
     * - Reset: disabled when at beginning (canStepBack = false)
     * - Explain: disabled when no current state
     */
    updateButtonStates() {
        const canStepForward = this.stateStore.canStepForward();
        const canStepBack = this.stateStore.canStepBack();
        const hasState = this.stateStore.getCurrentState() !== null;
        
        // Step Forward button: disabled when at end
        if (this.btnStepForward) {
            this.btnStepForward.disabled = !canStepForward;
        }
        
        // Step Back button: disabled when at beginning
        if (this.btnStepBack) {
            this.btnStepBack.disabled = !canStepBack;
        }
        
        // Auto-play button: disabled when at end (unless currently playing)
        if (this.btnAutoPlay) {
            this.btnAutoPlay.disabled = !canStepForward && !this.isPlaying;
        }
        
        // Reset button: disabled when at beginning
        if (this.btnReset) {
            this.btnReset.disabled = !canStepBack;
        }
        
        // Explain button: disabled when no state
        if (this.btnExplain) {
            this.btnExplain.disabled = !hasState;
        }
    }
    
    /**
     * Updates the speed display to show current speed multiplier
     */
    updateSpeedDisplay() {
        if (this.speedDisplay) {
            this.speedDisplay.textContent = `${this.currentSpeed.toFixed(1)}x`;
        }
    }
    
    /**
     * Shows the step explanation tooltip
     * Validates: Requirements 9.2, 9.3, 9.4, 9.5, 9.6
     * - 9.2: Display tooltip when "Explain this step" is clicked
     * - 9.3: Explain the bytecode instruction being executed
     * - 9.4: Explain the effect on the call stack if applicable
     * - 9.5: Explain the effect on memory if applicable
     * - 9.6: Tooltip remains visible until dismissed or step changes
     */
    onExplain() {
        // Get the current execution state
        const state = this.stateStore.getCurrentState();
        
        if (!state) {
            console.warn('No current state to explain');
            return;
        }
        
        // Build the explanation content
        this.buildExplanationContent(state);
        
        // Show the tooltip
        this.showExplanation();
    }
    
    /**
     * Builds the explanation content from the execution state
     * @param {ExecutionState} state - Current execution state
     */
    buildExplanationContent(state) {
        if (!this.explanationContent) {
            return;
        }
        
        // Clear existing content
        this.explanationContent.innerHTML = '';
        
        // Main explanation text
        if (state.explanation) {
            const mainSection = document.createElement('div');
            mainSection.className = 'explanation-section';
            
            const mainContent = document.createElement('div');
            mainContent.className = 'explanation-section-content';
            mainContent.textContent = state.explanation;
            
            mainSection.appendChild(mainContent);
            this.explanationContent.appendChild(mainSection);
        }
        
        // Bytecode instruction section
        // Validates: Requirements 9.3 (explain bytecode instruction)
        if (state.bytecode && state.instructionPointer !== null && state.instructionPointer !== undefined) {
            const currentInstruction = state.bytecode.find(
                instr => instr.offset === state.instructionPointer
            );
            
            if (currentInstruction) {
                const bytecodeSection = document.createElement('div');
                bytecodeSection.className = 'explanation-section';
                
                const bytecodeTitle = document.createElement('div');
                bytecodeTitle.className = 'explanation-section-title';
                bytecodeTitle.textContent = 'Instrucción Bytecode';
                
                const bytecodeContent = document.createElement('div');
                bytecodeContent.className = 'explanation-bytecode';
                
                let instructionText = `${currentInstruction.opname}`;
                if (currentInstruction.arg !== null && currentInstruction.arg !== undefined) {
                    instructionText += ` (${currentInstruction.arg})`;
                    if (currentInstruction.argval !== null && currentInstruction.argval !== undefined) {
                        instructionText += ` → ${currentInstruction.argval}`;
                    }
                }
                
                bytecodeContent.textContent = instructionText;
                
                bytecodeSection.appendChild(bytecodeTitle);
                bytecodeSection.appendChild(bytecodeContent);
                this.explanationContent.appendChild(bytecodeSection);
            }
        }
        
        // Stack effects section
        // Validates: Requirements 9.4 (explain effect on call stack)
        if (state.callStack && state.callStack.length > 0) {
            const stackSection = document.createElement('div');
            stackSection.className = 'explanation-section';
            
            const stackTitle = document.createElement('div');
            stackTitle.className = 'explanation-section-title';
            stackTitle.textContent = 'Pila de Llamadas';
            
            const stackEffect = document.createElement('div');
            stackEffect.className = 'explanation-effect';
            
            const stackIcon = document.createElement('span');
            stackIcon.className = 'explanation-effect-icon';
            stackIcon.textContent = '📚';
            
            const stackText = document.createElement('span');
            stackText.className = 'explanation-effect-text';
            
            const frameCount = state.callStack.length;
            const currentFrame = state.callStack[state.callStack.length - 1];
            
            if (frameCount === 1) {
                stackText.textContent = `Actualmente en ${currentFrame.functionName} (marco de ejecución principal)`;
            } else {
                stackText.textContent = `${frameCount} marcos en la pila. Ejecutando actualmente ${currentFrame.functionName}`;
            }
            
            stackEffect.appendChild(stackIcon);
            stackEffect.appendChild(stackText);
            stackSection.appendChild(stackTitle);
            stackSection.appendChild(stackEffect);
            this.explanationContent.appendChild(stackSection);
        }
        
        // Memory effects section
        // Validates: Requirements 9.5 (explain effect on memory)
        if (state.heap && state.heap.length > 0) {
            const memorySection = document.createElement('div');
            memorySection.className = 'explanation-section';
            
            const memoryTitle = document.createElement('div');
            memoryTitle.className = 'explanation-section-title';
            memoryTitle.textContent = 'Montículo de Memoria';
            
            const memoryEffect = document.createElement('div');
            memoryEffect.className = 'explanation-effect';
            
            const memoryIcon = document.createElement('span');
            memoryIcon.className = 'explanation-effect-icon';
            memoryIcon.textContent = '🧠';
            
            const memoryText = document.createElement('span');
            memoryText.className = 'explanation-effect-text';
            
            const objectCount = state.heap.length;
            const objectTypes = {};
            state.heap.forEach(obj => {
                objectTypes[obj.type] = (objectTypes[obj.type] || 0) + 1;
            });
            
            const typesSummary = Object.entries(objectTypes)
                .map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`)
                .join(', ');
            
            memoryText.textContent = `${objectCount} objeto${objectCount !== 1 ? 's' : ''} en montículo: ${typesSummary}`;
            
            memoryEffect.appendChild(memoryIcon);
            memoryEffect.appendChild(memoryText);
            memorySection.appendChild(memoryTitle);
            memorySection.appendChild(memoryEffect);
            this.explanationContent.appendChild(memorySection);
        }
        
        // Pipeline stage section
        if (state.pipelineStage) {
            const pipelineSection = document.createElement('div');
            pipelineSection.className = 'explanation-section';
            
            const pipelineTitle = document.createElement('div');
            pipelineTitle.className = 'explanation-section-title';
            pipelineTitle.textContent = 'Etapa del Pipeline';
            
            const pipelineEffect = document.createElement('div');
            pipelineEffect.className = 'explanation-effect';
            
            const pipelineIcon = document.createElement('span');
            pipelineIcon.className = 'explanation-effect-icon';
            pipelineIcon.textContent = '⚙️';
            
            const pipelineText = document.createElement('span');
            pipelineText.className = 'explanation-effect-text';
            
            const stageNames = {
                'source': 'Código Fuente',
                'tokenizer': 'Tokenizador',
                'parser': 'Analizador (AST)',
                'compiler': 'Compilador',
                'bytecode': 'Bytecode',
                'pvm': 'Máquina Virtual Python'
            };
            
            pipelineText.textContent = `Actualmente en la etapa: ${stageNames[state.pipelineStage] || state.pipelineStage}`;
            
            pipelineEffect.appendChild(pipelineIcon);
            pipelineEffect.appendChild(pipelineText);
            pipelineSection.appendChild(pipelineTitle);
            pipelineSection.appendChild(pipelineEffect);
            this.explanationContent.appendChild(pipelineSection);
        }
    }
    
    /**
     * Shows the explanation tooltip
     */
    showExplanation() {
        if (this.explanationTooltip) {
            this.explanationTooltip.classList.add('visible');
        }
    }
    
    /**
     * Hides the explanation tooltip
     */
    hideExplanation() {
        if (this.explanationTooltip) {
            this.explanationTooltip.classList.remove('visible');
        }
    }
}
