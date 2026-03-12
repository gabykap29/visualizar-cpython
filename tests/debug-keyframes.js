const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'src', 'styles', 'main.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

// Find the start of objectAllocate
const allocateStart = cssContent.indexOf('@keyframes objectAllocate');
if (allocateStart !== -1) {
    // Find the matching closing brace
    let braceCount = 0;
    let inKeyframes = false;
    let allocateEnd = allocateStart;
    
    for (let i = allocateStart; i < cssContent.length; i++) {
        if (cssContent[i] === '{') {
            braceCount++;
            inKeyframes = true;
        } else if (cssContent[i] === '}') {
            braceCount--;
            if (inKeyframes && braceCount === 0) {
                allocateEnd = i + 1;
                break;
            }
        }
    }
    
    const allocateSection = cssContent.substring(allocateStart, allocateEnd);
    console.log('Allocate keyframes section:');
    console.log(allocateSection);
    console.log();
    console.log('Has 100%:', allocateSection.includes('100%'));
    console.log('Has opacity: 1:', allocateSection.includes('opacity: 1'));
    console.log('Has scale(1):', allocateSection.includes('scale(1)'));
}
