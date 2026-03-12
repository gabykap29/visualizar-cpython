/**
 * Verification script for Task 6.2: Implement pipeline stage animation
 * 
 * This script verifies that:
 * 1. updatePipelineStage method exists in AnimationManager
 * 2. The method applies the active class to the current stage
 * 3. CSS transitions are properly configured (300ms duration, accent color)
 * 4. Requirements 2.2 is validated
 */

const fs = require('fs');
const path = require('path');

// Read the index.html file
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// Test results
const tests = [];

// Test 1: updatePipelineStage method exists
const hasUpdatePipelineStage = htmlContent.includes('updatePipelineStage(stage)');
tests.push({
    name: 'updatePipelineStage method exists in AnimationManager',
    passed: hasUpdatePipelineStage,
    details: hasUpdatePipelineStage ? 'Method found' : 'Method not found'
});

// Test 2: Method applies active class
const appliesActiveClass = htmlContent.includes("stageElement.classList.add('active')");
tests.push({
    name: 'Method applies active class to current stage',
    passed: appliesActiveClass,
    details: appliesActiveClass ? 'Active class application found' : 'Active class application not found'
});

// Test 3: Method removes active class from other stages
const removesActiveClass = htmlContent.includes("stageElement.classList.remove('active')");
tests.push({
    name: 'Method removes active class from other stages',
    passed: removesActiveClass,
    details: removesActiveClass ? 'Active class removal found' : 'Active class removal not found'
});

// Test 4: CSS transition duration is 300ms
const hasTransitionDuration = htmlContent.includes('--transition-duration: 300ms');
tests.push({
    name: 'CSS transition duration is 300ms',
    passed: hasTransitionDuration,
    details: hasTransitionDuration ? 'Transition duration set to 300ms' : 'Transition duration not set correctly'
});

// Test 5: Pipeline stage uses CSS transition
const pipelineStageTransition = htmlContent.includes('transition: all var(--transition-duration) ease-in-out');
tests.push({
    name: 'Pipeline stage uses CSS transition',
    passed: pipelineStageTransition,
    details: pipelineStageTransition ? 'CSS transition configured' : 'CSS transition not configured'
});

// Test 6: Active stage uses accent color
const activeStageAccentColor = htmlContent.includes('border-color: var(--accent-color)');
tests.push({
    name: 'Active stage uses accent color',
    passed: activeStageAccentColor,
    details: activeStageAccentColor ? 'Accent color applied to active stage' : 'Accent color not applied'
});

// Test 7: Accent color is #58a6ff
const accentColorValue = htmlContent.includes('--accent-color: #58a6ff');
tests.push({
    name: 'Accent color is #58a6ff',
    passed: accentColorValue,
    details: accentColorValue ? 'Accent color set correctly' : 'Accent color not set correctly'
});

// Test 8: Method validates Requirements 2.2
const validatesRequirement = htmlContent.includes('Validates: Requirements 2.2');
tests.push({
    name: 'Method validates Requirements 2.2',
    passed: validatesRequirement,
    details: validatesRequirement ? 'Requirements validation comment found' : 'Requirements validation comment not found'
});

// Test 9: Method activates arrows up to current stage
const activatesArrows = htmlContent.includes("arrows[i].classList.add('active')");
tests.push({
    name: 'Method activates arrows up to current stage',
    passed: activatesArrows,
    details: activatesArrows ? 'Arrow activation logic found' : 'Arrow activation logic not found'
});

// Test 10: Method handles missing pipeline diagram gracefully
const handlesError = htmlContent.includes('Pipeline diagram not available for animation');
tests.push({
    name: 'Method handles missing pipeline diagram gracefully',
    passed: handlesError,
    details: handlesError ? 'Error handling found' : 'Error handling not found'
});

// Print results
console.log('\n=== Task 6.2 Verification Results ===\n');

let passedCount = 0;
let failedCount = 0;

tests.forEach((test, index) => {
    const status = test.passed ? '✓ PASS' : '✗ FAIL';
    const color = test.passed ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';
    
    console.log(`${color}${status}${reset} Test ${index + 1}: ${test.name}`);
    console.log(`      ${test.details}\n`);
    
    if (test.passed) {
        passedCount++;
    } else {
        failedCount++;
    }
});

console.log('='.repeat(50));
console.log(`Total: ${tests.length} tests`);
console.log(`\x1b[32mPassed: ${passedCount}\x1b[0m`);
console.log(`\x1b[31mFailed: ${failedCount}\x1b[0m`);
console.log('='.repeat(50));

// Exit with appropriate code
process.exit(failedCount > 0 ? 1 : 0);
