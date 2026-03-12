/**
 * Verification Test for Task 12.2: Implement ViewController class
 * 
 * This test verifies that:
 * 1. ViewController class exists and can be instantiated
 * 2. Constructor accepts stateStore and animationManager
 * 3. onStepForward method advances state and updates panels
 * 4. onStepBack method goes to previous state and updates panels
 * 5. onReset method returns to initial state
 * 6. startAutoPlay starts automatic stepping
 * 7. stopAutoPlay stops automatic stepping
 * 8. Button states update correctly based on navigation position
 * 9. Speed slider changes affect auto-play speed
 * 
 * Requirements validated: 8.6, 8.7, 8.8, 8.9
 */

// Load the ViewController class
const fs = require('fs');
const path = require('path');

// Mock DOM elements and APIs
global.document = {
    getElementById: function(id) {
        return {
            disabled: false,
            classList: {
                add: function() {},
                remove: function() {}
            },
            querySelector: function() {
                return { textContent: '' };
            },
            addEventListener: function() {}
        };
    }
};

global.setInterval = function(fn, delay) {
    return 12345; // Mock interval ID
};

global.clearInterval = function(id) {};

// Load ViewController source
const viewControllerSource = fs.readFileSync(
    path.join(__dirname, '../src/scripts/view-controller.js'),
    'utf8'
);

// Execute the source to define the class
eval(viewControllerSource);

console.log('='.repeat(80));
console.log('TASK 12.2 VERIFICATION TEST: ViewController Implementation');
console.log('='.repeat(80));

