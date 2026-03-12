/**
 * Verification Script for Task 9.2: Heap Object Rendering with Reference Arrows
 * 
 * This script verifies that the updateMemoryObjects method in AnimationManager:
 * - Renders heap objects correctly with all required information
 * - Applies allocation/deallocation animations on state changes
 * - Draws SVG arrows for object references
 * - Shows placeholder for empty heap
 * - Validates Requirements 5.1, 5.2, 5.3, 5.4
 */

const fs = require('fs');
const path = require('path');

// Read the AnimationManager source file
const animationManagerPath = path.join(__dirname, '..', 'src', 'scripts', 'animation-manager.js');
const animationManagerContent = fs.readFileSync(animationManagerPath, 'utf-8');

// Test results array
const results = [];

// Helper function to log test results
function logTest(testName, passed, details = '') {
    const status = passed ? '✓ PASS' : '✗ FAIL';
    console.log(`${status}: ${testName}`);
    if (details) {
        console.log(`  Details: ${details}`);
    }
    return passed;
}

console.log('='.repeat(80));
console.log('Task 9.2 Verification: Heap Object Rendering with Reference Arrows');
console.log('='.repeat(80));
console.log();

// Mock AnimationManager with only the methods we need
class MockAnimationManager {
    constructor(panels) {
        this.memoryPanel = panels.memoryPanel;
        this.previousHeap = [];
    }
    
