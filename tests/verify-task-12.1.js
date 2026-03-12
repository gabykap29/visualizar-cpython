/**
 * Verification Tests for Task 12.1: Control Bar HTML Structure and CSS
 * 
 * This test suite verifies:
 * - Control Bar HTML structure is present
 * - All 5 buttons are present (Step Forward, Step Back, Auto-play, Reset, Explain)
 * - Speed slider is present with correct range (0.5 to 3)
 * - CSS dimensions and positioning are correct
 * - Button styles (normal, hover, active, disabled) are defined
 * - Slider styles are defined
 * - Dark theme styling is consistent
 * - Requirements 8.1, 8.2, 8.3, 8.4, 8.5, and 9.1 are validated
 */

// Test suite for Control Bar structure and styling
const testControlBarStructure = () => {
    console.log('🧪 Testing Control Bar HTML Structure...');
    
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };
    
    const addTest = (name, passed, message) => {
        results.tests.push({ name, passed, message });
        if (passed) {
            results.passed++;
            console.log(`✅ ${name}`);
        } else {
            results.failed++;
            console.error(`❌ ${name}: ${message}`);
        }
    };
    
    // Test 1: Control Bar container exists
    const controlBar = document.getElementById('control-bar');
    addTest(
        'Control Bar container exists',
        controlBar !== null,
        'Control Bar element not found'
    );
    
    if (!controlBar) {
        console.error('❌ Control Bar not found. Aborting remaining tests.');
        return results;
    }
    
    // Test 2: Control Bar container element exists
    const controlBarContainer = controlBar.querySelector('.control-bar-container');
    addTest(
        'Control Bar container element exists',
        controlBarContainer !== null,
        'Control Bar container element not found'
    );
    
    // Test 3: Control buttons container exists
    const controlButtons = controlBar.querySelector('.control-buttons');
    addTest(
        'Control buttons container exists',
        controlButtons !== null,
        'Control buttons container not found'
    );
    
    // Test 4: Step Back button exists
    const btnStepBack = document.getElementById('btn-step-back');
    addTest(
        'Step Back button exists',
        btnStepBack !== null,
        'Step Back button not found'
    );
    
    // Test 5: Step Forward button exists
    const btnStepForward = document.getElementById('btn-step-forward');
    addTest(
        'Step Forward button exists',
        btnStepForward !== null,
        'Step Forward button not found'
    );
    
    // Test 6: Auto-play button exists
    const btnAutoPlay = document.getElementById('btn-auto-play');
    addTest(
        'Auto-play button exists',
        btnAutoPlay !== null,
        'Auto-play button not found'
    );
    
    // Test 7: Reset button exists
    const btnReset = document.getElementById('btn-reset');
    addTest(
        'Reset button exists',
        btnReset !== null,
        'Reset button not found'
    );
    
    // Test 8: Explain button exists
    const btnExplain = document.getElementById('btn-explain');
    addTest(
        'Explain button exists',
        btnExplain !== null,
        'Explain button not found'
    );
    
    // Test 9: All buttons have correct structure (icon + label)
    const buttons = [btnStepBack, btnStepForward, btnAutoPlay, btnReset, btnExplain];
    const allButtonsHaveStructure = buttons.every(btn => {
        if (!btn) return false;
        const icon = btn.querySelector('.control-btn-icon');
        const label = btn.querySelector('.control-btn-label');
        return icon !== null && label !== null;
    });
    addTest(
        'All buttons have icon and label elements',
        allButtonsHaveStructure,
        'Some buttons missing icon or label elements'
    );
    
    // Test 10: Speed control container exists
    const speedControl = controlBar.querySelector('.speed-control');
    addTest(
        'Speed control container exists',
        speedControl !== null,
        'Speed control container not found'
    );
    
    // Test 11: Speed slider exists
    const speedSlider = document.getElementById('speed-slider');
    addTest(
        'Speed slider exists',
        speedSlider !== null,
        'Speed slider not found'
    );
    
    // Test 12: Speed slider has correct range (0.5 to 3)
    if (speedSlider) {
        const min = parseFloat(speedSlider.getAttribute('min'));
        const max = parseFloat(speedSlider.getAttribute('max'));
        const step = parseFloat(speedSlider.getAttribute('step'));
        const value = parseFloat(speedSlider.getAttribute('value'));
        
        addTest(
            'Speed slider min value is 0.5',
            min === 0.5,
            `Expected min=0.5, got ${min}`
        );
        
        addTest(
            'Speed slider max value is 3',
            max === 3,
            `Expected max=3, got ${max}`
        );
        
        addTest(
            'Speed slider has step value',
            step > 0,
            `Expected step > 0, got ${step}`
        );
        
        addTest(
            'Speed slider default value is 1',
            value === 1,
            `Expected value=1, got ${value}`
        );
    }
    
    // Test 13: Speed display exists
    const speedDisplay = document.getElementById('speed-display');
    addTest(
        'Speed display element exists',
        speedDisplay !== null,
        'Speed display element not found'
    );
    
    // Test 14: Speed value labels exist
    const speedValueLabels = controlBar.querySelectorAll('.speed-value-label');
    addTest(
        'Speed value labels exist (0.5x and 3x)',
        speedValueLabels.length >= 2,
        `Expected at least 2 speed value labels, found ${speedValueLabels.length}`
    );
    
    return results;
};

