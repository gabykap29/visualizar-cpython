/**
 * Memory Panel Structure and CSS Tests
 * Task 9.1: Create Memory Panel HTML structure and CSS
 * Validates: Requirements 5.5, 5.6
 */

describe('Memory Panel HTML Structure', () => {
    let memoryPanel;
    let memoryContent;
    let memoryArrows;
    let memoryObjectsContainer;
    
    beforeAll(() => {
        // Load the HTML file
        const fs = require('fs');
        const path = require('path');
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        document.body.innerHTML = html;
        
        memoryPanel = document.getElementById('memory-panel');
        memoryContent = document.getElementById('memory-content');
        memoryArrows = document.getElementById('memory-arrows');
        memoryObjectsContainer = document.getElementById('memory-objects-container');
    });
    
    test('Memory Panel exists in the DOM', () => {
        expect(memoryPanel).not.toBeNull();
        expect(memoryPanel).toBeInstanceOf(HTMLElement);
    });
    
    test('Memory Panel has correct class', () => {
        expect(memoryPanel.classList.contains('visualization-panel')).toBe(true);
    });
    
    test('Memory Panel has header with title and subtitle', () => {
        const header = memoryPanel.querySelector('.panel-header');
        expect(header).not.toBeNull();
        
        const title = header.querySelector('.panel-title');
        expect(title).not.toBeNull();
        expect(title.textContent).toBe('Memory Heap');
        
        const subtitle = header.querySelector('.panel-subtitle');
        expect(subtitle).not.toBeNull();
        expect(subtitle.textContent).toBe('Objects & References');
    });
    
    test('Memory Panel has content area', () => {
        expect(memoryContent).not.toBeNull();
        expect(memoryContent.classList.contains('panel-content')).toBe(true);
    });
    
    test('Memory Panel has SVG overlay for arrows', () => {
        expect(memoryArrows).not.toBeNull();
        expect(memoryArrows.tagName.toLowerCase()).toBe('svg');
        expect(memoryArrows.classList.contains('memory-arrows-overlay')).toBe(true);
    });
    
    test('Memory Panel has objects container', () => {
        expect(memoryObjectsContainer).not.toBeNull();
        expect(memoryObjectsContainer.id).toBe('memory-objects-container');
    });
    
    test('Memory Panel has placeholder for empty state', () => {
        const placeholder = memoryObjectsContainer.querySelector('.memory-placeholder');
        expect(placeholder).not.toBeNull();
        
        const icon = placeholder.querySelector('.memory-empty-icon');
        expect(icon).not.toBeNull();
        expect(icon.textContent).toBe('🧠');
        
        const text = placeholder.querySelector('.memory-empty-text');
        expect(text).not.toBeNull();
        expect(text.textContent).toBe('No objects allocated yet');
        
        const hint = placeholder.querySelector('.memory-empty-hint');
        expect(hint).not.toBeNull();
        expect(hint.textContent).toBe('Execute code to see heap objects');
    });
});

