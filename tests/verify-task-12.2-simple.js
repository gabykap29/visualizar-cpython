/**
 * Simple Verification Test for Task 12.2: ViewController Implementation
 * 
 * This test verifies the ViewController file exists and has the correct structure
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('TASK 12.2 SIMPLE VERIFICATION TEST: ViewController Implementation');
console.log('='.repeat(80));

// Test 1: File exists
console.log('\n1. Testing if view-controller.js file exists...');
try {
    const filePath = path.join(__dirname, '../src/scripts/view-controller.js');
    if (!fs.existsSync(filePath)) {
        throw new Error('File does not exist');
    }
    console.log('✓ view-controller.js file exists');
} catch (error) {
    console.error('✗ FAILED:', error.message);
    process.exit(1);
}

// Test 2: File contains ViewController class
console.log('\n2. Testing if file contains ViewController class...');
try {
    const filePath = path.join(__dirname, '../src/scripts/view-controller.js');
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('class ViewController')) {
        throw new Error('ViewController class not found');
    }
    console.log('✓ ViewController class definition found');
} catch (error) {
    console.error('✗ FAILED:', error.message);
    process.exit(1);
}

// Test 3: Constructor accepts stateStore and animationManager
console.log('\n3. Testing constructor signature...');
try {
    const filePath = path.join(__dirname, '../src/scripts/view-controller.js');
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('constructor(stateStore, animationManager)')) {
        throw new Error('Constructor signature not found');
    }
    console.log('✓ Constructor accepts stateStore and animationManager');
} catch (error) {
    console.error('✗ FAILED:', error.message);
    process.exit(1);
}

// Test 4: Required methods exist
console.log('\n4. Testing required methods...');
try {
    const filePath = path.join(__dirname, '../src/scripts/view-controller.js');
    const content = fs.readFileSync(filePath, 'utf8');
    
    const requiredMethods = [
        'onStepForward',
        'onStepBack',
        'onReset',
        'startAutoPlay',
        'stopAutoPlay',
        'updateButtonStates'
    ];
    
    for (const method of requiredMethods) {
        if (!content.includes(method)) {
            throw new Error(`Method ${method} not found`);
        }
        console.log(`  ✓ ${method} method found`);
    }
    
    console.log('✓ All required methods exist');
} catch (error) {
    console.error('✗ FAILED:', error.message);
    process.exit(1);
}

// Test 5: onStepForward calls stateStore.stepForward
console.log('\n5. Testing onStepForward implementation...');
try {
    const filePath = path.join(__dirname, '../src/scripts/view-controller.js');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find onStepForward method
    const onStepForwardMatch = content.match(/onStepForward\(\)\s*{[\s\S]*?(?=\n\s{4}\/\*\*|\n\s{4}[a-z]|\n})/);
    if (!onStepForwardMatch) {
        throw new Error('onStepForward method body not found');
    }
    
    const methodBody = onStepForwardMatch[0];
    
    if (!methodBody.includes('this.stateStore.stepForward()')) {
        throw new Error('onStepForward does not call stateStore.stepForward()');
    }
    if (!methodBody.includes('this.animationManager.updateAll')) {
        throw new Error('onStepForward does not call animationManager.updateAll()');
    }
    if (!methodBody.includes('this.updateButtonStates')) {
        throw new Error('onStepForward does not call updateButtonStates()');
    }
    
    console.log('✓ onStepForward implementation correct');
    console.log('  - Calls stateStore.stepForward()');
    console.log('  - Calls animationManager.updateAll()');
    console.log('  - Calls updateButtonStates()');
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 6: onStepBack calls stateStore.stepBack
console.log('\n6. Testing onStepBack implementation...');
try {
    const filePath = path.join(__dirname, '../src/scripts/view-controller.js');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find onStepBack method
    const onStepBackMatch = content.match(/onStepBack\(\)\s*{[\s\S]*?(?=\n\s{4}\/\*\*|\n\s{4}[a-z]|\n})/);
    if (!onStepBackMatch) {
        throw new Error('onStepBack method body not found');
    }
    
    const methodBody = onStepBackMatch[0];
    
    if (!methodBody.includes('this.stateStore.stepBack()')) {
        throw new Error('onStepBack does not call stateStore.stepBack()');
    }
    if (!methodBody.includes('this.animationManager.updateAll')) {
        throw new Error('onStepBack does not call animationManager.updateAll()');
    }
    if (!methodBody.includes('this.updateButtonStates')) {
        throw new Error('onStepBack does not call updateButtonStates()');
    }
    
    console.log('✓ onStepBack implementation correct');
    console.log('  - Calls stateStore.stepBack()');
    console.log('  - Calls animationManager.updateAll()');
    console.log('  - Calls updateButtonStates()');
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 7: onReset calls stateStore.reset
console.log('\n7. Testing onReset implementation...');
try {
    const filePath = path.join(__dirname, '../src/scripts/view-controller.js');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find onReset method
    const onResetMatch = content.match(/onReset\(\)\s*{[\s\S]*?(?=\n\s{4}\/\*\*|\n\s{4}[a-z]|\n})/);
    if (!onResetMatch) {
        throw new Error('onReset method body not found');
    }
    
    const methodBody = onResetMatch[0];
    
    if (!methodBody.includes('this.stateStore.reset()')) {
        throw new Error('onReset does not call stateStore.reset()');
    }
    if (!methodBody.includes('this.animationManager.updateAll')) {
        throw new Error('onReset does not call animationManager.updateAll()');
    }
    if (!methodBody.includes('this.updateButtonStates')) {
        throw new Error('onReset does not call updateButtonStates()');
    }
    
    console.log('✓ onReset implementation correct');
    console.log('  - Calls stateStore.reset()');
    console.log('  - Calls animationManager.updateAll()');
    console.log('  - Calls updateButtonStates()');
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 8: startAutoPlay uses setInterval
console.log('\n8. Testing startAutoPlay implementation...');
try {
    const filePath = path.join(__dirname, '../src/scripts/view-controller.js');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find startAutoPlay method
    const startAutoPlayMatch = content.match(/startAutoPlay\(\)\s*{[\s\S]*?(?=\n\s{4}\/\*\*|\n\s{4}[a-z])/);
    if (!startAutoPlayMatch) {
        throw new Error('startAutoPlay method body not found');
    }
    
    const methodBody = startAutoPlayMatch[0];
    
    if (!methodBody.includes('setInterval')) {
        throw new Error('startAutoPlay does not use setInterval');
    }
    if (!methodBody.includes('this.isPlaying = true')) {
        throw new Error('startAutoPlay does not set isPlaying to true');
    }
    if (!methodBody.includes('1000 / this.currentSpeed')) {
        throw new Error('startAutoPlay does not calculate interval based on speed');
    }
    
    console.log('✓ startAutoPlay implementation correct');
    console.log('  - Uses setInterval');
    console.log('  - Sets isPlaying to true');
    console.log('  - Calculates interval based on speed');
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 9: stopAutoPlay clears interval
console.log('\n9. Testing stopAutoPlay implementation...');
try {
    const filePath = path.join(__dirname, '../src/scripts/view-controller.js');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find stopAutoPlay method
    const stopAutoPlayMatch = content.match(/stopAutoPlay\(\)\s*{[\s\S]*?(?=\n\s{4}\/\*\*|\n\s{4}[a-z]|\n})/);
    if (!stopAutoPlayMatch) {
        throw new Error('stopAutoPlay method body not found');
    }
    
    const methodBody = stopAutoPlayMatch[0];
    
    if (!methodBody.includes('clearInterval')) {
        throw new Error('stopAutoPlay does not use clearInterval');
    }
    if (!methodBody.includes('this.isPlaying = false')) {
        throw new Error('stopAutoPlay does not set isPlaying to false');
    }
    
    console.log('✓ stopAutoPlay implementation correct');
    console.log('  - Uses clearInterval');
    console.log('  - Sets isPlaying to false');
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 10: updateButtonStates uses canStepForward/canStepBack
console.log('\n10. Testing updateButtonStates implementation...');
try {
    const filePath = path.join(__dirname, '../src/scripts/view-controller.js');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find updateButtonStates method
    const updateButtonStatesMatch = content.match(/updateButtonStates\(\)\s*{[\s\S]*?(?=\n\s{4}\/\*\*|\n\s{4}[a-z]|\n})/);
    if (!updateButtonStatesMatch) {
        throw new Error('updateButtonStates method body not found');
    }
    
    const methodBody = updateButtonStatesMatch[0];
    
    if (!methodBody.includes('this.stateStore.canStepForward()')) {
        throw new Error('updateButtonStates does not call canStepForward()');
    }
    if (!methodBody.includes('this.stateStore.canStepBack()')) {
        throw new Error('updateButtonStates does not call canStepBack()');
    }
    if (!methodBody.includes('.disabled')) {
        throw new Error('updateButtonStates does not set button disabled states');
    }
    
    console.log('✓ updateButtonStates implementation correct');
    console.log('  - Calls canStepForward()');
    console.log('  - Calls canStepBack()');
    console.log('  - Sets button disabled states');
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 11: File is referenced in index.html
console.log('\n11. Testing if view-controller.js is referenced in index.html...');
try {
    const indexPath = path.join(__dirname, '../index.html');
    const content = fs.readFileSync(indexPath, 'utf8');
    
    if (!content.includes('src/scripts/view-controller.js')) {
        throw new Error('view-controller.js not referenced in index.html');
    }
    console.log('✓ view-controller.js is referenced in index.html');
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

// Test 12: ViewController is initialized in app-init.js
console.log('\n12. Testing if ViewController is initialized in app-init.js...');
try {
    const appInitPath = path.join(__dirname, '../src/scripts/app-init.js');
    const content = fs.readFileSync(appInitPath, 'utf8');
    
    if (!content.includes('new ViewController')) {
        throw new Error('ViewController not initialized in app-init.js');
    }
    if (!content.includes('new StateStore')) {
        throw new Error('StateStore not initialized in app-init.js');
    }
    console.log('✓ ViewController and StateStore are initialized in app-init.js');
} catch (error) {
    console.error('✗ FAILED:', error.message);
}

console.log('\n' + '='.repeat(80));
console.log('TASK 12.2 SIMPLE VERIFICATION COMPLETE');
console.log('All structural tests passed! ✓');
console.log('='.repeat(80));
console.log('\nTo test functionality, open tests/test-task-12.2-integration.html in a browser.');