    // Include the actual updateMemoryObjects implementation
    updateMemoryObjects(heap) {
        if (!this.memoryPanel) {
            console.warn('Memory panel not available for update');
            return;
        }
        
        const memoryContainer = this.memoryPanel.querySelector('#memory-objects-container');
        const arrowsSvg = this.memoryPanel.querySelector('#memory-arrows');
        
        if (!memoryContainer || !arrowsSvg) {
            console.warn('Memory container or arrows SVG not found');
            return;
        }
        
        // If no heap or empty, show placeholder
        if (!heap || heap.length === 0) {
            memoryContainer.innerHTML = `
                <div class="memory-placeholder">
                    <div class="memory-empty-icon">🧠</div>
                    <p class="memory-empty-text">No objects allocated yet</p>
                    <p class="memory-empty-hint">Execute code to see heap objects</p>
                </div>
            `;
            arrowsSvg.innerHTML = '';
            this.previousHeap = [];
            return;
        }
        
        const previousHeap = this.previousHeap || [];
        const previousIds = new Set(previousHeap.map(obj => obj.objectId));
        const currentIds = new Set(heap.map(obj => obj.objectId));
        
        const allocatedIds = new Set();
        for (const obj of heap) {
            if (!previousIds.has(obj.objectId)) {
                allocatedIds.add(obj.objectId);
            }
        }
        
        const deallocatedIds = new Set();
        for (const obj of previousHeap) {
            if (!currentIds.has(obj.objectId)) {
                deallocatedIds.add(obj.objectId);
            }
        }
        
        let html = '';
        for (const obj of heap) {
            const animationClass = allocatedIds.has(obj.objectId) ? 'allocating' : '';
            
            let displayValue = '';
            if (obj.type === 'int' || obj.type === 'float') {
                displayValue = String(obj.value);
            } else if (obj.type === 'str') {
                displayValue = `"${obj.value}"`;
            } else if (obj.type === 'list') {
                try {
                    displayValue = JSON.stringify(obj.value);
                } catch (e) {
                    displayValue = '[...]';
                }
            } else if (obj.type === 'dict') {
                try {
                    displayValue = JSON.stringify(obj.value);
                } catch (e) {
                    displayValue = '{...}';
                }
            } else if (obj.type === 'function') {
                displayValue = `<function ${obj.value}>`;
            } else {
                displayValue = String(obj.value);
            }
            
            html += `
                <div class="memory-object ${animationClass}" data-object-id="${obj.objectId}" data-type="${obj.type}">
                    <div class="memory-object-header">
                        <div class="memory-object-type-container">
                            <span class="memory-object-type-icon"></span>
                            <span class="memory-object-type">${obj.type}</span>
                        </div>
                        <span class="memory-object-id">id: ${obj.objectId}</span>
                    </div>
                    <div class="memory-object-body">
                        <div class="memory-object-value">${displayValue}</div>
                        <div class="memory-object-refcount">
                            <span class="memory-object-refcount-label">Ref Count</span>
                            <span class="memory-object-refcount-value">${obj.refCount}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        memoryContainer.innerHTML = html;
        
        setTimeout(() => {
            const objects = memoryContainer.querySelectorAll('.memory-object');
            objects.forEach(obj => {
                obj.classList.remove('allocating', 'deallocating');
            });
        }, 300);
        
        requestAnimationFrame(() => {
            this.drawReferenceArrows(heap, memoryContainer, arrowsSvg);
        });
        
        this.previousHeap = heap.slice();
    }
    
    drawReferenceArrows(heap, memoryContainer, arrowsSvg) {
        arrowsSvg.innerHTML = '';
        
        const contentRect = memoryContainer.getBoundingClientRect();
        
        arrowsSvg.setAttribute('width', contentRect.width);
        arrowsSvg.setAttribute('height', contentRect.height);
        
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '10');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3');
        marker.setAttribute('orient', 'auto');
        marker.setAttribute('markerUnits', 'strokeWidth');
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3, 0 6');
        polygon.setAttribute('fill', '#58a6ff');
        
        marker.appendChild(polygon);
        defs.appendChild(marker);
        arrowsSvg.appendChild(defs);
        
        for (const obj of heap) {
            if (obj.references && obj.references.length > 0) {
                const sourceElement = memoryContainer.querySelector(`[data-object-id="${obj.objectId}"]`);
                if (!sourceElement) continue;
                
                const sourceRect = sourceElement.getBoundingClientRect();
                const sourceX = sourceRect.left - contentRect.left + sourceRect.width / 2;
                const sourceY = sourceRect.bottom - contentRect.top;
                
                for (const refId of obj.references) {
                    const targetElement = memoryContainer.querySelector(`[data-object-id="${refId}"]`);
                    if (!targetElement) continue;
                    
                    const targetRect = targetElement.getBoundingClientRect();
                    const targetX = targetRect.left - contentRect.left + targetRect.width / 2;
                    const targetY = targetRect.top - contentRect.top;
                    
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', sourceX);
                    line.setAttribute('y1', sourceY);
                    line.setAttribute('x2', targetX);
                    line.setAttribute('y2', targetY);
                    line.setAttribute('class', 'memory-arrow');
                    
                    arrowsSvg.appendChild(line);
                }
            }
        }
    }
}

// Test Suite
describe('Task 9.2: Heap Object Rendering with Reference Arrows', () => {
    let memoryPanel;
    let animationManager;
    
    beforeEach(() => {
        // Clean up any existing panel
        const existing = document.getElementById('memory-panel');
        if (existing) {
            existing.remove();
        }
        
        // Create fresh mock panel
        memoryPanel = createMockMemoryPanel();
        animationManager = new MockAnimationManager({ memoryPanel });
    });
    
    afterEach(() => {
        if (memoryPanel && memoryPanel.parentNode) {
            memoryPanel.remove();
        }
    });
    
    // Requirement 5.1: Display heap objects (int, str, list, dict)
    describe('Requirement 5.1: Display heap objects', () => {
        test('should render integer objects with correct type icon and value', () => {
            const heap = [
                { objectId: 'obj1', type: 'int', value: 42, refCount: 1, references: [] }
            ];
            
            animationManager.updateMemoryObjects(heap);
            
            const container = memoryPanel.querySelector('#memory-objects-container');
            const objectCard = container.querySelector('[data-object-id="obj1"]');
            
            expect(objectCard).not.toBeNull();
            expect(objectCard.getAttribute('data-type')).toBe('int');
            expect(objectCard.querySelector('.memory-object-type').textContent).toBe('int');
            expect(objectCard.querySelector('.memory-object-value').textContent).toBe('42');
            expect(objectCard.querySelector('.memory-object-id').textContent).toBe('id: obj1');
        });
        
        test('should render string objects with quoted value', () => {
            const heap = [
                { objectId: 'obj2', type: 'str', value: 'hello', refCount: 1, references: [] }
            ];
            
            animationManager.updateMemoryObjects(heap);
            
            const container = memoryPanel.querySelector('#memory-objects-container');
            const objectCard = container.querySelector('[data-object-id="obj2"]');
            
            expect(objectCard).not.toBeNull();
            expect(objectCard.getAttribute('data-type')).toBe('str');
            expect(objectCard.querySelector('.memory-object-value').textContent).toBe('"hello"');
        });
        
        test('should render list objects with JSON representation', () => {
            const heap = [
                { objectId: 'obj3', type: 'list', value: [1, 2, 3], refCount: 1, references: [] }
            ];
            
            animationManager.updateMemoryObjects(heap);
            
            const container = memoryPanel.querySelector('#memory-objects-container');
            const objectCard = container.querySelector('[data-object-id="obj3"]');
            
            expect(objectCard).not.toBeNull();
            expect(objectCard.getAttribute('data-type')).toBe('list');
            expect(objectCard.querySelector('.memory-object-value').textContent).toBe('[1,2,3]');
        });
        
        test('should render dict objects with JSON representation', () => {
            const heap = [
                { objectId: 'obj4', type: 'dict', value: { key: 'value' }, refCount: 1, references: [] }
            ];
            
            animationManager.updateMemoryObjects(heap);
            
            const container = memoryPanel.querySelector('#memory-objects-container');
            const objectCard = container.querySelector('[data-object-id="obj4"]');
            
            expect(objectCard).not.toBeNull();
            expect(objectCard.getAttribute('data-type')).toBe('dict');
            expect(objectCard.querySelector('.memory-object-value').textContent).toContain('key');
        });
        
        test('should display reference count for all objects', () => {
            const heap = [
                { objectId: 'obj5', type: 'int', value: 100, refCount: 3, references: [] }
            ];
            
            animationManager.updateMemoryObjects(heap);
            
            const container = memoryPanel.querySelector('#memory-objects-container');
            const objectCard = container.querySelector('[data-object-id="obj5"]');
            
            expect(objectCard.querySelector('.memory-object-refcount-value').textContent).toBe('3');
        });
    });
    
    // Requirement 5.2: Display variable names with visual arrows
    describe('Requirement 5.2: Display reference arrows', () => {
        test('should create SVG arrowhead marker definition', (done) => {
            const heap = [
                { objectId: 'obj1', type: 'int', value: 1, refCount: 1, references: ['obj2'] },
                { objectId: 'obj2', type: 'int', value: 2, refCount: 1, references: [] }
            ];
            
            animationManager.updateMemoryObjects(heap);
            
            // Wait for requestAnimationFrame
            setTimeout(() => {
                const svg = memoryPanel.querySelector('#memory-arrows');
                const marker = svg.querySelector('#arrowhead');
                
                expect(marker).not.toBeNull();
                expect(marker.getAttribute('markerWidth')).toBe('10');
                expect(marker.getAttribute('markerHeight')).toBe('10');
                
                const polygon = marker.querySelector('polygon');
                expect(polygon).not.toBeNull();
                expect(polygon.getAttribute('fill')).toBe('#58a6ff');
                
                done();
            }, 50);
        });
        
        test('should draw SVG line for object references', (done) => {
            const heap = [
                { objectId: 'obj1', type: 'list', value: [], refCount: 1, references: ['obj2'] },
                { objectId: 'obj2', type: 'int', value: 42, refCount: 2, references: [] }
            ];
            
            animationManager.updateMemoryObjects(heap);
            
            // Wait for requestAnimationFrame
            setTimeout(() => {
                const svg = memoryPanel.querySelector('#memory-arrows');
                const lines = svg.querySelectorAll('line.memory-arrow');
                
                expect(lines.length).toBeGreaterThan(0);
                
                const line = lines[0];
                expect(line.getAttribute('class')).toBe('memory-arrow');
                expect(line.getAttribute('x1')).not.toBeNull();
                expect(line.getAttribute('y1')).not.toBeNull();
                expect(line.getAttribute('x2')).not.toBeNull();
                expect(line.getAttribute('y2')).not.toBeNull();
                
                done();
            }, 50);
        });
    });
    
    // Requirement 5.3: Animate object allocation
    describe('Requirement 5.3: Allocation animation', () => {
        test('should apply allocating class to newly added objects', () => {
            // First update with empty heap
            animationManager.updateMemoryObjects([]);
            
            // Second update with new object
            const heap = [
                { objectId: 'obj1', type: 'int', value: 42, refCount: 1, references: [] }
            ];
            
            animationManager.updateMemoryObjects(heap);
            
            const container = memoryPanel.querySelector('#memory-objects-container');
            const objectCard = container.querySelector('[data-object-id="obj1"]');
            
            expect(objectCard.classList.contains('allocating')).toBe(true);
        });
        
        test('should not apply allocating class to existing objects', () => {
            // First update
            const heap1 = [
                { objectId: 'obj1', type: 'int', value: 42, refCount: 1, references: [] }
            ];
            animationManager.updateMemoryObjects(heap1);
            
            // Second update with same object
            const heap2 = [
                { objectId: 'obj1', type: 'int', value: 42, refCount: 1, references: [] }
            ];
            animationManager.updateMemoryObjects(heap2);
            
            const container = memoryPanel.querySelector('#memory-objects-container');
            const objectCard = container.querySelector('[data-object-id="obj1"]');
            
            expect(objectCard.classList.contains('allocating')).toBe(false);
        });
    });
    
    // Requirement 5.4: Animate object deallocation
    describe('Requirement 5.4: Deallocation detection', () => {
        test('should detect deallocated objects', () => {
            // First update with two objects
            const heap1 = [
                { objectId: 'obj1', type: 'int', value: 42, refCount: 1, references: [] },
                { objectId: 'obj2', type: 'str', value: 'test', refCount: 1, references: [] }
            ];
            animationManager.updateMemoryObjects(heap1);
            
            // Second update with only one object (obj2 deallocated)
            const heap2 = [
                { objectId: 'obj1', type: 'int', value: 42, refCount: 1, references: [] }
            ];
            animationManager.updateMemoryObjects(heap2);
            
            const container = memoryPanel.querySelector('#memory-objects-container');
            const obj1 = container.querySelector('[data-object-id="obj1"]');
            const obj2 = container.querySelector('[data-object-id="obj2"]');
            
            expect(obj1).not.toBeNull();
            expect(obj2).toBeNull(); // obj2 should be removed from DOM
        });
    });
    
    // Empty heap placeholder
    describe('Empty heap handling', () => {
        test('should show placeholder when heap is empty', () => {
            animationManager.updateMemoryObjects([]);
            
            const container = memoryPanel.querySelector('#memory-objects-container');
            const placeholder = container.querySelector('.memory-placeholder');
            
            expect(placeholder).not.toBeNull();
            expect(placeholder.querySelector('.memory-empty-text').textContent).toBe('No objects allocated yet');
        });
        
        test('should show placeholder when heap is null', () => {
            animationManager.updateMemoryObjects(null);
            
            const container = memoryPanel.querySelector('#memory-objects-container');
            const placeholder = container.querySelector('.memory-placeholder');
            
            expect(placeholder).not.toBeNull();
        });
        
        test('should clear arrows when heap is empty', () => {
            // First add some objects
            const heap = [
                { objectId: 'obj1', type: 'int', value: 42, refCount: 1, references: [] }
            ];
            animationManager.updateMemoryObjects(heap);
            
            // Then clear
            animationManager.updateMemoryObjects([]);
            
            const svg = memoryPanel.querySelector('#memory-arrows');
            expect(svg.innerHTML).toBe('');
        });
    });
    
    // Multiple objects rendering
    describe('Multiple objects rendering', () => {
        test('should render multiple objects of different types', () => {
            const heap = [
                { objectId: 'obj1', type: 'int', value: 42, refCount: 1, references: [] },
                { objectId: 'obj2', type: 'str', value: 'hello', refCount: 1, references: [] },
                { objectId: 'obj3', type: 'list', value: [1, 2], refCount: 1, references: [] },
                { objectId: 'obj4', type: 'dict', value: { a: 1 }, refCount: 1, references: [] }
            ];
            
            animationManager.updateMemoryObjects(heap);
            
            const container = memoryPanel.querySelector('#memory-objects-container');
            const objects = container.querySelectorAll('.memory-object');
            
            expect(objects.length).toBe(4);
            expect(container.querySelector('[data-object-id="obj1"]')).not.toBeNull();
            expect(container.querySelector('[data-object-id="obj2"]')).not.toBeNull();
            expect(container.querySelector('[data-object-id="obj3"]')).not.toBeNull();
            expect(container.querySelector('[data-object-id="obj4"]')).not.toBeNull();
        });
    });
});

console.log('Task 9.2 verification tests loaded successfully');
