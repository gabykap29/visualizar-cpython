/**
 * Simple CSS structure validation for Task 12.1
 * This script checks if the Control Bar CSS is properly defined
 */

const fs = require('fs');
const path = require('path');

// Read the main.css file
const cssPath = path.join(__dirname, '..', 'src', 'styles', 'main.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

console.log('🎨 Validating Control Bar CSS Structure...\n');

const checks = [
    {
        name: 'Control Bar styles exist',
        test: () => cssContent.includes('#control-bar {'),
    },
    {
        name: 'Control Bar container styles exist',
        test: () => cssContent.includes('.control-bar-container {'),
    },
    {
        name: 'Control buttons container styles exist',
        test: () => cssContent.includes('.control-buttons {'),
    },
    {
        name: 'Control button styles exist',
        test: () => cssContent.includes('.control-btn {'),
    },
    {
        name: 'Control button hover styles exist',
        test: () => cssContent.includes('.control-btn:hover'),
    },
    {
        name: 'Control button disabled styles exist',
        test: () => cssContent.includes('.control-btn:disabled'),
    },
    {
        name: 'Control button icon styles exist',
        test: () => cssContent.includes('.control-btn-icon {'),
    },
    {
        name: 'Control button label styles exist',
        test: () => cssContent.includes('.control-btn-label {'),
    },
    {
        name: 'Speed control styles exist',
        test: () => cssContent.includes('.speed-control {'),
    },
    {
        name: 'Speed slider styles exist',
        test: () => cssContent.includes('.speed-slider {'),
    },
    {
        name: 'Speed slider webkit thumb styles exist',
        test: () => cssContent.includes('.speed-slider::-webkit-slider-thumb'),
    },
    {
        name: 'Speed slider firefox thumb styles exist',
        test: () => cssContent.includes('.speed-slider::-moz-range-thumb'),
    },
    {
        name: 'Speed display styles exist',
        test: () => cssContent.includes('.speed-display {'),
    },
    {
        name: 'Control Bar has position absolute',
        test: () => {
            const match = cssContent.match(/#control-bar\s*{[^}]*position:\s*absolute/s);
            return match !== null;
        },
    },
    {
        name: 'Control Bar has bottom: 0',
        test: () => {
            const match = cssContent.match(/#control-bar\s*{[^}]*bottom:\s*0/s);
            return match !== null;
        },
    },
    {
        name: 'Control Bar has height: 20%',
        test: () => {
            const match = cssContent.match(/#control-bar\s*{[^}]*height:\s*20%/s);
            return match !== null;
        },
    },
    {
        name: 'Control buttons use flexbox',
        test: () => {
            const match = cssContent.match(/\.control-buttons\s*{[^}]*display:\s*flex/s);
            return match !== null;
        },
    },
    {
        name: 'Control button has transition',
        test: () => {
            const match = cssContent.match(/\.control-btn\s*{[^}]*transition:/s);
            return match !== null;
        },
    },
    {
        name: 'Speed slider has transition',
        test: () => {
            const match = cssContent.match(/\.speed-slider\s*{[^}]*transition:/s);
            return match !== null;
        },
    },
    {
        name: 'Responsive styles exist',
        test: () => cssContent.includes('@media (max-width: 1600px)'),
    },
    {
        name: 'Playing state styles exist',
        test: () => cssContent.includes('.control-btn.playing'),
    },
    {
        name: 'CSS uses accent color variable',
        test: () => {
            const controlBarSection = cssContent.substring(cssContent.indexOf('/* Control Bar Styles */'));
            return controlBarSection.includes('var(--accent-color)');
        },
    },
    {
        name: 'CSS uses transition duration variable',
        test: () => {
            const controlBarSection = cssContent.substring(cssContent.indexOf('/* Control Bar Styles */'));
            return controlBarSection.includes('var(--transition-duration)');
        },
    },
];

let passed = 0;
let failed = 0;

checks.forEach(check => {
    try {
        const result = check.test();
        if (result) {
            console.log(`✅ ${check.name}`);
            passed++;
        } else {
            console.log(`❌ ${check.name}`);
            failed++;
        }
    } catch (error) {
        console.log(`❌ ${check.name}: ${error.message}`);
        failed++;
    }
});

console.log('\n' + '='.repeat(60));
console.log(`📊 Results: ${passed}/${checks.length} checks passed`);

if (failed === 0) {
    console.log('🎉 All CSS structure checks passed!');
    process.exit(0);
} else {
    console.log(`⚠️  ${failed} check(s) failed.`);
    process.exit(1);
}