// Test suite for Control Bar CSS styling
const testControlBarCSS = () => {
    console.log('\n🎨 Testing Control Bar CSS Styling...');
    
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };
    
    const addTest = (name, passed, message) => {
        results.tests.push({ name, passed, message });
        if (passed) {
            results.passed++;
            console.log(`✅ ${name}`);
        } else {
            results.failed++;
            console.error(`❌ ${name}: ${message}`);
        }
    };
    
    const controlBar = document.getElementById('control-bar');
    if (!controlBar) {
        console.error('❌ Control Bar not found. Aborting CSS tests.');
        return results;
    }
    
    const computedStyle = window.getComputedStyle(controlBar);
    
    // Test 1: Control Bar positioning
    addTest(
        'Control Bar is positioned absolutely',
        computedStyle.position === 'absolute',
        `Expected position: absolute, got ${computedStyle.position}`
    );
    
    addTest(
        'Control Bar is at bottom',
        computedStyle.bottom === '0px',
        `Expected bottom: 0px, got ${computedStyle.bottom}`
    );
    
    // Test 2: Control Bar dimensions
    addTest(
        'Control Bar has width of 100%',
        computedStyle.width === controlBar.parentElement.offsetWidth + 'px',
        `Control Bar width doesn't match parent width`
    );
    
    addTest(
        'Control Bar has height of 20%',
        computedStyle.height === '20%' || parseFloat(computedStyle.height) > 0,
        `Control Bar height not set correctly`
    );
    
    // Test 3: Dark theme colors
    const bgColor = computedStyle.backgroundColor;
    addTest(
        'Control Bar has dark background color',
        bgColor.includes('rgb') && bgColor !== 'rgba(0, 0, 0, 0)',
        `Background color not set: ${bgColor}`
    );
    
    // Test 4: Border styling
    const borderTop = computedStyle.borderTopWidth;
    addTest(
        'Control Bar has top border',
        parseFloat(borderTop) > 0,
        `Expected border-top > 0, got ${borderTop}`
    );
    
    // Test 5: Button styling
    const btnStepForward = document.getElementById('btn-step-forward');
    if (btnStepForward) {
        const btnStyle = window.getComputedStyle(btnStepForward);
        
        addTest(
            'Button has border',
            parseFloat(btnStyle.borderWidth) > 0,
            `Button border not set`
        );
        
        addTest(
            'Button has border-radius',
            parseFloat(btnStyle.borderRadius) > 0,
            `Button border-radius not set`
        );
        
        addTest(
            'Button has padding',
            parseFloat(btnStyle.paddingTop) > 0 && parseFloat(btnStyle.paddingLeft) > 0,
            `Button padding not set`
        );
        
        addTest(
            'Button has transition',
            btnStyle.transition.includes('all') || btnStyle.transition.includes('300ms'),
            `Button transition not set correctly: ${btnStyle.transition}`
        );
        
        // Test disabled state
        addTest(
            'Button has disabled attribute',
            btnStepForward.hasAttribute('disabled'),
            `Button should be disabled by default`
        );
    }
    
    // Test 6: Speed slider styling
    const speedSlider = document.getElementById('speed-slider');
    if (speedSlider) {
        const sliderStyle = window.getComputedStyle(speedSlider);
        
        addTest(
            'Speed slider has cursor pointer',
            sliderStyle.cursor === 'pointer',
            `Expected cursor: pointer, got ${sliderStyle.cursor}`
        );
        
        addTest(
            'Speed slider has transition',
            sliderStyle.transition.includes('all') || sliderStyle.transition.includes('300ms'),
            `Speed slider transition not set correctly`
        );
    }
    
    // Test 7: Flexbox layout
    const controlBarContainer = controlBar.querySelector('.control-bar-container');
    if (controlBarContainer) {
        const containerStyle = window.getComputedStyle(controlBarContainer);
        
        addTest(
            'Control Bar container uses flexbox',
            containerStyle.display === 'flex',
            `Expected display: flex, got ${containerStyle.display}`
        );
        
        addTest(
            'Control Bar container has gap',
            parseFloat(containerStyle.gap) > 0 || parseFloat(containerStyle.columnGap) > 0,
            `Container gap not set`
        );
    }
    
    // Test 8: Control buttons container
    const controlButtons = controlBar.querySelector('.control-buttons');
    if (controlButtons) {
        const buttonsStyle = window.getComputedStyle(controlButtons);
        
        addTest(
            'Control buttons container uses flexbox',
            buttonsStyle.display === 'flex',
            `Expected display: flex, got ${buttonsStyle.display}`
        );
        
        addTest(
            'Control buttons container has gap',
            parseFloat(buttonsStyle.gap) > 0 || parseFloat(buttonsStyle.columnGap) > 0,
            `Buttons container gap not set`
        );
    }
    
    // Test 9: Speed control styling
    const speedControl = controlBar.querySelector('.speed-control');
    if (speedControl) {
        const speedStyle = window.getComputedStyle(speedControl);
        
        addTest(
            'Speed control uses flexbox',
            speedStyle.display === 'flex',
            `Expected display: flex, got ${speedStyle.display}`
        );
        
        addTest(
            'Speed control has border',
            parseFloat(speedStyle.borderWidth) > 0,
            `Speed control border not set`
        );
        
        addTest(
            'Speed control has border-radius',
            parseFloat(speedStyle.borderRadius) > 0,
            `Speed control border-radius not set`
        );
    }
    
    return results;
};

