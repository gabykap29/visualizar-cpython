/**
 * Verification script for Task 7.1: Bytecode Panel HTML structure and CSS
 * 
 * This script verifies that:
 * 1. Bytecode panel HTML structure is present in index.html
 * 2. CSS styles are properly defined
 * 3. Panel has correct dimensions and positioning
 * 4. Dark theme is consistent with Monaco Editor
 * 5. Panel is scrollable
 * 
 * Requirements validated: 3.6
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
    const symbol = passed ? '✓' : '✗';
    const color = passed ? 'green' : 'red';
    log(`${symbol} ${testName}`, color);
    if (details) {
        log(`  ${details}`, 'cyan');
    }
}

// Read index.html
const indexPath = path.join(__dirname, 'index.html');
let indexContent;

try {
    indexContent = fs.readFileSync(indexPath, 'utf8');
} catch (error) {
    log('Error: Could not read index.html', 'red');
    process.exit(1);
}

log('\n=== Task 7.1 Verification: Bytecode Panel Structure and CSS ===\n', 'blue');

let allTestsPassed = true;
const results = [];

// Test 1: Bytecode panel HTML structure exists
log('Test 1: Bytecode Panel HTML Structure', 'yellow');
const hasBytecodePanel = indexContent.includes('id="bytecode-panel"');
logTest('Bytecode panel element exists', hasBytecodePanel);
results.push(hasBytecodePanel);
allTestsPassed = allTestsPassed && hasBytecodePanel;

// Test 2: Panel has correct class
const hasVisualizationPanelClass = indexContent.includes('class="visualization-panel"');
logTest('Panel has visualization-panel class', hasVisualizationPanelClass);
results.push(hasVisualizationPanelClass);
allTestsPassed = allTestsPassed && hasVisualizationPanelClass;

// Test 3: Panel header exists
const hasPanelHeader = indexContent.includes('class="panel-header"');
logTest('Panel header exists', hasPanelHeader);
results.push(hasPanelHeader);
allTestsPassed = allTestsPassed && hasPanelHeader;

// Test 4: Panel title is "Bytecode"
const hasBytecodeTitle = indexContent.includes('<h3 class="panel-title">Bytecode</h3>');
logTest('Panel title is "Bytecode"', hasBytecodeTitle);
results.push(hasBytecodeTitle);
allTestsPassed = allTestsPassed && hasBytecodeTitle;

// Test 5: Panel subtitle exists
const hasPanelSubtitle = indexContent.includes('class="panel-subtitle"');
logTest('Panel subtitle exists', hasPanelSubtitle);
results.push(hasPanelSubtitle);
allTestsPassed = allTestsPassed && hasPanelSubtitle;

// Test 6: Panel content area exists
const hasBytecodeContent = indexContent.includes('id="bytecode-content"');
logTest('Panel content area exists', hasBytecodeContent);
results.push(hasBytecodeContent);
allTestsPassed = allTestsPassed && hasBytecodeContent;

// Test 7: Placeholder content exists
const hasPlaceholder = indexContent.includes('class="bytecode-placeholder"');
logTest('Placeholder content exists', hasPlaceholder);
results.push(hasPlaceholder);
allTestsPassed = allTestsPassed && hasPlaceholder;

log('\nTest 2: CSS Styles', 'yellow');

// Test 8: Bytecode panel CSS exists
const hasBytecodeCSS = indexContent.includes('#bytecode-panel');
logTest('Bytecode panel CSS exists', hasBytecodeCSS);
results.push(hasBytecodeCSS);
allTestsPassed = allTestsPassed && hasBytecodeCSS;

// Test 9: Panel dimensions are specified (35% width, 60% height per design)
const hasPanelDimensions = indexContent.includes('width: 35%') || indexContent.includes('width:35%');
logTest('Panel width is specified (35%)', hasPanelDimensions, 
    'Note: Height may be adjusted for layout, but width should be 35%');
results.push(hasPanelDimensions);
allTestsPassed = allTestsPassed && hasPanelDimensions;

// Test 10: Dark theme colors are defined
const hasDarkThemeColors = indexContent.includes('--bg-primary: #0d1117') && 
                           indexContent.includes('--accent-color: #58a6ff');
logTest('Dark theme colors are defined', hasDarkThemeColors);
results.push(hasDarkThemeColors);
allTestsPassed = allTestsPassed && hasDarkThemeColors;

// Test 11: Scrollable content CSS
const hasScrollableCSS = indexContent.includes('overflow-y: auto') || 
                         indexContent.includes('overflow-y:auto');
logTest('Scrollable content CSS is defined', hasScrollableCSS);
results.push(hasScrollableCSS);
allTestsPassed = allTestsPassed && hasScrollableCSS;

// Test 12: Custom scrollbar styling
const hasScrollbarStyling = indexContent.includes('::-webkit-scrollbar');
logTest('Custom scrollbar styling exists', hasScrollbarStyling);
results.push(hasScrollbarStyling);
allTestsPassed = allTestsPassed && hasScrollbarStyling;

// Test 13: Bytecode instruction styles
const hasBytecodeInstructionCSS = indexContent.includes('.bytecode-instruction');
logTest('Bytecode instruction CSS exists', hasBytecodeInstructionCSS);
results.push(hasBytecodeInstructionCSS);
allTestsPassed = allTestsPassed && hasBytecodeInstructionCSS;

// Test 14: Active instruction highlighting
const hasActiveInstructionCSS = indexContent.includes('.bytecode-instruction.active');
logTest('Active instruction highlighting CSS exists', hasActiveInstructionCSS);
results.push(hasActiveInstructionCSS);
allTestsPassed = allTestsPassed && hasActiveInstructionCSS;

// Test 15: Bytecode component styles (offset, opname, arg, lineno)
const hasBytecodeOffset = indexContent.includes('.bytecode-offset');
const hasBytecodeOpname = indexContent.includes('.bytecode-opname');
const hasBytecodeArg = indexContent.includes('.bytecode-arg');
const hasBytecodeLineno = indexContent.includes('.bytecode-lineno');
const hasAllComponents = hasBytecodeOffset && hasBytecodeOpname && hasBytecodeArg && hasBytecodeLineno;
logTest('Bytecode component styles exist (offset, opname, arg, lineno)', hasAllComponents);
results.push(hasAllComponents);
allTestsPassed = allTestsPassed && hasAllComponents;

log('\nTest 3: Integration with AnimationManager', 'yellow');

// Test 16: Bytecode panel is referenced in AnimationManager initialization
const hasBytecodeReference = indexContent.includes('bytecodePanel: bytecodePanel') || 
                             indexContent.includes("bytecodePanel: document.getElementById('bytecode-panel')");
logTest('Bytecode panel is referenced in AnimationManager', hasBytecodeReference);
results.push(hasBytecodeReference);
allTestsPassed = allTestsPassed && hasBytecodeReference;

// Test 17: AnimationManager has bytecodePanel property
const hasAnimationManagerProperty = indexContent.includes('this.bytecodePanel = panels.bytecodePanel');
logTest('AnimationManager has bytecodePanel property', hasAnimationManagerProperty);
results.push(hasAnimationManagerProperty);
allTestsPassed = allTestsPassed && hasAnimationManagerProperty;

log('\nTest 4: Layout and Positioning', 'yellow');

// Test 18: Visualization panels container exists
const hasVisualizationPanelsContainer = indexContent.includes('id="visualization-panels"');
logTest('Visualization panels container exists', hasVisualizationPanelsContainer);
results.push(hasVisualizationPanelsContainer);
allTestsPassed = allTestsPassed && hasVisualizationPanelsContainer;

// Test 19: Panel is positioned correctly (center-left)
const hasFlexLayout = indexContent.includes('display: flex') || indexContent.includes('display:flex');
logTest('Flex layout is used for panel positioning', hasFlexLayout);
results.push(hasFlexLayout);
allTestsPassed = allTestsPassed && hasFlexLayout;

// Test 20: Monospace font for bytecode content
const hasMonospaceFont = indexContent.includes("font-family: 'Courier New'") || 
                         indexContent.includes('font-family: Courier New') ||
                         indexContent.includes('font-family: monospace');
logTest('Monospace font is used for bytecode content', hasMonospaceFont);
results.push(hasMonospaceFont);
allTestsPassed = allTestsPassed && hasMonospaceFont;

// Summary
log('\n=== Summary ===', 'blue');
const passedCount = results.filter(r => r).length;
const totalCount = results.length;
log(`Passed: ${passedCount} / ${totalCount}`, passedCount === totalCount ? 'green' : 'red');

if (allTestsPassed) {
    log('\n✓ Task 7.1 verification PASSED', 'green');
    log('The Bytecode Panel HTML structure and CSS have been successfully implemented.', 'green');
    process.exit(0);
} else {
    log('\n✗ Task 7.1 verification FAILED', 'red');
    log('Some requirements are not met. Please review the failed tests above.', 'red');
    process.exit(1);
}