describe('Memory Panel CSS Styles', () => {
    let styleSheet;
    
    beforeAll(() => {
        // Load the CSS file
        const fs = require('fs');
        const path = require('path');
        const css = fs.readFileSync(path.resolve(__dirname, '../src/styles/main.css'), 'utf8');
        
        // Create a style element and add it to the document
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        styleSheet = style.sheet;
    });
    
    test('Memory Panel CSS class is defined', () => {
        const rules = Array.from(styleSheet.cssRules);
        const memoryPanelRule = rules.find(rule => 
            rule.selectorText && rule.selectorText.includes('#memory-panel')
        );
        expect(memoryPanelRule).toBeDefined();
    });
    
    test('Memory Panel has correct dimensions', () => {
        const rules = Array.from(styleSheet.cssRules);
        const memoryPanelRule = rules.find(rule => 
            rule.selectorText === '#memory-panel'
        );
        
        expect(memoryPanelRule).toBeDefined();
        expect(memoryPanelRule.style.width).toBe('30%');
        expect(memoryPanelRule.style.height).toBe('100%');
        expect(memoryPanelRule.style.minWidth).toBe('250px');
    });
    
    test('Object allocation animation is defined with 300ms duration', () => {
        const rules = Array.from(styleSheet.cssRules);
        
        // Check for allocating class
        const allocatingRule = rules.find(rule => 
            rule.selectorText && rule.selectorText.includes('.memory-object.allocating')
        );
        expect(allocatingRule).toBeDefined();
        
        // Check for keyframes
        const keyframesRule = rules.find(rule => 
            rule.type === CSSRule.KEYFRAMES_RULE && rule.name === 'objectAllocate'
        );
        expect(keyframesRule).toBeDefined();
        
        // Verify animation properties
        const animationValue = allocatingRule.style.animation;
        expect(animationValue).toContain('objectAllocate');
        expect(animationValue).toContain('var(--transition-duration)');
    });
    
    test('Object deallocation animation is defined with 300ms duration', () => {
        const rules = Array.from(styleSheet.cssRules);
        
        // Check for deallocating class
        const deallocatingRule = rules.find(rule => 
            rule.selectorText && rule.selectorText.includes('.memory-object.deallocating')
        );
        expect(deallocatingRule).toBeDefined();
        
        // Check for keyframes
        const keyframesRule = rules.find(rule => 
            rule.type === CSSRule.KEYFRAMES_RULE && rule.name === 'objectDeallocate'
        );
        expect(keyframesRule).toBeDefined();
        
        // Verify animation properties
        const animationValue = deallocatingRule.style.animation;
        expect(animationValue).toContain('objectDeallocate');
        expect(animationValue).toContain('var(--transition-duration)');
    });
    
    test('Allocation animation keyframes have correct properties', () => {
        const rules = Array.from(styleSheet.cssRules);
        const keyframesRule = rules.find(rule => 
            rule.type === CSSRule.KEYFRAMES_RULE && rule.name === 'objectAllocate'
        );
        
        expect(keyframesRule).toBeDefined();
        
        const keyframes = Array.from(keyframesRule.cssRules);
        const startFrame = keyframes.find(kf => kf.keyText === '0%');
        const endFrame = keyframes.find(kf => kf.keyText === '100%');
        
        expect(startFrame).toBeDefined();
        expect(startFrame.style.opacity).toBe('0');
        expect(startFrame.style.transform).toContain('scale(0.8)');
        
        expect(endFrame).toBeDefined();
        expect(endFrame.style.opacity).toBe('1');
        expect(endFrame.style.transform).toContain('scale(1)');
    });
    
    test('Deallocation animation keyframes have correct properties', () => {
        const rules = Array.from(styleSheet.cssRules);
        const keyframesRule = rules.find(rule => 
            rule.type === CSSRule.KEYFRAMES_RULE && rule.name === 'objectDeallocate'
        );
        
        expect(keyframesRule).toBeDefined();
        
        const keyframes = Array.from(keyframesRule.cssRules);
        const startFrame = keyframes.find(kf => kf.keyText === '0%');
        const endFrame = keyframes.find(kf => kf.keyText === '100%');
        
        expect(startFrame).toBeDefined();
        expect(startFrame.style.opacity).toBe('1');
        expect(startFrame.style.transform).toContain('scale(1)');
        
        expect(endFrame).toBeDefined();
        expect(endFrame.style.opacity).toBe('0');
        expect(endFrame.style.transform).toContain('scale(0.8)');
    });
    
    test('Dark theme colors are consistent', () => {
        const rules = Array.from(styleSheet.cssRules);
        
        // Check CSS variables
        const rootRule = rules.find(rule => rule.selectorText === ':root');
        expect(rootRule).toBeDefined();
        expect(rootRule.style.getPropertyValue('--bg-primary')).toBe('#0d1117');
        expect(rootRule.style.getPropertyValue('--accent-color')).toBe('#58a6ff');
        expect(rootRule.style.getPropertyValue('--text-primary')).toBe('#c9d1d9');
        expect(rootRule.style.getPropertyValue('--transition-duration')).toBe('300ms');
    });
    
    test('Memory object card styles are defined', () => {
        const rules = Array.from(styleSheet.cssRules);
        const objectRule = rules.find(rule => 
            rule.selectorText === '.memory-object'
        );
        
        expect(objectRule).toBeDefined();
        expect(objectRule.style.border).toContain('2px solid');
        expect(objectRule.style.borderRadius).toBe('8px');
        expect(objectRule.style.transition).toContain('var(--transition-duration)');
    });
    
    test('Reference arrow styles are defined', () => {
        const rules = Array.from(styleSheet.cssRules);
        const arrowRule = rules.find(rule => 
            rule.selectorText === '.memory-arrow'
        );
        
        expect(arrowRule).toBeDefined();
        expect(arrowRule.style.stroke).toBe('var(--accent-color)');
        expect(arrowRule.style.strokeWidth).toBe('2');
    });
    
    test('Variable reference styles are defined', () => {
        const rules = Array.from(styleSheet.cssRules);
        const varRefRule = rules.find(rule => 
            rule.selectorText === '.memory-variable-ref'
        );
        
        expect(varRefRule).toBeDefined();
        expect(varRefRule.style.color).toBe('var(--accent-color)');
        expect(varRefRule.style.border).toContain('var(--accent-color)');
    });
});

describe('Memory Panel Requirements Validation', () => {
    test('Requirement 5.5: Memory Panel occupies right region of viewport', () => {
        const memoryPanel = document.getElementById('memory-panel');
        expect(memoryPanel).not.toBeNull();
        
        // Check that it's in the visualization-panels container
        const visualizationPanels = document.getElementById('visualization-panels');
        expect(visualizationPanels.contains(memoryPanel)).toBe(true);
        
        // Verify it's the last panel (rightmost)
        const panels = visualizationPanels.querySelectorAll('.visualization-panel');
        const lastPanel = panels[panels.length - 1];
        expect(lastPanel.id).toBe('memory-panel');
    });
    
    test('Requirement 5.6: Memory Panel uses dark theme consistent with other panels', () => {
        const rules = Array.from(document.styleSheets[0].cssRules);
        
        // Check that memory panel uses the same CSS variables as other panels
        const memoryPanelRule = rules.find(rule => 
            rule.selectorText === '#memory-panel'
        );
        
        const bytecodeRule = rules.find(rule => 
            rule.selectorText === '#bytecode-panel'
        );
        
        const stackRule = rules.find(rule => 
            rule.selectorText === '#stack-panel'
        );
        
        // All panels should be visualization-panel class
        expect(memoryPanelRule).toBeDefined();
        expect(bytecodeRule).toBeDefined();
        expect(stackRule).toBeDefined();
    });
    
    test('Animation duration is 300ms as specified', () => {
        const rules = Array.from(document.styleSheets[0].cssRules);
        const rootRule = rules.find(rule => rule.selectorText === ':root');
        
        expect(rootRule).toBeDefined();
        const transitionDuration = rootRule.style.getPropertyValue('--transition-duration');
        expect(transitionDuration).toBe('300ms');
    });
});