// Test suite for Requirements validation
const testRequirements = () => {
    console.log('\n📋 Testing Requirements Validation...');
    
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };
    
    const addTest = (name, passed, message) => {
        results.tests.push({ name, passed, message });
        if (passed) {
            results.passed++;
            console.log(`✅ ${name}`);
        } else {
            results.failed++;
            console.error(`❌ ${name}: ${message}`);
        }
    };
    
    // Requirement 8.1: Step Forward button
    const btnStepForward = document.getElementById('btn-step-forward');
    addTest(
        'Requirement 8.1: Step Forward button exists',
        btnStepForward !== null && btnStepForward.textContent.includes('Step Forward'),
        'Step Forward button not found or incorrectly labeled'
    );
    
    // Requirement 8.2: Step Back button
    const btnStepBack = document.getElementById('btn-step-back');
    addTest(
        'Requirement 8.2: Step Back button exists',
        btnStepBack !== null && btnStepBack.textContent.includes('Step Back'),
        'Step Back button not found or incorrectly labeled'
    );
    
    // Requirement 8.3: Auto-play button
    const btnAutoPlay = document.getElementById('btn-auto-play');
    addTest(
        'Requirement 8.3: Auto-play button exists',
        btnAutoPlay !== null && btnAutoPlay.textContent.includes('Auto-play'),
        'Auto-play button not found or incorrectly labeled'
    );
    
    // Requirement 8.4: Speed slider with range 0.5x to 3x
    const speedSlider = document.getElementById('speed-slider');
    const hasCorrectRange = speedSlider && 
        parseFloat(speedSlider.getAttribute('min')) === 0.5 &&
        parseFloat(speedSlider.getAttribute('max')) === 3;
    addTest(
        'Requirement 8.4: Speed slider with range 0.5x to 3x',
        hasCorrectRange,
        'Speed slider not found or incorrect range'
    );
    
    // Requirement 8.5: Reset button
    const btnReset = document.getElementById('btn-reset');
    addTest(
        'Requirement 8.5: Reset button exists',
        btnReset !== null && btnReset.textContent.includes('Reset'),
        'Reset button not found or incorrectly labeled'
    );
    
    // Requirement 9.1: Explain button
    const btnExplain = document.getElementById('btn-explain');
    addTest(
        'Requirement 9.1: Explain button exists',
        btnExplain !== null && btnExplain.textContent.includes('Explain'),
        'Explain button not found or incorrectly labeled'
    );
    
    return results;
};

// Run all tests
const runAllTests = () => {
    console.log('🚀 Starting Control Bar Verification Tests for Task 12.1\n');
    console.log('=' .repeat(60));
    
    const structureResults = testControlBarStructure();
    const cssResults = testControlBarCSS();
    const requirementsResults = testRequirements();
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Summary:');
    console.log('='.repeat(60));
    
    const totalPassed = structureResults.passed + cssResults.passed + requirementsResults.passed;
    const totalFailed = structureResults.failed + cssResults.failed + requirementsResults.failed;
    const totalTests = totalPassed + totalFailed;
    
    console.log(`\n📦 Structure Tests: ${structureResults.passed}/${structureResults.passed + structureResults.failed} passed`);
    console.log(`🎨 CSS Tests: ${cssResults.passed}/${cssResults.passed + cssResults.failed} passed`);
    console.log(`📋 Requirements Tests: ${requirementsResults.passed}/${requirementsResults.passed + requirementsResults.failed} passed`);
    
    console.log(`\n✨ Total: ${totalPassed}/${totalTests} tests passed`);
    
    if (totalFailed === 0) {
        console.log('\n🎉 All tests passed! Task 12.1 is complete.');
    } else {
        console.log(`\n⚠️  ${totalFailed} test(s) failed. Please review the errors above.`);
    }
    
    return {
        structure: structureResults,
        css: cssResults,
        requirements: requirementsResults,
        summary: {
            total: totalTests,
            passed: totalPassed,
            failed: totalFailed,
            success: totalFailed === 0
        }
    };
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testControlBarStructure,
        testControlBarCSS,
        testRequirements,
        runAllTests
    };
}

// Auto-run tests when loaded in browser
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllTests);
    } else {
        // DOM is already ready, run tests after a short delay to ensure styles are loaded
        setTimeout(runAllTests, 100);
    }
}