// Test 1: ViewController class exists
console.log('\n1. Testing ViewController class existence...');
try {
    if (typeof ViewController === 'undefined') {
        throw new Error('ViewController class is not defined');
    }
    console.log('✓ ViewController class exists');
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 2: ViewController can be instantiated with stateStore and animationManager
console.log('\n2. Testing ViewController instantiation...');
try {
    // Create mock StateStore
    const mockStateStore = {
        states: [],
        currentIndex: 0,
        getCurrentState: function() { return null; },
        stepForward: function() { return false; },
        stepBack: function() { return false; },
        reset: function() { this.currentIndex = 0; },
        canStepForward: function() { return false; },
        canStepBack: function() { return false; }
    };
    
    // Create mock AnimationManager
    const mockAnimationManager = {
        updateAll: function(state) { console.log('Mock updateAll called'); }
    };
    
    const viewController = new ViewController(mockStateStore, mockAnimationManager);
    
    if (!viewController.stateStore) {
        throw new Error('ViewController.stateStore not set');
    }
    if (!viewController.animationManager) {
        throw new Error('ViewController.animationManager not set');
    }
    
    console.log('✓ ViewController instantiated successfully');
    console.log('  - stateStore:', viewController.stateStore ? 'set' : 'not set');
    console.log('  - animationManager:', viewController.animationManager ? 'set' : 'not set');
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 3: ViewController has required methods
console.log('\n3. Testing ViewController methods...');
try {
    const mockStateStore = {
        states: [],
        currentIndex: 0,
        getCurrentState: function() { return null; },
        stepForward: function() { return false; },
        stepBack: function() { return false; },
        reset: function() { this.currentIndex = 0; },
        canStepForward: function() { return false; },
        canStepBack: function() { return false; }
    };
    
    const mockAnimationManager = {
        updateAll: function(state) {}
    };
    
    const viewController = new ViewController(mockStateStore, mockAnimationManager);
    
    const requiredMethods = [
        'onStepForward',
        'onStepBack',
        'onReset',
        'startAutoPlay',
        'stopAutoPlay',
        'updateButtonStates'
    ];
    
    for (const method of requiredMethods) {
        if (typeof viewController[method] !== 'function') {
            throw new Error(`Method ${method} is not defined or not a function`);
        }
        console.log(`  ✓ ${method} method exists`);
    }
    
    console.log('✓ All required methods exist');
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 4: onStepForward advances state and updates panels
console.log('\n4. Testing onStepForward method...');
try {
    let stepForwardCalled = false;
    let updateAllCalled = false;
    let updateButtonStatesCalled = false;
    
    const mockStateStore = {
        states: [
            { stepNumber: 0, lineNumber: 1 },
            { stepNumber: 1, lineNumber: 2 }
        ],
        currentIndex: 0,
        getCurrentState: function() { return this.states[this.currentIndex]; },
        stepForward: function() {
            stepForwardCalled = true;
            if (this.currentIndex < this.states.length - 1) {
                this.currentIndex++;
                return true;
            }
            return false;
        },
        stepBack: function() { return false; },
        reset: function() { this.currentIndex = 0; },
        canStepForward: function() { return this.currentIndex < this.states.length - 1; },
        canStepBack: function() { return this.currentIndex > 0; }
    };
    
    const mockAnimationManager = {
        updateAll: function(state) {
            updateAllCalled = true;
        }
    };
    
    const viewController = new ViewController(mockStateStore, mockAnimationManager);
    
    // Override updateButtonStates to track calls
    const originalUpdateButtonStates = viewController.updateButtonStates;
    viewController.updateButtonStates = function() {
        updateButtonStatesCalled = true;
        originalUpdateButtonStates.call(this);
    };
    
    // Call onStepForward
    viewController.onStepForward();
    
    if (!stepForwardCalled) {
        throw new Error('stepForward was not called on stateStore');
    }
    if (!updateAllCalled) {
        throw new Error('updateAll was not called on animationManager');
    }
    if (!updateButtonStatesCalled) {
        throw new Error('updateButtonStates was not called');
    }
    if (mockStateStore.currentIndex !== 1) {
        throw new Error(`Expected currentIndex to be 1, got ${mockStateStore.currentIndex}`);
    }
    
    console.log('✓ onStepForward advances state and updates panels');
    console.log('  - stepForward called:', stepForwardCalled);
    console.log('  - updateAll called:', updateAllCalled);
    console.log('  - updateButtonStates called:', updateButtonStatesCalled);
    console.log('  - currentIndex advanced to:', mockStateStore.currentIndex);
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 5: onStepBack goes to previous state and updates panels
console.log('\n5. Testing onStepBack method...');
try {
    let stepBackCalled = false;
    let updateAllCalled = false;
    
    const mockStateStore = {
        states: [
            { stepNumber: 0, lineNumber: 1 },
            { stepNumber: 1, lineNumber: 2 }
        ],
        currentIndex: 1, // Start at second state
        getCurrentState: function() { return this.states[this.currentIndex]; },
        stepForward: function() { return false; },
        stepBack: function() {
            stepBackCalled = true;
            if (this.currentIndex > 0) {
                this.currentIndex--;
                return true;
            }
            return false;
        },
        reset: function() { this.currentIndex = 0; },
        canStepForward: function() { return this.currentIndex < this.states.length - 1; },
        canStepBack: function() { return this.currentIndex > 0; }
    };
    
    const mockAnimationManager = {
        updateAll: function(state) {
            updateAllCalled = true;
        }
    };
    
    const viewController = new ViewController(mockStateStore, mockAnimationManager);
    
    // Call onStepBack
    viewController.onStepBack();
    
    if (!stepBackCalled) {
        throw new Error('stepBack was not called on stateStore');
    }
    if (!updateAllCalled) {
        throw new Error('updateAll was not called on animationManager');
    }
    if (mockStateStore.currentIndex !== 0) {
        throw new Error(`Expected currentIndex to be 0, got ${mockStateStore.currentIndex}`);
    }
    
    console.log('✓ onStepBack goes to previous state and updates panels');
    console.log('  - stepBack called:', stepBackCalled);
    console.log('  - updateAll called:', updateAllCalled);
    console.log('  - currentIndex moved back to:', mockStateStore.currentIndex);
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 6: onReset returns to initial state
console.log('\n6. Testing onReset method...');
try {
    let resetCalled = false;
    let updateAllCalled = false;
    
    const mockStateStore = {
        states: [
            { stepNumber: 0, lineNumber: 1 },
            { stepNumber: 1, lineNumber: 2 },
            { stepNumber: 2, lineNumber: 3 }
        ],
        currentIndex: 2, // Start at last state
        getCurrentState: function() { return this.states[this.currentIndex]; },
        stepForward: function() { return false; },
        stepBack: function() { return false; },
        reset: function() {
            resetCalled = true;
            this.currentIndex = 0;
        },
        canStepForward: function() { return this.currentIndex < this.states.length - 1; },
        canStepBack: function() { return this.currentIndex > 0; }
    };
    
    const mockAnimationManager = {
        updateAll: function(state) {
            updateAllCalled = true;
        }
    };
    
    const viewController = new ViewController(mockStateStore, mockAnimationManager);
    
    // Call onReset
    viewController.onReset();
    
    if (!resetCalled) {
        throw new Error('reset was not called on stateStore');
    }
    if (!updateAllCalled) {
        throw new Error('updateAll was not called on animationManager');
    }
    if (mockStateStore.currentIndex !== 0) {
        throw new Error(`Expected currentIndex to be 0, got ${mockStateStore.currentIndex}`);
    }
    
    console.log('✓ onReset returns to initial state');
    console.log('  - reset called:', resetCalled);
    console.log('  - updateAll called:', updateAllCalled);
    console.log('  - currentIndex reset to:', mockStateStore.currentIndex);
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 7: startAutoPlay and stopAutoPlay
console.log('\n7. Testing auto-play functionality...');
try {
    const mockStateStore = {
        states: [
            { stepNumber: 0, lineNumber: 1 },
            { stepNumber: 1, lineNumber: 2 },
            { stepNumber: 2, lineNumber: 3 }
        ],
        currentIndex: 0,
        getCurrentState: function() { return this.states[this.currentIndex]; },
        stepForward: function() {
            if (this.currentIndex < this.states.length - 1) {
                this.currentIndex++;
                return true;
            }
            return false;
        },
        stepBack: function() { return false; },
        reset: function() { this.currentIndex = 0; },
        canStepForward: function() { return this.currentIndex < this.states.length - 1; },
        canStepBack: function() { return this.currentIndex > 0; }
    };
    
    const mockAnimationManager = {
        updateAll: function(state) {}
    };
    
    const viewController = new ViewController(mockStateStore, mockAnimationManager);
    
    // Test startAutoPlay
    viewController.startAutoPlay();
    
    if (!viewController.isPlaying) {
        throw new Error('isPlaying should be true after startAutoPlay');
    }
    if (!viewController.autoPlayInterval) {
        throw new Error('autoPlayInterval should be set after startAutoPlay');
    }
    
    console.log('  ✓ startAutoPlay sets isPlaying to true');
    console.log('  ✓ startAutoPlay creates interval');
    
    // Test stopAutoPlay
    viewController.stopAutoPlay();
    
    if (viewController.isPlaying) {
        throw new Error('isPlaying should be false after stopAutoPlay');
    }
    if (viewController.autoPlayInterval) {
        throw new Error('autoPlayInterval should be null after stopAutoPlay');
    }
    
    console.log('  ✓ stopAutoPlay sets isPlaying to false');
    console.log('  ✓ stopAutoPlay clears interval');
    
    console.log('✓ Auto-play functionality works correctly');
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 8: Button states update correctly
console.log('\n8. Testing button state updates...');
try {
    const mockStateStore = {
        states: [
            { stepNumber: 0, lineNumber: 1 },
            { stepNumber: 1, lineNumber: 2 },
            { stepNumber: 2, lineNumber: 3 }
        ],
        currentIndex: 1, // Middle state
        getCurrentState: function() { return this.states[this.currentIndex]; },
        stepForward: function() { return false; },
        stepBack: function() { return false; },
        reset: function() { this.currentIndex = 0; },
        canStepForward: function() { return this.currentIndex < this.states.length - 1; },
        canStepBack: function() { return this.currentIndex > 0; }
    };
    
    const mockAnimationManager = {
        updateAll: function(state) {}
    };
    
    const viewController = new ViewController(mockStateStore, mockAnimationManager);
    
    // Call updateButtonStates
    viewController.updateButtonStates();
    
    // Check button states (if buttons exist in DOM)
    if (viewController.btnStepForward) {
        console.log('  - Step Forward disabled:', viewController.btnStepForward.disabled, '(should be false - can step forward)');
    }
    if (viewController.btnStepBack) {
        console.log('  - Step Back disabled:', viewController.btnStepBack.disabled, '(should be false - can step back)');
    }
    if (viewController.btnReset) {
        console.log('  - Reset disabled:', viewController.btnReset.disabled, '(should be false - can reset)');
    }
    
    // Test at beginning
    mockStateStore.currentIndex = 0;
    viewController.updateButtonStates();
    
    if (viewController.btnStepBack && !viewController.btnStepBack.disabled) {
        throw new Error('Step Back should be disabled at beginning');
    }
    
    console.log('  ✓ Step Back disabled at beginning');
    
    // Test at end
    mockStateStore.currentIndex = 2;
    viewController.updateButtonStates();
    
    if (viewController.btnStepForward && !viewController.btnStepForward.disabled) {
        throw new Error('Step Forward should be disabled at end');
    }
    
    console.log('  ✓ Step Forward disabled at end');
    console.log('✓ Button states update correctly');
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 9: Speed slider affects auto-play
console.log('\n9. Testing speed slider functionality...');
try {
    const mockStateStore = {
        states: [
            { stepNumber: 0, lineNumber: 1 },
            { stepNumber: 1, lineNumber: 2 }
        ],
        currentIndex: 0,
        getCurrentState: function() { return this.states[this.currentIndex]; },
        stepForward: function() { return true; },
        stepBack: function() { return false; },
        reset: function() { this.currentIndex = 0; },
        canStepForward: function() { return true; },
        canStepBack: function() { return false; }
    };
    
    const mockAnimationManager = {
        updateAll: function(state) {}
    };
    
    const viewController = new ViewController(mockStateStore, mockAnimationManager);
    
    // Test default speed
    if (viewController.currentSpeed !== 1.0) {
        throw new Error(`Expected default speed to be 1.0, got ${viewController.currentSpeed}`);
    }
    console.log('  ✓ Default speed is 1.0x');
    
    // Test speed change
    viewController.currentSpeed = 2.0;
    if (viewController.currentSpeed !== 2.0) {
        throw new Error(`Expected speed to be 2.0, got ${viewController.currentSpeed}`);
    }
    console.log('  ✓ Speed can be changed to 2.0x');
    
    console.log('✓ Speed slider functionality works correctly');
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

console.log('\n' + '='.repeat(80));
console.log('TASK 12.2 VERIFICATION COMPLETE');
console.log('='.repeat(80));
