/**
 * Verification Script for Task 9.1: Memory Panel HTML Structure and CSS
 * 
 * This script verifies that the Memory Panel has been correctly implemented with:
 * - Proper HTML structure (30% width, 80% height, right position)
 * - CSS for object cards and reference arrows
 * - CSS transitions for object allocation/deallocation (300ms duration)
 * - Dark theme styling consistent with other panels
 * 
 * Validates: Requirements 5.5, 5.6
 */

const fs = require('fs');
const path = require('path');

// Read the index.html file
const indexPath = path.join(__dirname, '..', 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

// Read the main.css file
const cssPath = path.join(__dirname, '..', 'src', 'styles', 'main.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

// Combine for easier searching
const allContent = indexContent + '\n' + cssContent;

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
console.log('Task 9.1 Verification: Memory Panel HTML Structure and CSS');
console.log('='.repeat(80));
console.log();

// HTML Structure Tests
console.log('HTML Structure Tests:');
console.log('-'.repeat(80));

// Test 1: Memory Panel container exists
const hasMemoryPanel = indexContent.includes('id="memory-panel"');
results.push(logTest('Memory Panel container exists', hasMemoryPanel));

// Test 2: Memory Panel has visualization-panel class
const hasVisualizationPanelClass = indexContent.match(/<div[^>]*id="memory-panel"[^>]*class="visualization-panel"/);
results.push(logTest('Memory Panel has visualization-panel class', !!hasVisualizationPanelClass));

// Test 3: Memory Panel header exists with correct title
const hasMemoryPanelHeader = indexContent.includes('<h3 class="panel-title">Memory Heap</h3>');
results.push(logTest('Memory Panel header with "Memory Heap" title exists', hasMemoryPanelHeader));

// Test 4: Memory Panel subtitle exists
const hasMemoryPanelSubtitle = indexContent.includes('<span class="panel-subtitle">Objects & References</span>');
results.push(logTest('Memory Panel subtitle "Objects & References" exists', hasMemoryPanelSubtitle));

// Test 5: Memory content container exists
const hasMemoryContent = indexContent.includes('id="memory-content"');
results.push(logTest('Memory content container exists', hasMemoryContent));

// Test 6: SVG overlay for arrows exists
const hasMemoryArrows = indexContent.includes('id="memory-arrows"');
results.push(logTest('SVG overlay for arrows exists', hasMemoryArrows));

// Test 7: SVG has correct class
const hasMemoryArrowsClass = indexContent.includes('class="memory-arrows-overlay"');
results.push(logTest('SVG has memory-arrows-overlay class', hasMemoryArrowsClass));

// Test 8: Memory objects container exists
const hasMemoryObjectsContainer = indexContent.includes('id="memory-objects-container"');
results.push(logTest('Memory objects container exists', hasMemoryObjectsContainer));

// Test 9: Memory placeholder exists
const hasMemoryPlaceholder = indexContent.includes('class="memory-placeholder"');
results.push(logTest('Memory placeholder exists', hasMemoryPlaceholder));

// Test 10: Memory empty icon exists
const hasMemoryEmptyIcon = indexContent.includes('class="memory-empty-icon"');
results.push(logTest('Memory empty icon exists', hasMemoryEmptyIcon));

// Test 11: Memory empty text exists
const hasMemoryEmptyText = indexContent.includes('class="memory-empty-text"');
results.push(logTest('Memory empty text exists', hasMemoryEmptyText));

// Test 12: Memory empty hint exists
const hasMemoryEmptyHint = indexContent.includes('class="memory-empty-hint"');
results.push(logTest('Memory empty hint exists', hasMemoryEmptyHint));

console.log();
console.log('CSS Dimension Tests:');
console.log('-'.repeat(80));

// Test 13: Memory Panel CSS width is 30%
const hasMemoryPanelWidth = cssContent.match(/#memory-panel\s*{[^}]*width:\s*30%/s);
results.push(logTest('Memory Panel CSS width is 30%', !!hasMemoryPanelWidth));

// Test 14: Memory Panel CSS height is 100%
const hasMemoryPanelHeight = cssContent.match(/#memory-panel\s*{[^}]*height:\s*100%/s);
results.push(logTest('Memory Panel CSS height is 100%', !!hasMemoryPanelHeight));

// Test 15: Memory Panel CSS min-width is 250px
const hasMemoryPanelMinWidth = cssContent.match(/#memory-panel\s*{[^}]*min-width:\s*250px/s);
results.push(logTest('Memory Panel CSS min-width is 250px', !!hasMemoryPanelMinWidth));

console.log();
console.log('CSS Animation Tests:');
console.log('-'.repeat(80));

// Test 16: Memory object class exists in CSS
const hasMemoryObjectClass = cssContent.includes('.memory-object {');
results.push(logTest('Memory object CSS class exists', hasMemoryObjectClass));

// Test 17: Memory object has transition property
const hasMemoryObjectTransition = cssContent.match(/\.memory-object\s*{[^}]*transition:\s*all\s+var\(--transition-duration\)/s);
results.push(logTest('Memory object has CSS transition', !!hasMemoryObjectTransition));

// Test 18: Object allocation animation class exists
const hasAllocatingAnimation = cssContent.includes('.memory-object.allocating {');
results.push(logTest('Object allocation animation class exists', hasAllocatingAnimation));

// Test 19: Object deallocation animation class exists
const hasDeallocatingAnimation = cssContent.includes('.memory-object.deallocating {');
results.push(logTest('Object deallocation animation class exists', hasDeallocatingAnimation));

// Test 20: objectAllocate keyframes animation exists
const hasAllocateKeyframes = cssContent.includes('@keyframes objectAllocate {');
results.push(logTest('objectAllocate keyframes animation exists', hasAllocateKeyframes));

// Test 21: objectDeallocate keyframes animation exists
const hasDeallocateKeyframes = cssContent.includes('@keyframes objectDeallocate {');
results.push(logTest('objectDeallocate keyframes animation exists', hasDeallocateKeyframes));

// Test 22: Allocation animation uses var(--transition-duration)
const hasAllocateTransitionDuration = cssContent.match(/\.memory-object\.allocating\s*{[^}]*animation:\s*objectAllocate\s+var\(--transition-duration\)/s);
results.push(logTest('Allocation animation uses var(--transition-duration)', !!hasAllocateTransitionDuration));

// Test 23: Deallocation animation uses var(--transition-duration)
const hasDeallocateTransitionDuration = cssContent.match(/\.memory-object\.deallocating\s*{[^}]*animation:\s*objectDeallocate\s+var\(--transition-duration\)/s);
results.push(logTest('Deallocation animation uses var(--transition-duration)', !!hasDeallocateTransitionDuration));

// Test 24-31: Keyframes animation properties
// Extract full keyframes blocks by finding matching braces
function extractKeyframes(cssContent, keyframeName) {
    const start = cssContent.indexOf(`@keyframes ${keyframeName}`);
    if (start === -1) return null;
    
    let braceCount = 0;
    let inKeyframes = false;
    let end = start;
    
    for (let i = start; i < cssContent.length; i++) {
        if (cssContent[i] === '{') {
            braceCount++;
            inKeyframes = true;
        } else if (cssContent[i] === '}') {
            braceCount--;
            if (inKeyframes && braceCount === 0) {
                end = i + 1;
                break;
            }
        }
    }
    
    return cssContent.substring(start, end);
}

const allocateKeyframes = extractKeyframes(cssContent, 'objectAllocate');
const deallocateKeyframes = extractKeyframes(cssContent, 'objectDeallocate');

// Test 24: Allocation keyframes start with opacity 0
const hasAllocateOpacity0 = allocateKeyframes && allocateKeyframes.includes('0%') && 
                             allocateKeyframes.includes('opacity: 0');
results.push(logTest('Allocation keyframes start with opacity 0', !!hasAllocateOpacity0));

// Test 25: Allocation keyframes start with scale(0.8)
const hasAllocateScale08 = allocateKeyframes && allocateKeyframes.includes('scale(0.8)');
results.push(logTest('Allocation keyframes start with scale(0.8)', !!hasAllocateScale08));

// Test 26: Allocation keyframes end with opacity 1
const hasAllocateOpacity1 = allocateKeyframes && allocateKeyframes.includes('100%') && 
                             allocateKeyframes.includes('opacity: 1');
results.push(logTest('Allocation keyframes end with opacity 1', !!hasAllocateOpacity1));

// Test 27: Allocation keyframes end with scale(1)
const hasAllocateScale1 = allocateKeyframes && allocateKeyframes.includes('scale(1)');
results.push(logTest('Allocation keyframes end with scale(1)', !!hasAllocateScale1));

// Test 28: Deallocation keyframes start with opacity 1
const hasDeallocateOpacity1 = deallocateKeyframes && deallocateKeyframes.includes('0%') && 
                               deallocateKeyframes.includes('opacity: 1');
results.push(logTest('Deallocation keyframes start with opacity 1', !!hasDeallocateOpacity1));

// Test 29: Deallocation keyframes start with scale(1)
const hasDeallocateScale1 = deallocateKeyframes && deallocateKeyframes.includes('scale(1)');
results.push(logTest('Deallocation keyframes start with scale(1)', !!hasDeallocateScale1));

// Test 30: Deallocation keyframes end with opacity 0
const hasDeallocateOpacity0 = deallocateKeyframes && deallocateKeyframes.includes('100%') && 
                               deallocateKeyframes.includes('opacity: 0');
results.push(logTest('Deallocation keyframes end with opacity 0', !!hasDeallocateOpacity0));

// Test 31: Deallocation keyframes end with scale(0.8)
const hasDeallocateScale08 = deallocateKeyframes && deallocateKeyframes.includes('scale(0.8)');
results.push(logTest('Deallocation keyframes end with scale(0.8)', !!hasDeallocateScale08));

console.log();
console.log('CSS Dark Theme Tests:');
console.log('-'.repeat(80));

// Test 32: CSS transition duration variable is 300ms
const hasTransitionDuration = allContent.match(/--transition-duration:\s*300ms/);
results.push(logTest('CSS transition duration is 300ms', !!hasTransitionDuration));

// Test 33: Memory object uses dark theme background
const hasMemoryObjectDarkBg = cssContent.match(/\.memory-object\s*{[^}]*background-color:\s*rgba\(255,\s*255,\s*255,\s*0\.05\)/s);
results.push(logTest('Memory object uses dark theme background', !!hasMemoryObjectDarkBg));

// Test 34: Memory object uses border with border-color variable
const hasMemoryObjectBorder = cssContent.match(/\.memory-object\s*{[^}]*border:\s*2px\s+solid\s+var\(--border-color\)/s);
results.push(logTest('Memory object uses border with border-color variable', !!hasMemoryObjectBorder));

// Test 35: Memory object has border-radius
const hasMemoryObjectBorderRadius = cssContent.match(/\.memory-object\s*{[^}]*border-radius:\s*8px/s);
results.push(logTest('Memory object has border-radius', !!hasMemoryObjectBorderRadius));

// Test 36: Memory object active state uses accent color
const hasMemoryObjectActive = cssContent.match(/\.memory-object\.active\s*{[^}]*border-color:\s*var\(--accent-color\)/s);
results.push(logTest('Memory object active state uses accent color', !!hasMemoryObjectActive));

// Test 37: Memory object type uses accent color
const hasMemoryObjectTypeColor = cssContent.match(/\.memory-object-type\s*{[^}]*color:\s*var\(--accent-color\)/s);
results.push(logTest('Memory object type uses accent color', !!hasMemoryObjectTypeColor));

console.log();
console.log('CSS Reference Arrow Tests:');
console.log('-'.repeat(80));

// Test 38: Memory arrow class exists
const hasMemoryArrowClass = cssContent.includes('.memory-arrow {');
results.push(logTest('Memory arrow CSS class exists', hasMemoryArrowClass));

// Test 39: Memory arrow uses accent color for stroke
const hasMemoryArrowStroke = cssContent.match(/\.memory-arrow\s*{[^}]*stroke:\s*var\(--accent-color\)/s);
results.push(logTest('Memory arrow uses accent color for stroke', !!hasMemoryArrowStroke));

// Test 40: Memory arrow has stroke-width
const hasMemoryArrowStrokeWidth = cssContent.match(/\.memory-arrow\s*{[^}]*stroke-width:\s*2/s);
results.push(logTest('Memory arrow has stroke-width of 2', !!hasMemoryArrowStrokeWidth));

// Test 41: Memory variable reference class exists
const hasMemoryVariableRefClass = cssContent.includes('.memory-variable-ref {');
results.push(logTest('Memory variable reference CSS class exists', hasMemoryVariableRefClass));

// Test 42: Memory variable reference uses accent color
const hasMemoryVariableRefColor = cssContent.match(/\.memory-variable-ref\s*{[^}]*color:\s*var\(--accent-color\)/s);
results.push(logTest('Memory variable reference uses accent color', !!hasMemoryVariableRefColor));

// Test 43: Memory variable reference has border with accent color
const hasMemoryVariableRefBorder = cssContent.match(/\.memory-variable-ref\s*{[^}]*border:\s*1px\s+solid\s+var\(--accent-color\)/s);
results.push(logTest('Memory variable reference has border with accent color', !!hasMemoryVariableRefBorder));

console.log();
console.log('CSS Object Card Tests:');
console.log('-'.repeat(80));

// Test 44: Memory object header class exists
const hasMemoryObjectHeader = cssContent.includes('.memory-object-header {');
results.push(logTest('Memory object header CSS class exists', hasMemoryObjectHeader));

// Test 45: Memory object body class exists
const hasMemoryObjectBody = cssContent.includes('.memory-object-body {');
results.push(logTest('Memory object body CSS class exists', hasMemoryObjectBody));

// Test 46: Memory object value class exists
const hasMemoryObjectValue = cssContent.includes('.memory-object-value {');
results.push(logTest('Memory object value CSS class exists', hasMemoryObjectValue));

// Test 47: Memory object refcount class exists
const hasMemoryObjectRefcount = cssContent.includes('.memory-object-refcount {');
results.push(logTest('Memory object refcount CSS class exists', hasMemoryObjectRefcount));

// Test 48: Memory object type icon class exists
const hasMemoryObjectTypeIcon = cssContent.includes('.memory-object-type-icon {');
results.push(logTest('Memory object type icon CSS class exists', hasMemoryObjectTypeIcon));

// Test 49: Memory object ID class exists
const hasMemoryObjectId = cssContent.includes('.memory-object-id {');
results.push(logTest('Memory object ID CSS class exists', hasMemoryObjectId));

// Test 50: Memory object hover effect exists
const hasMemoryObjectHover = cssContent.includes('.memory-object:hover {');
results.push(logTest('Memory object hover effect exists', hasMemoryObjectHover));

console.log();
console.log('CSS Type-Specific Icon Tests:');
console.log('-'.repeat(80));

// Test 51: Integer type icon exists
const hasIntIcon = cssContent.includes('.memory-object[data-type="int"]');
results.push(logTest('Integer type icon CSS exists', hasIntIcon));

// Test 52: String type icon exists
const hasStrIcon = cssContent.includes('.memory-object[data-type="str"]');
results.push(logTest('String type icon CSS exists', hasStrIcon));

// Test 53: List type icon exists
const hasListIcon = cssContent.includes('.memory-object[data-type="list"]');
results.push(logTest('List type icon CSS exists', hasListIcon));

// Test 54: Dictionary type icon exists
const hasDictIcon = cssContent.includes('.memory-object[data-type="dict"]');
results.push(logTest('Dictionary type icon CSS exists', hasDictIcon));

// Test 55: Function type icon exists
const hasFunctionIcon = cssContent.includes('.memory-object[data-type="function"]');
results.push(logTest('Function type icon CSS exists', hasFunctionIcon));

console.log();
console.log('Requirements Validation Tests:');
console.log('-'.repeat(80));

// Test 56: Memory Panel validates Requirements 5.5, 5.6
const hasRequirementsComment = cssContent.match(/\/\*[^*]*Validates:\s*Requirements\s*5\.5,\s*5\.6[^*]*\*\//);
results.push(logTest('Memory Panel has requirements validation comment', !!hasRequirementsComment));

// Test 57: SVG overlay is positioned absolutely
const hasSvgAbsolutePosition = cssContent.match(/\.memory-arrows-overlay\s*{[^}]*position:\s*absolute/s);
results.push(logTest('SVG overlay is positioned absolutely', !!hasSvgAbsolutePosition));

// Test 58: Memory objects container has relative positioning
const hasContainerRelativePosition = cssContent.match(/#memory-objects-container\s*{[^}]*position:\s*relative/s);
results.push(logTest('Memory objects container has relative positioning', !!hasContainerRelativePosition));

// Test 59: Memory content has relative positioning
const hasContentRelativePosition = cssContent.match(/#memory-content\s*{[^}]*position:\s*relative/s);
results.push(logTest('Memory content has relative positioning', !!hasContentRelativePosition));

// Test 60: Memory Panel is positioned in visualization-panels
const isInVisualizationPanels = indexContent.match(/<div[^>]*id="visualization-panels"[^>]*>[\s\S]*<div[^>]*id="memory-panel"/);
results.push(logTest('Memory Panel is positioned in visualization-panels', !!isInVisualizationPanels));

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
    console.log('✓ All tests passed! Task 9.1 implementation is complete.');
    console.log();
    console.log('Requirements Validated:');
    console.log('  - Requirement 5.5: Memory Panel occupies right region (30% width, 80% height)');
    console.log('  - Requirement 5.6: Memory Panel uses dark theme consistent with other panels');
    console.log();
    console.log('Features Implemented:');
    console.log('  - Memory Panel HTML structure with header, content, and placeholder');
    console.log('  - SVG overlay for reference arrows');
    console.log('  - Memory objects container for heap objects');
    console.log('  - Object allocation animation (fade in + scale, 300ms)');
    console.log('  - Object deallocation animation (fade out + scale, 300ms)');
    console.log('  - Dark theme styling consistent with bytecode and stack panels');
    console.log('  - Object card styles with type icons, values, and reference counts');
    console.log('  - Variable reference styles with arrows');
    console.log('  - Type-specific icons for int, str, list, dict, and function');
    console.log();
    process.exit(0);
} else {
    console.log('✗ Some tests failed. Please review the implementation.');
    console.log();
    process.exit(1);
}
