# Implementation Plan: Python Execution Visualizer

## Overview

This implementation plan breaks down the Python Execution Visualizer into discrete coding tasks. The visualizer is a single-file HTML application that provides interactive visualization of Python code execution through the CPython pipeline. The implementation follows a bottom-up approach: first establishing the core execution engine and state management, then building UI components, and finally wiring everything together with synchronized updates and animations.

## Tasks

- [x] 1. Set up single-file HTML structure and load CDN dependencies
  - Create index.html with basic HTML5 structure
  - Add CDN script tags for Monaco Editor (unpkg.com or cdnjs.cloudflare.com)
  - Add CDN script tag for Pyodide (cdn.jsdelivr.net/pyodide)
  - Implement loading error handling for CDN failures
  - Add dark theme CSS variables (background: #0d1117, accent: #58a6ff, text: #c9d1d9)
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 13.1, 13.2_

- [x] 2. Implement core data models and state management
  - [x] 2.1 Create ExecutionState, BytecodeInstruction, StackFrame, HeapObject, GILStatus, and CodeExample data structures
    - Define JavaScript classes or object schemas for all data models
    - Include all required fields per design specification
    - _Requirements: 7.9_
  
  - [x] 2.2 Write property test for ExecutionState completeness
    - **Property 12: Execution State Completeness**
    - **Validates: Requirements 7.9** 
  
  - [x] 2.3 Implement StateStore class
    - Write StateStore with states array and currentIndex
    - Implement setStates, getCurrentState, stepForward, stepBack, reset methods
    - Implement canStepForward and canStepBack boundary checks
    - _Requirements: 8.6, 8.7, 8.9_
  
  - [ ]* 2.4 Write property tests for StateStore navigation
    - **Property 13: Step Forward Advances State**
    - **Property 14: Step Back Reverses State**
    - **Property 15: Reset Returns to Initial State**
    - **Validates: Requirements 8.6, 8.7, 8.9**

- [ ] 3. Implement Execution Engine with Pyodide integration
  - [x] 3.1 Create ExecutionEngine class with Pyodide instance
    - Initialize ExecutionEngine with pyodide parameter
    - Implement compile method that catches SyntaxError and returns success/error result
    - _Requirements: 7.1, 14.5, 14.6_
  
  - [x] 3.2 Implement bytecode generation using Pyodide's dis module
    - Write getBytecode method that calls Python's dis.dis() via Pyodide
    - Parse dis output into BytecodeInstruction objects with offset, opname, arg, argval, lineno
    - _Requirements: 7.8, 3.1, 3.2, 3.3, 3.5_
  
  - [ ]* 3.3 Write property tests for bytecode generation
    - **Property 3: Bytecode Instruction Completeness**
    - **Property 4: Bytecode Compilation Produces Instructions**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.5**
  
  - [x] 3.4 Implement state capture during Python execution
    - Write captureStates method that executes Python code step-by-step
    - Capture ExecutionState snapshot at each step including lineNumber, pipelineStage, instructionPointer, callStack, heap, gilStatus
    - Implement 10,000 step limit to prevent memory exhaustion
    - Generate explanation text for each step
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.9, 9.3, 9.4, 9.5_
  
  - [ ]* 3.5 Write property tests for execution engine
    - **Property 11: Python Language Construct Support**
    - **Property 17: Explanation Content Completeness**
    - **Property 20: Error Handling for Invalid Code**
    - **Validates: Requirements 7.2, 7.3, 7.4, 7.5, 7.6, 9.3, 9.4, 9.5, 14.5, 14.6**

- [x] 4. Checkpoint - Verify execution engine functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement Monaco Editor integration
  - [x] 5.1 Initialize Monaco Editor in left panel
    - Create DOM container for Monaco Editor (30% viewport width)
    - Initialize Monaco with Python language mode and dark theme
    - Configure editor options (syntax highlighting, line numbers)
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6_
  
  - [x] 5.2 Implement line highlighting for current execution position
    - Write updateMonacoHighlight method in AnimationManager
    - Use Monaco's decorations API to highlight current line
    - _Requirements: 1.4_
  
  - [ ]* 5.3 Write property test for Monaco line highlighting
    - **Property 1: Monaco Editor Line Highlighting Synchronization**
    - **Validates: Requirements 1.4**

- [ ] 6. Implement Pipeline Diagram visualization
  - [x] 6.1 Create Pipeline Diagram HTML structure and CSS
    - Build six-stage pipeline layout (Source → Tokenizer → Parser → Compiler → Bytecode → PVM)
    - Position in center-top region (70% width, 20% height)
    - Add CSS transitions for stage highlighting (300ms duration, accent color #58a6ff)
    - _Requirements: 2.1, 2.3, 2.4, 2.5_
  
  - [x] 6.2 Implement pipeline stage animation
    - Write updatePipelineStage method in AnimationManager
    - Apply active class to current stage with CSS transition
    - _Requirements: 2.2_
  
  - [ ]* 6.3 Write property test for pipeline synchronization
    - **Property 2: Pipeline Stage Highlighting Synchronization**
    - **Validates: Requirements 2.2**

- [ ] 7. Implement Bytecode Panel
  - [x] 7.1 Create Bytecode Panel HTML structure and CSS
    - Build scrollable panel for bytecode display (35% width, 60% height, center-left position)
    - Style with dark theme consistent with Monaco Editor
    - _Requirements: 3.6_
  
  - [x] 7.2 Implement bytecode rendering with instruction pointer highlighting
    - Write updateBytecodePointer method in AnimationManager
    - Display offset, opname, and arg for each instruction
    - Highlight current instruction with accent color
    - _Requirements: 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 7.3 Write property test for bytecode pointer synchronization
    - **Property 5: Bytecode Pointer Synchronization**
    - **Validates: Requirements 3.4**

- [ ] 8. Implement Stack Panel with frame animations
  - [x] 8.1 Create Stack Panel HTML structure and CSS
    - Build vertically stacked card layout (35% width, 60% height, center-center position)
    - Add CSS transitions for push/pop animations (300ms duration)
    - Style cards with dark theme
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [x] 8.2 Implement stack frame rendering and animations
    - Write updateStackFrames method in AnimationManager
    - Display function name, local variables, and return address for each frame
    - Animate frame push/pop with CSS transitions
    - Position most recent frame at top
    - _Requirements: 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 8.3 Write property tests for stack visualization
    - **Property 6: Stack Frame Display Completeness**
    - **Property 7: Stack Frame Ordering**
    - **Validates: Requirements 4.4, 4.5**

- [ ] 9. Implement Memory Panel with object visualization
  - [x] 9.1 Create Memory Panel HTML structure and CSS
    - Build panel layout for heap objects (30% width, 80% height, right position)
    - Add CSS for object cards and reference arrows
    - Add CSS transitions for object allocation/deallocation (300ms duration)
    - Style with dark theme
    - _Requirements: 5.5, 5.6_
  
  - [x] 9.2 Implement heap object rendering with reference arrows
    - Write updateMemoryObjects method in AnimationManager
    - Display objects (int, str, list, dict) as visual cards
    - Draw SVG arrows from variable names to referenced objects
    - Animate object allocation/deallocation
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ]* 9.3 Write property tests for memory visualization
    - **Property 8: Memory Object Display**
    - **Property 9: Variable Reference Visualization**
    - **Validates: Requirements 5.1, 5.2**

- [ ] 10. Implement GIL Indicator
  - [x] 10.1 Create GIL Indicator HTML structure and CSS
    - Build indicator widget (200px width, 40px height, top-right position)
    - Add color styling for ACQUIRED (green #3fb950) and RELEASED (red #f85149)
    - Add tooltip with GIL explanation
    - _Requirements: 6.1, 6.3, 6.4, 6.6_
  
  - [x] 10.2 Implement GIL status updates
    - Write updateGILStatus method in AnimationManager
    - Display GIL state and thread ID
    - Update color based on state
    - _Requirements: 6.2, 6.5_
  
  - [ ]* 10.3 Write property test for GIL status display
    - **Property 10: GIL Status Display**
    - **Validates: Requirements 6.2, 6.5**

- [x] 11. Checkpoint - Verify all panels render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Implement Control Bar with execution controls
  - [x] 12.1 Create Control Bar HTML structure and CSS
    - Build control bar layout (70% width, 20% height, bottom-center position)
    - Add buttons for Step Forward, Step Back, Auto-play, Reset, Explain
    - Add speed slider (0.5x to 3x range)
    - Style with dark theme and accent color for interactive elements
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1_
  
  - [x] 12.2 Implement ViewController class
    - Create ViewController with stateStore and animationManager
    - Implement onStepForward, onStepBack, onReset methods
    - Implement startAutoPlay and stopAutoPlay with configurable speed
    - Update button disabled states based on canStepForward/canStepBack
    - _Requirements: 8.6, 8.7, 8.8, 8.9_
  
  - [x] 12.3 Implement step explanation feature
    - Add click handler for "Explain this step" button
    - Display tooltip with explanation text from current ExecutionState
    - Include bytecode instruction, stack effects, and memory effects in explanation
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [ ]* 12.4 Write property tests for control interactions
    - **Property 16: Step Explanation Display**
    - **Validates: Requirements 9.2**

- [x] 13. Implement Example Selector
  - [x] 13.1 Create preloaded code examples
    - Define CodeExample objects for: simple arithmetic, recursive fibonacci/factorial, list comprehension
    - Store examples in JavaScript array
    - _Requirements: 10.2, 10.3, 10.4_

  - [x] 13.2 Create Example Selector dropdown and implement selection handler
    - Build dropdown menu with example names
    - Add change event handler that loads example code into Monaco Editor
    - Reset execution state when example is selected
    - _Requirements: 10.1, 10.5, 10.6_
  
  - [ ]* 13.3 Write property test for example loading
    - **Property 18: Example Selection Loads Code and Resets**
    - **Validates: Requirements 10.5, 10.6**

- [x] 14. Implement AnimationManager with synchronized updates
  - [x] 14.1 Create AnimationManager class
    - Initialize with references to all panel DOM elements
    - Implement updateAll method that calls all panel update methods
    - Add performance timing to verify 50ms update budget
    - Log warning if update exceeds 50ms
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
  
  - [ ]* 14.2 Write property test for synchronized updates
    - **Property 19: Synchronized Panel Updates**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5, 11.6**

- [x] 15. Wire all components together and implement application initialization
  - [x] 15.1 Create main initialization function
    - Wait for Monaco Editor and Pyodide to load from CDN
    - Initialize all components (ExecutionEngine, StateStore, ViewController, AnimationManager)
    - Connect event handlers for all controls
    - Load first example by default
    - Handle CDN loading errors with user-friendly message
    - _Requirements: 12.7, 14.5_

  - [x] 15.2 Implement viewport layout with CSS Grid or Flexbox
    - Position all panels according to layout configuration
    - Optimize for 1920×1080 displays
    - Apply consistent borders and spacing
    - _Requirements: 13.3, 13.4, 13.5_

  - [x] 15.3 Add code comments and documentation
    - Document each major component with comments
    - Explain complex algorithms (state capture, bytecode parsing)
    - Use descriptive variable and function names
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [x] 16. Final checkpoint - End-to-end testing
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation is a single HTML file with inline CSS and JavaScript
- All dependencies load from CDN (Monaco Editor, Pyodide)
