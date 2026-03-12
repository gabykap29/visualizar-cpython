/**
 * Simple HTML structure validation for Task 12.1
 * This script checks if the Control Bar HTML is properly structured
 */

const fs = require('fs');
const path = require('path');

// Read the index.html file
const htmlPath = path.join(__dirname, '..', 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

console.log('🔍 Validating Control Bar HTML Structure...\n');

const checks = [
    {
        name: 'Control Bar container exists',
        test: () => htmlContent.includes('id="control-bar"'),
    },
    {
        name: 'Control Bar container class exists',
        test: () => htmlContent.includes('class="control-bar-container"'),
    },
    {
        name: 'Control buttons container exists',
        test: () => htmlContent.includes('class="control-buttons"'),
    },
    {
        name: 'Step Back button exists',
        test: () => htmlContent.includes('id="btn-step-back"'),
    },
    {
        name: 'Step Forward button exists',
        test: () => htmlContent.includes('id="btn-step-forward"'),
    },
    {
        name: 'Auto-play button exists',
        test: () => htmlContent.includes('id="btn-auto-play"'),
    },
    {
        name: 'Reset button exists',
        test: () => htmlContent.includes('id="btn-reset"'),
    },
    {
        name: 'Explain button exists',
        test: () => htmlContent.includes('id="btn-explain"'),
    },
    {
        name: 'Speed control container exists',
        test: () => htmlContent.includes('class="speed-control"'),
    },
    {
        name: 'Speed slider exists',
        test: () => htmlContent.includes('id="speed-slider"'),
    },
    {
        name: 'Speed slider has min="0.5"',
        test: () => htmlContent.includes('min="0.5"'),
    },
    {
        name: 'Speed slider has max="3"',
        test: () => htmlContent.includes('max="3"'),
    },
    {
        name: 'Speed display exists',
        test: () => htmlContent.includes('id="speed-display"'),
    },
    {
        name: 'All buttons have control-btn class',
        test: () => {
            const btnMatches = htmlContent.match(/class="control-btn"/g);
            return btnMatches && btnMatches.length >= 5;
        },
    },
    {
        name: 'All buttons have icon elements',
        test: () => {
            const iconMatches = htmlContent.match(/class="control-btn-icon"/g);
            return iconMatches && iconMatches.length >= 5;
        },
    },
    {
        name: 'All buttons have label elements',
        test: () => {
            const labelMatches = htmlContent.match(/class="control-btn-label"/g);
            return labelMatches && labelMatches.length >= 5;
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
    console.log('🎉 All HTML structure checks passed!');
    process.exit(0);
} else {
    console.log(`⚠️  ${failed} check(s) failed.`);
    process.exit(1);
}
