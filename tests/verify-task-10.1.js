/**
 * Verification Tests for Task 10.1: GIL Indicator HTML Structure and CSS
 * 
 * This test suite verifies:
 * - GIL Indicator HTML structure is present
 * - CSS dimensions and positioning are correct
 * - Color styles for ACQUIRED and RELEASED states are defined
 * - Tooltip is present and styled
 * - Smooth transitions are defined (300ms duration)
 * - Requirements 6.1, 6.3, 6.4, and 6.6 are validated
 */

const fs = require('fs');
const path = require('path');

// Read HTML and CSS files
const htmlPath = path.join(__dirname, '..', 'index.html');
const cssPath = path.join(__dirname, '..', 'src', 'styles', 'main.css');

const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

// Simple test framework
let passed = 0;
let failed = 0;
let currentSuite = '';

function describe(name, fn) {
    currentSuite = name;
    console.log(`\n${name}`);
    fn();
}

function test(name, fn) {
    try {
        fn();
        console.log(`  ✓ ${name}`);
        passed++;
    } catch (error) {
        console.log(`  ✗ ${name}`);
        console.log(`    ${error.message}`);
        failed++;
    }
}

function expect(value) {
    return {
        toBeTruthy: () => {
            if (!value) throw new Error('Expected value to be truthy');
        },
        toMatch: (pattern) => {
            if (!pattern.test(value)) throw new Error(`Expected to match pattern: ${pattern}`);
        }
    };
}

// Test suite
console.log('Running Task 10.1 verification tests...\n');

describe('HTML Structure', () => {
    test('GIL Indicator element exists with correct ID', () => {
        expect(htmlContent).toMatch(/<div\s+id="gil-indicator"/);
    });
    
    test('GIL Indicator has initial state class (gil-released)', () => {
        expect(htmlContent).toMatch(/id="gil-indicator"[^>]*class="[^"]*gil-released[^"]*"/);
    });
    
    test('GIL Indicator has tooltip data attribute', () => {
        expect(htmlContent).toMatch(/id="gil-indicator"[^>]*data-tooltip="[^"]+"/);
        expect(htmlContent).toMatch(/Global Interpreter Lock/);
    });
    
    test('GIL icon element exists', () => {
        expect(htmlContent).toMatch(/<div\s+class="gil-icon">/);
    });
    
    test('GIL info container exists', () => {
        expect(htmlContent).toMatch(/<div\s+class="gil-info">/);
    });
    
    test('GIL state element exists', () => {
        expect(htmlContent).toMatch(/<div\s+class="gil-state">/);
    });
    
    test('GIL thread element exists', () => {
        expect(htmlContent).toMatch(/<div\s+class="gil-thread">/);
    });
    
    test('GIL Indicator is positioned in right panel', () => {
        const rightPanelMatch = htmlContent.match(/<div\s+id="right-panel">([\s\S]*?)<div\s+id="pipeline-diagram">/);
        expect(rightPanelMatch).toBeTruthy();
        expect(rightPanelMatch[1]).toMatch(/id="gil-indicator"/);
    });
});

