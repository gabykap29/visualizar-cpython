/**
         * StateStore - Manages execution states and navigation
         * Maintains array of pre-computed execution states enabling bidirectional navigation
         */
        class StateStore {
            constructor() {
                this.states = [];
                this.currentIndex = 0;
            }
            
            /**
             * Sets the array of execution states and resets to the beginning
             * @param {ExecutionState[]} states - Array of execution states
             */
            setStates(states) {
                this.states = states;
                this.currentIndex = 0;
            }
            
            /**
             * Gets the current execution state
             * @returns {ExecutionState|null} Current state or null if no states
             */
            getCurrentState() {
                if (this.states.length === 0) {
                    return null;
                }
                return this.states[this.currentIndex];
            }
            
            /**
             * Advances to the next execution state
             * @returns {boolean} True if advanced, false if already at end
             */
            stepForward() {
                if (this.currentIndex < this.states.length - 1) {
                    this.currentIndex++;
                    return true;
                }
                return false;
            }
            
            /**
             * Returns to the previous execution state
             * @returns {boolean} True if moved back, false if already at beginning
             */
            stepBack() {
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                    return true;
                }
                return false;
            }
            
            /**
             * Resets to the initial execution state
             */
            reset() {
                this.currentIndex = 0;
            }
            
            /**
             * Checks if can step forward
             * @returns {boolean} True if not at the end
             */
            canStepForward() {
                return this.currentIndex < this.states.length - 1;
            }
            
            /**
             * Checks if can step back
             * @returns {boolean} True if not at the beginning
             */
            canStepBack() {
                return this.currentIndex > 0;
            }
        }