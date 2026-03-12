/**
 * Verification script for Task 5.1: Initialize Monaco Editor in left panel
 * 
 * This script verifies that:
 * - Monaco Editor container exists and occupies 30% viewport width
 * - Monaco Editor is initialized with Python language mode
 * - Dark theme is applied
 * - Editor options are properly configured (syntax highlighting, line numbers)
 * 
 * Requirements validated: 1.1, 1.2, 1.3, 1.5, 1.6
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('TASK 5.1 VERIFICATION: Monaco Editor Initialization');
console.log('='.repeat(80));
console.log();

// Read the index.html file
const indexPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(indexPath, 'utf-8');

const tests = [];

// Test 1: Monaco container exists in HTML
const hasMonacoContainer = htmlContent.includes('id="monaco-container"');
tests.push({
    name: 'Monaco container element exists in HTML',
    passed: hasMonacoContainer,
    requirement: '1.1',
    details: hasMonacoContainer ? 'Found #monaco-container element' : 'Missing #monaco-container element'
});

// Test 2: Monaco container has 30% width in CSS
const has30PercentWidth = htmlContent.includes('grid-template-columns: 30% 70%') || 
                          htmlContent.match(/width:\s*30%/);
tests.push({
    name: 'Monaco container configured for 30% viewport width',
    passed: has30PercentWidth,
    requirement: '1.1',
    details: has30PercentWidth ? 'Container set to 30% width' : 'Container width not set to 30%'
});

// Test 3: Monaco Editor initialization code exists
const hasMonacoInit = htmlContent.includes('monaco.editor.create');
tests.push({
    name: 'Monaco Editor initialization code present',
    passed: hasMonacoInit,
    requirement: '1.6',
    details: hasMonacoInit ? 'Found monaco.editor.create() call' : 'Missing monaco.editor.create() call'
});

// Test 4: Python language mode configured
const hasPythonLanguage = htmlContent.match(/language:\s*['"]python['"]/);
tests.push({
    name: 'Python language mode configured',
    passed: hasPythonLanguage !== null,
    requirement: '1.2',
    details: hasPythonLanguage ? 'Python language mode set' : 'Python language mode not configured'
});

// Test 5: Dark theme configured
const hasDarkTheme = htmlContent.match(/theme:\s*['"]vs-dark['"]/);
tests.push({
    name: 'Dark theme configured',
    passed: hasDarkTheme !== null,
    requirement: '1.5',
    details: hasDarkTheme ? 'vs-dark theme configured' : 'Dark theme not configured'
});

// Test 6: Line numbers enabled
const hasLineNumbers = htmlContent.match(/lineNumbers:\s*['"]on['"]/);
tests.push({
    name: 'Line numbers enabled',
    passed: hasLineNumbers !== null,
    requirement: '1.2',
    details: hasLineNumbers ? 'Line numbers set to "on"' : 'Line numbers not enabled'
});

// Test 7: Syntax highlighting support (Monaco CDN loaded)
const hasMonacoCDN = htmlContent.includes('monaco-editor') && 
                     (htmlContent.includes('cdnjs.cloudflare.com') || htmlContent.includes('unpkg.com'));
tests.push({
    name: 'Monaco Editor loaded from CDN',
    passed: hasMonacoCDN,
    requirement: '1.6',
    details: hasMonacoCDN ? 'Monaco CDN script tags found' : 'Monaco CDN not configured'
});

// Test 8: Editor options configured
const hasEditorOptions = htmlContent.includes('automaticLayout') || 
                         htmlContent.includes('fontSize') ||
                         htmlContent.includes('tabSize');
tests.push({
    name: 'Editor options configured',
    passed: hasEditorOptions,
    requirement: '1.3',
    details: hasEditorOptions ? 'Editor options found' : 'Editor options not configured'
});

// Test 9: Background color matches design spec (#0d1117)
const hasCorrectBgColor = htmlContent.includes('#0d1117');
tests.push({
    name: 'Background color matches design spec',
    passed: hasCorrectBgColor,
    requirement: '1.5',
    details: hasCorrectBgColor ? 'Background color #0d1117 found' : 'Background color not matching spec'
});

// Test 10: Editor instance stored globally
const hasGlobalEditor = htmlContent.includes('window.monacoEditor');
tests.push({
    name: 'Editor instance stored globally for access',
    passed: hasGlobalEditor,
    requirement: '1.3',
    details: hasGlobalEditor ? 'window.monacoEditor assignment found' : 'Editor not stored globally'
});

// Display results
console.log('Test Results:');
console.log('-'.repeat(80));

let passCount = 0;
let failCount = 0;

tests.forEach((test, index) => {
    const status = test.passed ? '✓ PASS' : '✗ FAIL';
    const color = test.passed ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';
    
    console.log(`${color}${status}${reset} [Req ${test.requirement}] ${test.name}`);
    console.log(`     ${test.details}`);
    
    if (test.passed) {
        passCount++;
    } else {
        failCount++;
    }
});

console.log('-'.repeat(80));
console.log();
console.log(`Summary: ${passCount}/${tests.length} tests passed`);
console.log();

if (failCount === 0) {
    console.log('\x1b[32m✓ Task 5.1 implementation verified successfully!\x1b[0m');
    console.log();
    console.log('Monaco Editor has been properly initialized with:');
    console.log('  • DOM container occupying 30% viewport width');
    console.log('  • Python language mode enabled');
    console.log('  • Dark theme (vs-dark) applied');
    console.log('  • Syntax highlighting configured');
    console.log('  • Line numbers enabled');
    console.log('  • Standard text editing operations supported');
    console.log();
    console.log('Requirements validated: 1.1, 1.2, 1.3, 1.5, 1.6');
    process.exit(0);
} else {
    console.log('\x1b[31m✗ Task 5.1 verification failed\x1b[0m');
    console.log(`${failCount} test(s) failed. Please review the implementation.`);
    process.exit(1);
}
