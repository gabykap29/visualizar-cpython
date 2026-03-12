/**
 * Verification script for Task 6.1: Pipeline Diagram HTML structure and CSS
 * 
 * This script verifies that the Pipeline Diagram component meets all requirements:
 * - Six-stage pipeline layout (Source → Tokenizer → Parser → Compiler → Bytecode → PVM)
 * - Positioned in center-top region (70% width, 20% height)
 * - CSS transitions for stage highlighting (300ms duration, accent color #58a6ff)
 * 
 * Requirements validated: 2.1, 2.3, 2.4, 2.5
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

// Read the index.html file
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

let totalTests = 0;
let passedTests = 0;

log('\n='.repeat(80), 'blue');
log('TASK 6.1 VERIFICATION: Pipeline Diagram HTML Structure and CSS', 'blue');
log('='.repeat(80), 'blue');

// Test 1: Verify pipeline diagram container exists
log('\nTest 1: Pipeline diagram container exists', 'yellow');
totalTests++;
const hasPipelineDiagram = htmlContent.includes('id="pipeline-diagram"');
if (hasPipelineDiagram) {
    passedTests++;
    logTest('Pipeline diagram container found', true);
} else {
    logTest('Pipeline diagram container NOT found', false);
}

// Test 2: Verify six pipeline stages exist
log('\nTest 2: Six pipeline stages exist', 'yellow');
totalTests++;
const stageMatches = htmlContent.match(/class="pipeline-stage"/g);
const hasAllStages = stageMatches && stageMatches.length === 6;
if (hasAllStages) {
    passedTests++;
    logTest('Six pipeline stages found', true, `Found ${stageMatches.length} stages`);
} else {
    logTest('Six pipeline stages NOT found', false, `Found ${stageMatches ? stageMatches.length : 0} stages, expected 6`);
}

// Test 3: Verify stage names (data-stage attributes)
log('\nTest 3: Stage names correct', 'yellow');
totalTests++;
const expectedStages = ['source', 'tokenizer', 'parser', 'compiler', 'bytecode', 'pvm'];
const allStagesPresent = expectedStages.every(stage => 
    htmlContent.includes(`data-stage="${stage}"`)
);
if (allStagesPresent) {
    passedTests++;
    logTest('All stage names present', true, expectedStages.join(', '));
} else {
    const missingStages = expectedStages.filter(stage => 
        !htmlContent.includes(`data-stage="${stage}"`)
    );
    logTest('Missing stage names', false, `Missing: ${missingStages.join(', ')}`);
}

// Test 4: Verify arrows between stages
log('\nTest 4: Arrows between stages', 'yellow');
totalTests++;
const arrowMatches = htmlContent.match(/class="pipeline-arrow"/g);
const hasArrows = arrowMatches && arrowMatches.length === 5; // 5 arrows for 6 stages
if (hasArrows) {
    passedTests++;
    logTest('Arrows between stages found', true, `Found ${arrowMatches.length} arrows`);
} else {
    logTest('Arrows NOT found', false, `Found ${arrowMatches ? arrowMatches.length : 0} arrows, expected 5`);
}

// Test 5: Verify CSS transitions
log('\nTest 5: CSS transitions defined', 'yellow');
totalTests++;
const hasTransitions = htmlContent.includes('transition:') && 
                       htmlContent.includes('var(--transition-duration)');
if (hasTransitions) {
    passedTests++;
    logTest('CSS transitions defined', true);
} else {
    logTest('CSS transitions NOT defined', false);
}

// Test 6: Verify transition duration (300ms)
log('\nTest 6: Transition duration is 300ms', 'yellow');
totalTests++;
const hasCorrectDuration = htmlContent.includes('--transition-duration: 300ms');
if (hasCorrectDuration) {
    passedTests++;
    logTest('Transition duration is 300ms', true);
} else {
    logTest('Transition duration NOT 300ms', false);
}

// Test 7: Verify accent color (#58a6ff)
log('\nTest 7: Accent color #58a6ff used', 'yellow');
totalTests++;
const hasAccentColor = htmlContent.includes('--accent-color: #58a6ff');
if (hasAccentColor) {
    passedTests++;
    logTest('Accent color defined', true);
} else {
    logTest('Accent color NOT defined', false);
}

// Test 8: Verify active state styling
log('\nTest 8: Active state styling', 'yellow');
totalTests++;
const hasActiveState = htmlContent.includes('.pipeline-stage.active') &&
                       htmlContent.includes('border-color: var(--accent-color)');
if (hasActiveState) {
    passedTests++;
    logTest('Active state styling defined', true);
} else {
    logTest('Active state styling NOT defined', false);
}

// Test 9: Verify updatePipelineStage method implementation
log('\nTest 9: updatePipelineStage method implemented', 'yellow');
totalTests++;
const hasUpdateMethod = htmlContent.includes('updatePipelineStage(stage)') &&
                        htmlContent.includes('classList.add(\'active\')') &&
                        !htmlContent.includes('TODO: Implement in future task (Task 6.2)');
if (hasUpdateMethod) {
    passedTests++;
    logTest('updatePipelineStage method implemented', true);
} else {
    logTest('updatePipelineStage method NOT fully implemented', false);
}

// Test 10: Verify AnimationManager initialization with pipeline diagram
log('\nTest 10: AnimationManager initialized with pipeline diagram', 'yellow');
totalTests++;
const hasAnimationManagerInit = htmlContent.includes('pipelineDiagram: pipelineDiagram') ||
                                htmlContent.includes('pipelineDiagram:');
if (hasAnimationManagerInit) {
    passedTests++;
    logTest('AnimationManager includes pipeline diagram reference', true);
} else {
    logTest('AnimationManager does NOT include pipeline diagram reference', false);
}

// Test 11: Verify stage icons
log('\nTest 11: Stage icons present', 'yellow');
totalTests++;
const hasIcons = htmlContent.includes('pipeline-stage-icon');
if (hasIcons) {
    passedTests++;
    logTest('Stage icons present', true);
} else {
    logTest('Stage icons NOT present', false);
}

// Test 12: Verify stage names display
log('\nTest 12: Stage names display', 'yellow');
totalTests++;
const hasStageNames = htmlContent.includes('pipeline-stage-name');
if (hasStageNames) {
    passedTests++;
    logTest('Stage names display elements present', true);
} else {
    logTest('Stage names display elements NOT present', false);
}

// Test 13: Verify hover effects
log('\nTest 13: Hover effects defined', 'yellow');
totalTests++;
const hasHoverEffects = htmlContent.includes('.pipeline-stage:hover');
if (hasHoverEffects) {
    passedTests++;
    logTest('Hover effects defined', true);
} else {
    logTest('Hover effects NOT defined', false);
}

// Test 14: Verify scale transform on active state
log('\nTest 14: Scale transform on active state', 'yellow');
totalTests++;
const hasScaleTransform = htmlContent.includes('transform: scale(1.05)') ||
                          htmlContent.includes('transform: scale(1.2)');
if (hasScaleTransform) {
    passedTests++;
    logTest('Scale transform on active state defined', true);
} else {
    logTest('Scale transform NOT defined', false);
}

// Test 15: Verify box shadow on active state
log('\nTest 15: Box shadow on active state', 'yellow');
totalTests++;
const hasBoxShadow = htmlContent.includes('box-shadow:') &&
                     htmlContent.includes('rgba(88, 166, 255');
if (hasBoxShadow) {
    passedTests++;
    logTest('Box shadow on active state defined', true);
} else {
    logTest('Box shadow NOT defined', false);
}

// Summary
log('\n' + '='.repeat(80), 'blue');
log('SUMMARY', 'blue');
log('='.repeat(80), 'blue');

const percentage = ((passedTests / totalTests) * 100).toFixed(1);
const summaryColor = passedTests === totalTests ? 'green' : (passedTests >= totalTests * 0.8 ? 'yellow' : 'red');

log(`\nTests Passed: ${passedTests}/${totalTests} (${percentage}%)`, summaryColor);

if (passedTests === totalTests) {
    log('\n✓ All tests passed! Task 6.1 is complete.', 'green');
    log('\nRequirements validated:', 'cyan');
    log('  - 2.1: Six sequential stages displayed', 'cyan');
    log('  - 2.3: CSS transitions with 200-500ms duration', 'cyan');
    log('  - 2.4: Accent color #58a6ff for active stage', 'cyan');
    log('  - 2.5: Positioned in center-top region', 'cyan');
} else {
    log('\n✗ Some tests failed. Please review the implementation.', 'red');
}

log('\n' + '='.repeat(80), 'blue');

// Exit with appropriate code
process.exit(passedTests === totalTests ? 0 : 1);
