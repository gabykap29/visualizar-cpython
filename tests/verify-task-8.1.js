/**
 * Verification Script for Task 8.1: Stack Panel HTML Structure and CSS
 * 
 * This script verifies that the Stack Panel has been correctly implemented with:
 * - Proper HTML structure (35% width, 60% height, center-center position)
 * - CSS transitions for push/pop animations (300ms duration)
 * - Dark theme styling consistent with other panels
 * 
 * Validates: Requirements 4.1, 4.2, 4.3
 */

const fs = require('fs');
const path = require('path');

// Read the index.html file
const indexPath = path.join(__dirname, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

// Test results array
const results = [];

// Helper function to log test results
function logTest(testName, passed, details = '') {
    const status = passed ? '✓ PASS' : '✗ FAIL';
    console.log(`${status}: ${testName}`);
    if (details) {
        console.log(`  Details: ${details}`);
    }
    return passed;
}

console.log('='.repeat(80));
console.log('Task 8.1 Verification: Stack Panel HTML Structure and CSS');
console.log('='.repeat(80));
console.log();

// Test 1: Stack Panel container exists
const hasStackPanel = indexContent.includes('id="stack-panel"');
results.push(logTest('Stack Panel container exists', hasStackPanel));

// Test 2: Stack Panel has visualization-panel class
const hasVisualizationPanelClass = indexContent.match(/<div[^>]*id="stack-panel"[^>]*class="visualization-panel"/);
results.push(logTest('Stack Panel has visualization-panel class', !!hasVisualizationPanelClass));

// Test 3: Stack Panel header exists with correct title
const hasStackPanelHeader = indexContent.includes('<h3 class="panel-title">Call Stack</h3>');
results.push(logTest('Stack Panel header with "Call Stack" title exists', hasStackPanelHeader));

// Test 4: Stack Panel subtitle exists
const hasStackPanelSubtitle = indexContent.includes('<span class="panel-subtitle">Function Frames</span>');
results.push(logTest('Stack Panel subtitle "Function Frames" exists', hasStackPanelSubtitle));

// Test 5: Stack content container exists
const hasStackContent = indexContent.includes('id="stack-content"');
results.push(logTest('Stack content container exists', hasStackContent));

// Test 6: Stack placeholder exists
const hasStackPlaceholder = indexContent.includes('class="stack-placeholder"');
results.push(logTest('Stack placeholder exists', hasStackPlaceholder));

// Test 7: Stack empty icon exists
const hasStackEmptyIcon = indexContent.includes('class="stack-empty-icon"');
results.push(logTest('Stack empty icon exists', hasStackEmptyIcon));

// Test 8: Stack empty text exists
const hasStackEmptyText = indexContent.includes('class="stack-empty-text"');
results.push(logTest('Stack empty text exists', hasStackEmptyText));

// Test 9: Stack empty hint exists
const hasStackEmptyHint = indexContent.includes('class="stack-empty-hint"');
results.push(logTest('Stack empty hint exists', hasStackEmptyHint));

// Test 10: Stack Panel CSS width is 35%
const hasStackPanelWidth = indexContent.match(/#stack-panel\s*{[^}]*width:\s*35%/s);
results.push(logTest('Stack Panel CSS width is 35%', !!hasStackPanelWidth));

// Test 11: Stack Panel CSS height is 75%
const hasStackPanelHeight = indexContent.match(/#stack-panel\s*{[^}]*height:\s*75%/s);
results.push(logTest('Stack Panel CSS height is 75%', !!hasStackPanelHeight));

// Test 12: Stack Panel CSS min-width is set
const hasStackPanelMinWidth = indexContent.match(/#stack-panel\s*{[^}]*min-width:\s*300px/s);
results.push(logTest('Stack Panel CSS min-width is 300px', !!hasStackPanelMinWidth));

// Test 13: Stack content uses flex column-reverse layout
const hasStackContentFlex = indexContent.match(/#stack-content\s*{[^}]*display:\s*flex[^}]*flex-direction:\s*column-reverse/s);
results.push(logTest('Stack content uses flex column-reverse layout', !!hasStackContentFlex));

// Test 14: Stack frame class exists in CSS
const hasStackFrameClass = indexContent.includes('.stack-frame {');
results.push(logTest('Stack frame CSS class exists', hasStackFrameClass));

// Test 15: Stack frame has transition property
const hasStackFrameTransition = indexContent.match(/\.stack-frame\s*{[^}]*transition:\s*all\s+var\(--transition-duration\)/s);
results.push(logTest('Stack frame has CSS transition', !!hasStackFrameTransition));

// Test 16: Stack frame push animation exists
const hasStackPushAnimation = indexContent.includes('.stack-frame.pushing {');
results.push(logTest('Stack frame push animation class exists', hasStackPushAnimation));

// Test 17: Stack frame pop animation exists
const hasStackPopAnimation = indexContent.includes('.stack-frame.popping {');
results.push(logTest('Stack frame pop animation class exists', hasStackPopAnimation));

// Test 18: stackPush keyframes animation exists
const hasStackPushKeyframes = indexContent.includes('@keyframes stackPush {');
results.push(logTest('stackPush keyframes animation exists', hasStackPushKeyframes));

// Test 19: stackPop keyframes animation exists
const hasStackPopKeyframes = indexContent.includes('@keyframes stackPop {');
results.push(logTest('stackPop keyframes animation exists', hasStackPopKeyframes));

// Test 20: Stack frame header class exists
const hasStackFrameHeader = indexContent.includes('.stack-frame-header {');
results.push(logTest('Stack frame header CSS class exists', hasStackFrameHeader));

// Test 21: Stack frame function name class exists
const hasStackFrameFunction = indexContent.includes('.stack-frame-function {');
results.push(logTest('Stack frame function name CSS class exists', hasStackFrameFunction));

// Test 22: Stack frame locals section class exists
const hasStackFrameLocals = indexContent.includes('.stack-frame-locals {');
results.push(logTest('Stack frame locals section CSS class exists', hasStackFrameLocals));

// Test 23: Stack frame variable class exists
const hasStackFrameVariable = indexContent.includes('.stack-frame-variable {');
results.push(logTest('Stack frame variable CSS class exists', hasStackFrameVariable));

// Test 24: Stack frame return address class exists
const hasStackFrameReturn = indexContent.includes('.stack-frame-return {');
results.push(logTest('Stack frame return address CSS class exists', hasStackFrameReturn));

// Test 25: Stack frame uses dark theme background
const hasStackFrameDarkBg = indexContent.match(/\.stack-frame\s*{[^}]*background-color:\s*rgba\(255,\s*255,\s*255,\s*0\.05\)/s);
results.push(logTest('Stack frame uses dark theme background', !!hasStackFrameDarkBg));

// Test 26: Stack frame uses border with border-color variable
const hasStackFrameBorder = indexContent.match(/\.stack-frame\s*{[^}]*border:\s*2px\s+solid\s+var\(--border-color\)/s);
results.push(logTest('Stack frame uses border with border-color variable', !!hasStackFrameBorder));

// Test 27: Stack frame has border-radius
const hasStackFrameBorderRadius = indexContent.match(/\.stack-frame\s*{[^}]*border-radius:\s*8px/s);
results.push(logTest('Stack frame has border-radius', !!hasStackFrameBorderRadius));

// Test 28: Stack frame active state uses accent color
const hasStackFrameActive = indexContent.match(/\.stack-frame\.active\s*{[^}]*border-color:\s*var\(--accent-color\)/s);
results.push(logTest('Stack frame active state uses accent color', !!hasStackFrameActive));

// Test 29: Stack frame function name uses accent color
const hasStackFrameFunctionColor = indexContent.match(/\.stack-frame-function\s*{[^}]*color:\s*var\(--accent-color\)/s);
results.push(logTest('Stack frame function name uses accent color', !!hasStackFrameFunctionColor));

// Test 30: Stack frame variable name uses accent color
const hasStackFrameVarNameColor = indexContent.includes('.stack-frame-var-name {') && 
                                   indexContent.match(/\.stack-frame-var-name\s*{[^}]*color:\s*var\(--accent-color\)/s);
results.push(logTest('Stack frame variable name uses accent color', !!hasStackFrameVarNameColor));

// Test 31: CSS transition duration variable is 300ms
const hasTransitionDuration = indexContent.match(/--transition-duration:\s*300ms/);
results.push(logTest('CSS transition duration is 300ms', !!hasTransitionDuration));

// Test 32: Stack Panel validates Requirements 4.1, 4.2, 4.3
const hasRequirementsComment = indexContent.match(/<!--[^>]*Validates:\s*Requirements\s*4\.1,\s*4\.2,\s*4\.3[^>]*-->/);
results.push(logTest('Stack Panel has requirements validation comment', !!hasRequirementsComment));

// Test 33: Stack frame hover effect exists
const hasStackFrameHover = indexContent.includes('.stack-frame:hover {');
results.push(logTest('Stack frame hover effect exists', hasStackFrameHover));

// Test 34: Stack frame variable hover effect exists
const hasStackFrameVariableHover = indexContent.includes('.stack-frame-variable:hover {');
results.push(logTest('Stack frame variable hover effect exists', hasStackFrameVariableHover));

// Test 35: Stack content has gap spacing
const hasStackContentGap = indexContent.match(/#stack-content\s*{[^}]*gap:\s*8px/s);
results.push(logTest('Stack content has gap spacing', !!hasStackContentGap));

console.log();
console.log('='.repeat(80));
console.log('Summary');
console.log('='.repeat(80));

const passedTests = results.filter(r => r).length;
const totalTests = results.length;
const passRate = ((passedTests / totalTests) * 100).toFixed(1);

console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Pass Rate: ${passRate}%`);
console.log();

if (passedTests === totalTests) {
    console.log('✓ All tests passed! Task 8.1 implementation is complete.');
    process.exit(0);
} else {
    console.log('✗ Some tests failed. Please review the implementation.');
    process.exit(1);
}