describe('CSS Dimensions and Positioning', () => {
    test('GIL Indicator has correct width (200px)', () => {
        const widthMatch = cssContent.match(/#gil-indicator\s*{[^}]*width:\s*200px/);
        expect(widthMatch).toBeTruthy();
    });
    
    test('GIL Indicator has correct height (40px)', () => {
        const heightMatch = cssContent.match(/#gil-indicator\s*{[^}]*height:\s*40px/);
        expect(heightMatch).toBeTruthy();
    });
    
    test('GIL Indicator has absolute positioning', () => {
        const positionMatch = cssContent.match(/#gil-indicator\s*{[^}]*position:\s*absolute/);
        expect(positionMatch).toBeTruthy();
    });
    
    test('GIL Indicator is positioned at top-right', () => {
        const gilIndicatorStyles = cssContent.match(/#gil-indicator\s*{[^}]*}/s);
        expect(gilIndicatorStyles).toBeTruthy();
        expect(gilIndicatorStyles[0]).toMatch(/top:\s*\d+px/);
        expect(gilIndicatorStyles[0]).toMatch(/right:\s*\d+px/);
    });
    
    test('Right panel has relative positioning for GIL Indicator', () => {
        const rightPanelMatch = cssContent.match(/#right-panel\s*{[^}]*position:\s*relative/);
        expect(rightPanelMatch).toBeTruthy();
    });
    
    test('GIL Indicator has high z-index for visibility', () => {
        const zIndexMatch = cssContent.match(/#gil-indicator\s*{[^}]*z-index:\s*\d+/);
        expect(zIndexMatch).toBeTruthy();
    });
});

describe('Color Styles for ACQUIRED State', () => {
    test('ACQUIRED state class exists (gil-acquired)', () => {
        expect(cssContent).toMatch(/#gil-indicator\.gil-acquired/);
    });
    
    test('ACQUIRED state uses green color (#3fb950)', () => {
        const acquiredMatch = cssContent.match(/#gil-indicator\.gil-acquired[\s\S]*?{[\s\S]*?}/);
        expect(acquiredMatch).toBeTruthy();
        
        // Check for success-color variable or direct green color
        const successColorMatch = cssContent.match(/--success-color:\s*#3fb950/);
        expect(successColorMatch).toBeTruthy();
        
        // Check that gil-acquired uses success-color
        const gilAcquiredSection = cssContent.match(/#gil-indicator\.gil-acquired[\s\S]*?(?=#gil-indicator\.gil-released|\/\*|$)/);
        expect(gilAcquiredSection[0]).toMatch(/var\(--success-color\)/);
    });
    
    test('ACQUIRED state styles the state text', () => {
        const stateTextMatch = cssContent.match(/#gil-indicator\.gil-acquired\s+\.gil-state/);
        expect(stateTextMatch).toBeTruthy();
    });
});

describe('Color Styles for RELEASED State', () => {
    test('RELEASED state class exists (gil-released)', () => {
        expect(cssContent).toMatch(/#gil-indicator\.gil-released/);
    });
    
    test('RELEASED state uses red color (#f85149)', () => {
        const releasedMatch = cssContent.match(/#gil-indicator\.gil-released[\s\S]*?{[\s\S]*?}/);
        expect(releasedMatch).toBeTruthy();
        
        // Check for error-color variable or direct red color
        const errorColorMatch = cssContent.match(/--error-color:\s*#f85149/);
        expect(errorColorMatch).toBeTruthy();
        
        // Check that gil-released uses error-color
        const gilReleasedSection = cssContent.match(/#gil-indicator\.gil-released[\s\S]*?(?=\/\*|\.gil-icon|$)/);
        expect(gilReleasedSection[0]).toMatch(/var\(--error-color\)/);
    });
    
    test('RELEASED state styles the state text', () => {
        const stateTextMatch = cssContent.match(/#gil-indicator\.gil-released\s+\.gil-state/);
        expect(stateTextMatch).toBeTruthy();
    });
});

describe('Tooltip Styles', () => {
    test('Tooltip pseudo-element exists (::after)', () => {
        expect(cssContent).toMatch(/#gil-indicator::after/);
    });
    
    test('Tooltip uses data-tooltip attribute', () => {
        const tooltipMatch = cssContent.match(/#gil-indicator::after[\s\S]*?content:\s*attr\(data-tooltip\)/);
        expect(tooltipMatch).toBeTruthy();
    });
    
    test('Tooltip is positioned below indicator', () => {
        const tooltipStyles = cssContent.match(/#gil-indicator::after\s*{[^}]*}/s);
        expect(tooltipStyles).toBeTruthy();
        expect(tooltipStyles[0]).toMatch(/top:\s*calc\(100%\s*\+\s*\d+px\)/);
    });
    
    test('Tooltip has proper styling (background, border, padding)', () => {
        const tooltipStyles = cssContent.match(/#gil-indicator::after\s*{[^}]*}/s);
        expect(tooltipStyles[0]).toMatch(/background-color:/);
        expect(tooltipStyles[0]).toMatch(/border:/);
        expect(tooltipStyles[0]).toMatch(/padding:/);
    });
    
    test('Tooltip is hidden by default', () => {
        const tooltipStyles = cssContent.match(/#gil-indicator::after\s*{[^}]*}/s);
        expect(tooltipStyles[0]).toMatch(/opacity:\s*0/);
        expect(tooltipStyles[0]).toMatch(/visibility:\s*hidden/);
    });
    
    test('Tooltip appears on hover', () => {
        const hoverMatch = cssContent.match(/#gil-indicator:hover::after\s*{[^}]*}/s);
        expect(hoverMatch).toBeTruthy();
        expect(hoverMatch[0]).toMatch(/opacity:\s*1/);
        expect(hoverMatch[0]).toMatch(/visibility:\s*visible/);
    });
    
    test('Tooltip arrow exists (::before)', () => {
        expect(cssContent).toMatch(/#gil-indicator::before/);
    });
    
    test('Tooltip arrow appears on hover', () => {
        const arrowHoverMatch = cssContent.match(/#gil-indicator:hover::before\s*{[^}]*}/s);
        expect(arrowHoverMatch).toBeTruthy();
        expect(arrowHoverMatch[0]).toMatch(/opacity:\s*1/);
    });
});

describe('Smooth Transitions', () => {
    test('GIL Indicator has transition property', () => {
        const indicatorStyles = cssContent.match(/#gil-indicator\s*{[^}]*}/s);
        expect(indicatorStyles[0]).toMatch(/transition:/);
    });
    
    test('Transition duration is 300ms', () => {
        // Check for --transition-duration variable
        const transitionVarMatch = cssContent.match(/--transition-duration:\s*300ms/);
        expect(transitionVarMatch).toBeTruthy();
        
        // Check that GIL Indicator uses the variable
        const indicatorStyles = cssContent.match(/#gil-indicator\s*{[^}]*}/s);
        expect(indicatorStyles[0]).toMatch(/var\(--transition-duration\)/);
    });
    
    test('State text has smooth color transition', () => {
        // Match the base .gil-state class (not nested selectors)
        const stateStyles = cssContent.match(/\/\* GIL State Text \*\/\s*\.gil-state\s*{[^}]*}/s);
        expect(stateStyles).toBeTruthy();
        const hasTransition = /transition/.test(stateStyles[0]);
        if (!hasTransition) {
            throw new Error(`Expected transition property in .gil-state`);
        }
    });
    
    test('Icon has smooth transition', () => {
        // Match the base .gil-icon class (not nested selectors)
        const iconStyles = cssContent.match(/\/\* GIL Icon \*\/\s*\.gil-icon\s*{[^}]*}/s);
        expect(iconStyles).toBeTruthy();
        const hasTransition = /transition/.test(iconStyles[0]);
        if (!hasTransition) {
            throw new Error(`Expected transition property in .gil-icon`);
        }
    });
    
    test('Tooltip has smooth transition', () => {
        const tooltipStyles = cssContent.match(/#gil-indicator::after\s*{[^}]*}/s);
        expect(tooltipStyles[0]).toMatch(/transition:/);
    });
});

describe('Requirements Validation', () => {
    test('Requirement 6.1: GIL Indicator is persistently visible at top', () => {
        // Check positioning and z-index
        const indicatorStyles = cssContent.match(/#gil-indicator\s*{[^}]*}/s);
        expect(indicatorStyles[0]).toMatch(/position:\s*absolute/);
        expect(indicatorStyles[0]).toMatch(/top:/);
        expect(indicatorStyles[0]).toMatch(/z-index:/);
    });
    
    test('Requirement 6.3: ACQUIRED state displays green color', () => {
        const acquiredSection = cssContent.match(/#gil-indicator\.gil-acquired[\s\S]*?(?=#gil-indicator\.gil-released)/);
        expect(acquiredSection[0]).toMatch(/var\(--success-color\)/);
        expect(cssContent).toMatch(/--success-color:\s*#3fb950/);
    });
    
    test('Requirement 6.4: RELEASED state displays red color', () => {
        const releasedSection = cssContent.match(/#gil-indicator\.gil-released[\s\S]*?(?=\/\*|\.gil-icon)/);
        expect(releasedSection[0]).toMatch(/var\(--error-color\)/);
        expect(cssContent).toMatch(/--error-color:\s*#f85149/);
    });
    
    test('Requirement 6.6: Tooltip explains GIL purpose on hover', () => {
        // Check HTML has tooltip
        expect(htmlContent).toMatch(/data-tooltip="[^"]*Global Interpreter Lock[^"]*"/);
        
        // Check CSS implements hover tooltip
        expect(cssContent).toMatch(/#gil-indicator::after/);
        expect(cssContent).toMatch(/#gil-indicator:hover::after/);
    });
});

describe('Visual Design Consistency', () => {
    test('GIL Indicator uses dark theme colors', () => {
        const indicatorStyles = cssContent.match(/#gil-indicator\s*{[^}]*}/s);
        expect(indicatorStyles[0]).toMatch(/background-color:\s*rgba/);
        expect(indicatorStyles[0]).toMatch(/border:/);
    });
    
    test('GIL Indicator has rounded corners', () => {
        const indicatorStyles = cssContent.match(/#gil-indicator\s*{[^}]*}/s);
        expect(indicatorStyles[0]).toMatch(/border-radius:/);
    });
    
    test('GIL Indicator has hover effect', () => {
        const hoverMatch = cssContent.match(/#gil-indicator:hover\s*{[^}]*}/s);
        expect(hoverMatch).toBeTruthy();
    });
    
    test('Thread ID uses monospace font', () => {
        const threadStyles = cssContent.match(/\.gil-thread\s*{[^}]*}/s);
        expect(threadStyles[0]).toMatch(/font-family:[^;]*monospace/i);
    });
});

// Print results
console.log(`\n\n${'='.repeat(60)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(60));

if (failed === 0) {
    console.log('\n✓ All tests passed! Task 10.1 is complete.');
    console.log('\nVerified:');
    console.log('  - GIL Indicator HTML structure is present');
    console.log('  - CSS dimensions (200px × 40px) and positioning (top-right)');
    console.log('  - Color styles for ACQUIRED (green #3fb950) and RELEASED (red #f85149)');
    console.log('  - Tooltip with GIL explanation');
    console.log('  - Smooth transitions (300ms duration)');
    console.log('  - Requirements 6.1, 6.3, 6.4, and 6.6 validated');
} else {
    console.log('\n✗ Some tests failed. Please review the errors above.');
    process.exit(1);
}
