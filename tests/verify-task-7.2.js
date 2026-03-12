/**
 * Verification Test for Task 7.2: Bytecode Rendering with Instruction Pointer Highlighting
 * 
 * Tests the updateBytecodePointer method in AnimationManager
 * Validates Requirements 3.2, 3.3, 3.4, 3.5
 */

// Test data: Sample bytecode instructions
const sampleBytecode = [
    {
        offset: 0,
        opname: 'LOAD_CONST',
        arg: 0,
        argval: 5,
        lineno: 1
    },
    {
        offset: 2,
        opname: 'STORE_NAME',
        arg: 0,
        argval: 'x',
        lineno: 1
    },
    {
        offset: 4,
        opname: 'LOAD_CONST',
        arg: 1,
        argval: 10,
        lineno: 2
    },
    {
        offset: 6,
        opname: 'STORE_NAME',
        arg: 1,
        argval: 'y',
        lineno: 2
    },
    {
        offset: 8,
        opname: 'LOAD_NAME',
        arg: 0,
        argval: 'x',
        lineno: 3
    },
    {
        offset: 10,
        opname: 'LOAD_NAME',
        arg: 1,
        argval: 'y',
        lineno: 3
    },
    {
        offset: 12,
        opname: 'BINARY_ADD',
        arg: null,
        argval: null,
        lineno: 3
    },
    {
        offset: 14,
        opname: 'STORE_NAME',
        arg: 2,
        argval: 'result',
        lineno: 3
    },
    {
        offset: 16,
        opname: 'LOAD_CONST',
        arg: 2,
        argval: null,
        lineno: 3
    },
    {
        offset: 18,
        opname: 'RETURN_VALUE',
        arg: null,
        argval: null,
        lineno: 3
    }
];

