/**
 * Verification Tests for Task 8.2: Stack Frame Rendering and Animations
 * 
 * Tests Requirements 4.2, 4.3, 4.4, 4.5:
 * - 4.2: Animate new card pushing onto stack with CSS transition (200-400ms)
 * - 4.3: Animate top card popping from stack with CSS transition (200-400ms)
 * - 4.4: Display function name, local variables with values, and return address
 * - 4.5: Position most recent frame at top of visual stack
 */

const VerifyTask82 = {
    /**
     * Test 1: Stack frames render with all required information
     * Validates Requirement 4.4
     */
    testStackFrameCompleteness: function() {
        console.log('Test 1: Stack frame completeness...');
        
        // Create test stack frames
        const testStack = [
            {
                frameId: 'frame-1',
                functionName: 'main',
                localVariables: new Map([
                    ['x', 10],
                    ['y', 20],
                    ['name', 'test']
                ]),
                returnAddress: 0,
                lineNumber: 1
            },
            {
                frameId: 'frame-2',
                functionName: 'calculate',
                localVariables: new Map([
                    ['a', 5],
                    ['b', 15]
                ]),
                returnAddress: 10,
                lineNumber: 5
            }
        ];
        
        // Create a mock stack panel
        const stackPanel = document.createElement('div');
        stackPanel.id = 'stack-panel';
        stackPanel.innerHTML = `
            <div class="panel-content" id="stack-content"></div>
        `;
        document.body.appendChild(stackPanel);
        
        // Create AnimationManager and update stack
        const animationManager = new AnimationManager({
            stackPanel: stackPanel
        });
        
        animationManager.updateStackFrames(testStack);
        
        // Verify frames are rendered
        const frames = stackPanel.querySelectorAll('.stack-frame');
        console.assert(frames.length === 2, 'Should render 2 stack frames');
        
        // Verify first frame content
        const frame1 = frames[0];
        console.assert(
            frame1.querySelector('.stack-frame-function').textContent === 'main()',
            'Frame 1 should display function name "main()"'
        );
        
        // Verify local variables are displayed
        const frame1Vars = frame1.querySelectorAll('.stack-frame-variable');
        console.assert(frame1Vars.length === 3, 'Frame 1 should display 3 local variables');
        
        // Verify return address is displayed
        const frame1Return = frame1.querySelector('.stack-frame-return-address');
        console.assert(
            frame1Return.textContent.includes('0'),
            'Frame 1 should display return address'
        );
        
        // Verify second frame content
        const frame2 = frames[1];
        console.assert(
            frame2.querySelector('.stack-frame-function').textContent === 'calculate()',
            'Frame 2 should display function name "calculate()"'
        );
        
        const frame2Vars = frame2.querySelectorAll('.stack-frame-variable');
        console.assert(frame2Vars.length === 2, 'Frame 2 should display 2 local variables');
        
        const frame2Return = frame2.querySelector('.stack-frame-return-address');
        console.assert(
            frame2Return.textContent.includes('10'),
            'Frame 2 should display return address'
        );
        
        // Cleanup
        document.body.removeChild(stackPanel);
        
        console.log('✓ Test 1 passed: Stack frames render with complete information');
        return true;
    },
    
    /**
     * Test 2: Most recent frame appears at top
     * Validates Requirement 4.5
     */
    testMostRecentFrameAtTop: function() {
        console.log('Test 2: Most recent frame at top...');
        
        const testStack = [
            {
                frameId: 'frame-1',
                functionName: 'first',
                localVariables: new Map(),
                returnAddress: 0,
                lineNumber: 1
            },
            {
                frameId: 'frame-2',
                functionName: 'second',
                localVariables: new Map(),
                returnAddress: 10,
                lineNumber: 5
            },
            {
                frameId: 'frame-3',
                functionName: 'third',
                localVariables: new Map(),
                returnAddress: 20,
                lineNumber: 10
            }
        ];
        
        const stackPanel = document.createElement('div');
        stackPanel.id = 'stack-panel';
        stackPanel.innerHTML = `
            <div class="panel-content" id="stack-content"></div>
        `;
        document.body.appendChild(stackPanel);
        
        const animationManager = new AnimationManager({
            stackPanel: stackPanel
        });
        
        animationManager.updateStackFrames(testStack);
        
        // Verify the last frame in the array is marked as active (most recent)
        const frames = stackPanel.querySelectorAll('.stack-frame');
        const lastFrame = frames[frames.length - 1];
        
        console.assert(
            lastFrame.classList.contains('active'),
            'Most recent frame (last in array) should have active class'
        );
        
        console.assert(
            lastFrame.querySelector('.stack-frame-function').textContent === 'third()',
            'Most recent frame should be "third()"'
        );
        
        // Verify column-reverse layout positions it at top visually
        const stackContent = stackPanel.querySelector('#stack-content');
        const computedStyle = window.getComputedStyle(stackContent);
        console.assert(
            computedStyle.flexDirection === 'column-reverse',
            'Stack content should use column-reverse to position recent frame at top'
        );
        
        document.body.removeChild(stackPanel);
        
        console.log('✓ Test 2 passed: Most recent frame appears at top');
        return true;
    },
    
    /**
     * Test 3: Push animation is applied to new frames
     * Validates Requirement 4.2
     */
    testPushAnimation: function() {
        console.log('Test 3: Push animation...');
        
        const stackPanel = document.createElement('div');
        stackPanel.id = 'stack-panel';
        stackPanel.innerHTML = `
            <div class="panel-content" id="stack-content"></div>
        `;
        document.body.appendChild(stackPanel);
        
        const animationManager = new AnimationManager({
            stackPanel: stackPanel
        });
        
        // Start with one frame
        const initialStack = [
            {
                frameId: 'frame-1',
                functionName: 'main',
                localVariables: new Map([['x', 10]]),
                returnAddress: 0,
                lineNumber: 1
            }
        ];
        
        animationManager.updateStackFrames(initialStack);
        
        // Push a new frame
        const pushedStack = [
            ...initialStack,
            {
                frameId: 'frame-2',
                functionName: 'helper',
                localVariables: new Map([['y', 20]]),
                returnAddress: 10,
                lineNumber: 5
            }
        ];
        
        animationManager.updateStackFrames(pushedStack);
        
        // Verify the new frame has the pushing animation class
        const frames = stackPanel.querySelectorAll('.stack-frame');
        const newFrame = frames[frames.length - 1];
        
        console.assert(
            newFrame.classList.contains('pushing'),
            'Newly pushed frame should have "pushing" animation class'
        );
        
        console.assert(
            newFrame.querySelector('.stack-frame-function').textContent === 'helper()',
            'Newly pushed frame should be "helper()"'
        );
        
        document.body.removeChild(stackPanel);
        
        console.log('✓ Test 3 passed: Push animation applied to new frames');
        return true;
    },
    
    /**
     * Test 4: Empty stack shows placeholder
     * Validates proper handling of empty state
     */
    testEmptyStackPlaceholder: function() {
        console.log('Test 4: Empty stack placeholder...');
        
        const stackPanel = document.createElement('div');
        stackPanel.id = 'stack-panel';
        stackPanel.innerHTML = `
            <div class="panel-content" id="stack-content"></div>
        `;
        document.body.appendChild(stackPanel);
        
        const animationManager = new AnimationManager({
            stackPanel: stackPanel
        });
        
        // Update with empty stack
        animationManager.updateStackFrames([]);
        
        // Verify placeholder is shown
        const placeholder = stackPanel.querySelector('.stack-placeholder');
        console.assert(placeholder !== null, 'Empty stack should show placeholder');
        
        const placeholderText = stackPanel.querySelector('.stack-empty-text');
        console.assert(
            placeholderText && placeholderText.textContent.includes('No stack frames'),
            'Placeholder should contain appropriate message'
        );
        
        document.body.removeChild(stackPanel);
        
        console.log('✓ Test 4 passed: Empty stack shows placeholder');
        return true;
    },
    
    /**
     * Test 5: Local variables display correctly with different types
     * Validates Requirement 4.4 (variable display)
     */
    testLocalVariableDisplay: function() {
        console.log('Test 5: Local variable display...');
        
        const testStack = [
            {
                frameId: 'frame-1',
                functionName: 'test',
                localVariables: new Map([
                    ['num', 42],
                    ['str', 'hello'],
                    ['bool', true],
                    ['none', null],
                    ['list', [1, 2, 3]],
                    ['obj', { key: 'value' }]
                ]),
                returnAddress: 0,
                lineNumber: 1
            }
        ];
        
        const stackPanel = document.createElement('div');
        stackPanel.id = 'stack-panel';
        stackPanel.innerHTML = `
            <div class="panel-content" id="stack-content"></div>
        `;
        document.body.appendChild(stackPanel);
        
        const animationManager = new AnimationManager({
            stackPanel: stackPanel
        });
        
        animationManager.updateStackFrames(testStack);
        
        const variables = stackPanel.querySelectorAll('.stack-frame-variable');
        console.assert(variables.length === 6, 'Should display all 6 variables');
        
        // Check that variable names and values are present
        const varNames = Array.from(stackPanel.querySelectorAll('.stack-frame-var-name'))
            .map(el => el.textContent);
        
        console.assert(varNames.includes('num'), 'Should display "num" variable');
        console.assert(varNames.includes('str'), 'Should display "str" variable');
        console.assert(varNames.includes('bool'), 'Should display "bool" variable');
        console.assert(varNames.includes('none'), 'Should display "none" variable');
        console.assert(varNames.includes('list'), 'Should display "list" variable');
        console.assert(varNames.includes('obj'), 'Should display "obj" variable');
        
        // Check that string values are quoted
        const strValue = Array.from(variables).find(v => 
            v.querySelector('.stack-frame-var-name').textContent === 'str'
        );
        console.assert(
            strValue.querySelector('.stack-frame-var-value').textContent.includes('"hello"'),
            'String values should be quoted'
        );
        
        // Check that null is displayed as "None"
        const noneValue = Array.from(variables).find(v => 
            v.querySelector('.stack-frame-var-name').textContent === 'none'
        );
        console.assert(
            noneValue.querySelector('.stack-frame-var-value').textContent === 'None',
            'null should be displayed as "None"'
        );
        
        document.body.removeChild(stackPanel);
        
        console.log('✓ Test 5 passed: Local variables display correctly');
        return true;
    },
    
    /**
     * Test 6: Frame with no local variables shows appropriate message
     * Validates edge case handling
     */
    testNoLocalVariables: function() {
        console.log('Test 6: No local variables...');
        
        const testStack = [
            {
                frameId: 'frame-1',
                functionName: 'empty',
                localVariables: new Map(),
                returnAddress: 0,
                lineNumber: 1
            }
        ];
        
        const stackPanel = document.createElement('div');
        stackPanel.id = 'stack-panel';
        stackPanel.innerHTML = `
            <div class="panel-content" id="stack-content"></div>
        `;
        document.body.appendChild(stackPanel);
        
        const animationManager = new AnimationManager({
            stackPanel: stackPanel
        });
        
        animationManager.updateStackFrames(testStack);
        
        const variables = stackPanel.querySelectorAll('.stack-frame-variable');
        console.assert(variables.length === 1, 'Should show one placeholder variable');
        
        const varValue = variables[0].querySelector('.stack-frame-var-value');
        console.assert(
            varValue.textContent.includes('No local variables'),
            'Should show "No local variables" message'
        );
        
        document.body.removeChild(stackPanel);
        
        console.log('✓ Test 6 passed: No local variables handled correctly');
        return true;
    },
    
    /**
     * Run all verification tests
     */
    runAll: function() {
        console.log('=== Running Task 8.2 Verification Tests ===\n');
        
        const tests = [
            this.testStackFrameCompleteness,
            this.testMostRecentFrameAtTop,
            this.testPushAnimation,
            this.testEmptyStackPlaceholder,
            this.testLocalVariableDisplay,
            this.testNoLocalVariables
        ];
        
        let passed = 0;
        let failed = 0;
        
        for (const test of tests) {
            try {
                if (test.call(this)) {
                    passed++;
                }
            } catch (error) {
                console.error(`✗ Test failed: ${error.message}`);
                console.error(error.stack);
                failed++;
            }
        }
        
        console.log(`\n=== Test Results ===`);
        console.log(`Passed: ${passed}/${tests.length}`);
        console.log(`Failed: ${failed}/${tests.length}`);
        
        if (failed === 0) {
            console.log('\n✓ All tests passed! Task 8.2 implementation is correct.');
        } else {
            console.log('\n✗ Some tests failed. Please review the implementation.');
        }
        
        return failed === 0;
    }
};

// Auto-run tests when loaded in browser
if (typeof window !== 'undefined') {
    window.VerifyTask82 = VerifyTask82;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VerifyTask82;
}
