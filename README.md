# Python Execution Visualizer

Interactive visualization of Python code execution through the CPython pipeline.

## Project Structure

```
.
├── index.html                 # Main HTML file (clean, with references)
├── src/
│   ├── scripts/              # JavaScript modules
│   │   ├── data-models.js    # Data model classes (ExecutionState, BytecodeInstruction, etc.)
│   │   ├── state-store.js    # State management (StateStore class)
│   │   ├── execution-engine.js # Python execution engine (ExecutionEngine class)
│   │   ├── animation-manager.js # UI animation coordinator (AnimationManager class)
│   │   ├── property-tests.js # Property-based tests using fast-check
│   │   └── app-init.js       # Application initialization logic
│   └── styles/
│       └── main.css          # All application styles
├── tests/                    # Test files and task summaries
│   ├── TASK-*.md            # Implementation summaries
│   ├── test-*.html          # Integration and visual tests
│   └── verify-*.js          # Unit test scripts
└── .kiro/specs/             # Specification files
    └── python-execution-visualizer/
        ├── requirements.md
        ├── design.md
        └── tasks.md
```

## Features

- **Monaco Editor Integration**: Syntax-highlighted Python code editor with line highlighting
- **Pipeline Visualization**: Six-stage CPython pipeline (Source → Tokenizer → Parser → Compiler → Bytecode → PVM)
- **Bytecode Panel**: Displays compiled Python bytecode instructions with instruction pointer
- **Call Stack Panel**: Visualizes function call stack with local variables and return addresses
- **Execution State Management**: Step forward/backward through execution states
- **Dark Theme**: GitHub-inspired dark theme (#0d1117 background, #58a6ff accent)

## Dependencies (CDN)

- **Monaco Editor** v0.45.0 - Code editor
- **Pyodide** v0.24.1 - Python runtime in browser
- **fast-check** v3.15.0 - Property-based testing

## Running the Application

Simply open `index.html` in a modern web browser. All dependencies load from CDN.

```bash
# Using Python's built-in server
python -m http.server 8000

# Or using Node.js http-server
npx http-server
```

Then navigate to `http://localhost:8000`

## Development

### File Organization

- **index.html**: Main entry point, contains only HTML structure and script references
- **src/scripts/**: Modular JavaScript files, each containing a specific component
- **src/styles/**: CSS files with organized sections
- **tests/**: All test files and implementation documentation

### Testing

Open any test file in `tests/` directory in a browser to run tests:

- `test-task-*.html` - Integration tests for specific tasks
- `verify-*.js` - Unit tests (run with Node.js)
- Property-based tests run automatically on application load

## Implementation Status

✅ Task 1: HTML structure and CDN dependencies
✅ Task 2: Core data models and state management  
✅ Task 3: Execution engine with Pyodide integration
✅ Task 4: Checkpoint - Execution engine verified
✅ Task 5: Monaco Editor integration
✅ Task 6: Pipeline diagram visualization
✅ Task 7: Bytecode panel
✅ Task 8.1: Stack panel HTML/CSS
✅ Task 8.2: Stack frame rendering and animations

🚧 In Progress: Memory panel, GIL indicator, control bar, example selector

## Requirements

- Modern web browser with ES6+ support
- Internet connection (for CDN dependencies)

## License

Educational project for Python execution visualization.