function runTests() {
    const results = [];
    
    // Test 1: Bytecode panel exists
    const bytecodePanel = document.getElementById('bytecode-panel');
    results.push({
        name: 'Bytecode panel exists',
        passed: bytecodePanel !== null,
        message: bytecodePanel ? 'Panel found' : 'Panel not found'
    });
    
    // Test 2: Bytecode content element exists
    const bytecodeContent = document.getElementById('bytecode-content');
    results.push({
        name: 'Bytecode content element exists',
        passed: bytecodeContent !== null,
        message: bytecodeContent ? 'Content element found' : 'Content element not found'
    });
    
    // Create AnimationManager instance
    const animationManager = new AnimationManager({
        monacoEditor: null,
        pipelineDiagram: null,
        bytecodePanel: bytecodePanel,
        stackPanel: null,
        memoryPanel: null,
        gilIndicator: null
    });
    
    // Test 3: Empty bytecode shows placeholder
    animationManager.updateBytecodePointer(null, []);
    const hasPlaceholder = bytecodeContent.querySelector('.bytecode-placeholder') !== null;
    results.push({
        name: 'Empty bytecode shows placeholder',
        passed: hasPlaceholder,
        message: hasPlaceholder ? 'Placeholder displayed' : 'Placeholder not displayed'
    });
    
    // Test 4: Render bytecode instructions
    animationManager.updateBytecodePointer(0, sampleBytecode);
    const instructions = bytecodeContent.querySelectorAll('.bytecode-instruction');
    results.push({
        name: 'All bytecode instructions rendered',
        passed: instructions.length === sampleBytecode.length,
        message: `Expected ${sampleBytecode.length} instructions, found ${instructions.length}`
    });
    
    // Test 5: Each instruction has offset (Requirement 3.5)
    let allHaveOffsets = true;
    instructions.forEach((inst, index) => {
        const offsetElement = inst.querySelector('.bytecode-offset');
        if (!offsetElement || offsetElement.textContent !== String(sampleBytecode[index].offset)) {
            allHaveOffsets = false;
        }
    });
    results.push({
        name: 'All instructions display offset numbers (Req 3.5)',
        passed: allHaveOffsets,
        message: allHaveOffsets ? 'All offsets displayed correctly' : 'Some offsets missing or incorrect'
    });
    
    // Test 6: Each instruction has opname (Requirement 3.2)
    let allHaveOpnames = true;
    instructions.forEach((inst, index) => {
        const opnameElement = inst.querySelector('.bytecode-opname');
        if (!opnameElement || opnameElement.textContent !== sampleBytecode[index].opname) {
            allHaveOpnames = false;
        }
    });
    results.push({
        name: 'All instructions display opname (Req 3.2)',
        passed: allHaveOpnames,
        message: allHaveOpnames ? 'All opnames displayed correctly' : 'Some opnames missing or incorrect'
    });
    
    // Test 7: Instructions with args display them (Requirement 3.3)
    let argsDisplayedCorrectly = true;
    instructions.forEach((inst, index) => {
        const argElement = inst.querySelector('.bytecode-arg');
        const expectedArg = sampleBytecode[index].arg;
        
        if (expectedArg !== null && expectedArg !== undefined) {
            // Should have arg displayed
            if (!argElement || argElement.textContent.trim() === '') {
                argsDisplayedCorrectly = false;
            }
        }
    });
    results.push({
        name: 'Instructions with arguments display them (Req 3.3)',
        passed: argsDisplayedCorrectly,
        message: argsDisplayedCorrectly ? 'All args displayed correctly' : 'Some args missing'
    });
    
    // Test 8: Current instruction is highlighted (Requirement 3.4)
    const activeInstruction = bytecodeContent.querySelector('.bytecode-instruction.active');
    const firstInstructionActive = activeInstruction && 
        activeInstruction.getAttribute('data-offset') === '0';
    results.push({
        name: 'Current instruction highlighted (Req 3.4)',
        passed: firstInstructionActive,
        message: firstInstructionActive ? 'Instruction at offset 0 is highlighted' : 'No instruction highlighted or wrong instruction'
    });
    
    // Test 9: Highlight moves with instruction pointer
    animationManager.updateBytecodePointer(8, sampleBytecode);
    const newActiveInstruction = bytecodeContent.querySelector('.bytecode-instruction.active');
    const correctInstructionActive = newActiveInstruction && 
        newActiveInstruction.getAttribute('data-offset') === '8';
    results.push({
        name: 'Highlight moves with instruction pointer',
        passed: correctInstructionActive,
        message: correctInstructionActive ? 'Instruction at offset 8 is highlighted' : 'Wrong instruction highlighted'
    });
    
    // Test 10: Only one instruction is highlighted at a time
    const allActiveInstructions = bytecodeContent.querySelectorAll('.bytecode-instruction.active');
    results.push({
        name: 'Only one instruction highlighted at a time',
        passed: allActiveInstructions.length === 1,
        message: `Found ${allActiveInstructions.length} active instructions, expected 1`
    });
    
    // Test 11: Accent color is applied to active instruction
    if (newActiveInstruction) {
        const hasAccentBorder = window.getComputedStyle(newActiveInstruction).borderLeftColor !== 'rgba(0, 0, 0, 0)';
        results.push({
            name: 'Active instruction has accent color styling',
            passed: hasAccentBorder,
            message: hasAccentBorder ? 'Accent border applied' : 'No accent border found'
        });
    } else {
        results.push({
            name: 'Active instruction has accent color styling',
            passed: false,
            message: 'No active instruction to check'
        });
    }
    
    // Test 12: Line numbers are displayed
    let allHaveLineNumbers = true;
    instructions.forEach((inst, index) => {
        const linenoElement = inst.querySelector('.bytecode-lineno');
        if (!linenoElement || !linenoElement.textContent.includes(String(sampleBytecode[index].lineno))) {
            allHaveLineNumbers = false;
        }
    });
    results.push({
        name: 'All instructions display line numbers',
        passed: allHaveLineNumbers,
        message: allHaveLineNumbers ? 'All line numbers displayed' : 'Some line numbers missing'
    });
    
    // Test 13: Instructions without args show empty arg field
    animationManager.updateBytecodePointer(12, sampleBytecode); // BINARY_ADD has no arg
    const binaryAddInstruction = Array.from(bytecodeContent.querySelectorAll('.bytecode-instruction'))
        .find(inst => inst.getAttribute('data-offset') === '12');
    
    if (binaryAddInstruction) {
        const argElement = binaryAddInstruction.querySelector('.bytecode-arg');
        const argIsEmpty = argElement && argElement.textContent.trim() === '';
        results.push({
            name: 'Instructions without args show empty arg field',
            passed: argIsEmpty,
            message: argIsEmpty ? 'Empty arg field for BINARY_ADD' : 'Arg field not empty'
        });
    } else {
        results.push({
            name: 'Instructions without args show empty arg field',
            passed: false,
            message: 'Could not find BINARY_ADD instruction'
        });
    }
    
    return results;
}

// Run tests when page loads
window.addEventListener('load', () => {
    const results = runTests();
    
    // Display results
    const resultsContainer = document.getElementById('test-results');
    let passCount = 0;
    let failCount = 0;
    
    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.className = `test-result ${result.passed ? 'pass' : 'fail'}`;
        resultDiv.innerHTML = `
            <span class="test-status">${result.passed ? '✓' : '✗'}</span>
            <span class="test-name">${result.name}</span>
            <span class="test-message">${result.message}</span>
        `;
        resultsContainer.appendChild(resultDiv);
        
        if (result.passed) passCount++;
        else failCount++;
    });
    
    // Display summary
    const summary = document.getElementById('test-summary');
    summary.textContent = `Tests: ${passCount} passed, ${failCount} failed, ${results.length} total`;
    summary.className = failCount === 0 ? 'pass' : 'fail';
});
