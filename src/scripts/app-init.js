// Global error handler for CDN loading failures
        window.addEventListener('error', function(event) {
            if (event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK') {
                showError('CDN Resource Failed to Load',
                    `Failed to load: ${event.target.src || event.target.href}\n\nThis may be due to network issues or CDN unavailability.`);
            }
        }, true);

        // Update loading status
        function updateLoadingStatus(message) {
            const statusElement = document.getElementById('loading-status');
            if (statusElement) {
                statusElement.textContent = message;
            }
        }

        // Show error screen
        function showError(title, message, details = '') {
            const loadingScreen = document.getElementById('loading-screen');
            const errorScreen = document.getElementById('error-screen');
            const errorMessage = document.getElementById('error-message');
            const errorDetails = document.getElementById('error-details');

            if (loadingScreen) loadingScreen.style.display = 'none';
            if (errorScreen) {
                errorScreen.style.display = 'flex';
                if (title) {
                    errorScreen.querySelector('h2').textContent = title;
                }
            }
            if (errorMessage) errorMessage.textContent = message;
            if (errorDetails && details) {
                errorDetails.textContent = details;
                errorDetails.style.display = 'block';
            }
        }

        // Initialize application after all dependencies load
        async function initializeApp() {
            try {
                // ── Step 1: Start Pyodide Worker AND load Monaco in parallel ─────────────
                // Pyodide runs in a Web Worker so it never blocks the main UI thread.
                // Monaco can now load simultaneously (no more AMD/UMD conflict, since
                // Pyodide is isolated in its own Worker context).
                updateLoadingStatus('Cargando dependencias...');

                // --- 1a: Start the Pyodide Web Worker ---
                const workerReadyPromise = new Promise((resolve, reject) => {
                    const worker = new Worker('src/scripts/pyodide-worker.js');
                    worker.onmessage = function(event) {
                        if (event.data.type === 'ready') {
                            resolve(worker);
                        } else if (event.data.type === 'init_error') {
                            reject(new Error('Pyodide Worker failed: ' + event.data.error));
                        }
                    };
                    worker.onerror = function(event) {
                        reject(new Error('Worker error: ' + (event.message || 'Unknown error')));
                    };
                });

                // --- 1b: Load Monaco AMD loader dynamically ---
                const monacoReadyPromise = new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/monaco-editor@0.45.0/min/vs/loader.js';
                    script.onload = () => {
                        if (typeof require === 'undefined') {
                            reject(new Error('Monaco AMD loader failed to initialize'));
                            return;
                        }
                        require.config({
                            paths: { 'vs': 'https://unpkg.com/monaco-editor@0.45.0/min/vs' }
                        });
                        require(['vs/editor/editor.main'], function() {
                            if (typeof monaco === 'undefined') {
                                reject(new Error('Monaco Editor failed to initialize'));
                            } else {
                                resolve();
                            }
                        }, function(err) {
                            reject(new Error('Monaco loading error: ' + (err.message || 'Unknown error')));
                        });
                    };
                    script.onerror = () => reject(new Error('Monaco Editor loader failed to load from CDN'));
                    document.head.appendChild(script);
                });

                // Wait for both to be ready in parallel
                updateLoadingStatus('Cargando Pyodide (worker) y Monaco Editor...');
                const [worker] = await Promise.all([workerReadyPromise, monacoReadyPromise]);

                updateLoadingStatus('Inicializando aplicación...');

                // ── Step 2: Initialize Monaco Editor ────────────────────────────────────
                const monacoContainer = document.getElementById('monaco-container');
                if (!monacoContainer) {
                    throw new Error('Monaco container element not found');
                }

                const editor = monaco.editor.create(monacoContainer, {
                    value: '# Escribe tu código Python aquí\n',
                    language: 'python',
                    theme: 'vs-dark',
                    automaticLayout: true,
                    fontSize: 14,
                    lineNumbers: 'on',
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    tabSize: 4,
                    insertSpaces: true,
                    renderWhitespace: 'selection',
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                    backgroundColor: '#0d1117'
                });

                window.monacoEditor = editor;
                console.log('Monaco Editor initialized successfully');

                // ── Step 3: Initialize application components ────────────────────────────
                const pipelineDiagram = document.getElementById('pipeline-diagram');
                const bytecodePanel  = document.getElementById('bytecode-panel');
                const stackPanel     = document.getElementById('stack-panel');
                const memoryPanel    = document.getElementById('memory-panel');
                const gilIndicator   = document.getElementById('gil-indicator');

                const animationManager = new AnimationManager({
                    monacoEditor: editor,
                    pipelineDiagram,
                    bytecodePanel,
                    stackPanel,
                    memoryPanel,
                    gilIndicator
                });
                window.animationManager = animationManager;
                console.log('AnimationManager initialized successfully');

                const stateStore = new StateStore();
                window.stateStore = stateStore;
                console.log('StateStore initialized successfully');

                const viewController = new ViewController(stateStore, animationManager);
                window.viewController = viewController;
                console.log('ViewController initialized successfully');

                // ExecutionEngine now takes the Worker instead of a pyodide instance
                const executionEngine = new ExecutionEngine(worker);
                window.executionEngine = executionEngine;
                console.log('ExecutionEngine initialized successfully');

                // Wire up bytecode/token tab buttons
                const tabBytecode = document.getElementById('tab-bytecode');
                const tabTokens = document.getElementById('tab-tokens');
                if (tabBytecode) tabBytecode.addEventListener('click', () => animationManager.switchTab('bytecode'));
                if (tabTokens)   tabTokens.addEventListener('click',   () => animationManager.switchTab('tokens'));

                // ── Step 4: Populate Example Selector ───────────────────────────────────
                const exampleSelector = document.getElementById('example-selector');
                if (exampleSelector && typeof CODE_EXAMPLES !== 'undefined') {
                    CODE_EXAMPLES.forEach((example, index) => {
                        const option = document.createElement('option');
                        option.value = index;
                        option.textContent = example.name;
                        option.title = example.description;
                        exampleSelector.appendChild(option);
                    });

                    exampleSelector.addEventListener('change', () => {
                        const selectedIndex = exampleSelector.value;
                        if (selectedIndex === '') return;

                        const example = CODE_EXAMPLES[parseInt(selectedIndex, 10)];
                        if (!example) return;

                        editor.setValue(example.code);
                        stateStore.reset();
                        stateStore.setStates([]);
                        viewController.updateButtonStates();
                        setRunStatus('hidden', '');
                        console.log(`Loaded example: ${example.name}`);
                    });
                }

                // ── Step 5: Wire up Run button ───────────────────────────────────────────
                const btnRun   = document.getElementById('btn-run');
                const runStatus = document.getElementById('run-status');

                function setRunStatus(type, message) {
                    if (!runStatus) return;
                    runStatus.className = 'run-status';
                    if (type === 'hidden') {
                        runStatus.classList.add('hidden');
                        runStatus.textContent = '';
                    } else {
                        runStatus.classList.add(`status-${type}`);
                        runStatus.textContent = message;
                    }
                }

                if (btnRun) {
                    btnRun.addEventListener('click', async () => {
                        const sourceCode = editor.getValue();

                        if (!sourceCode.trim()) {
                            setRunStatus('error', 'Por favor escribe código Python antes de ejecutar.');
                            return;
                        }

                        btnRun.disabled = true;
                        btnRun.classList.add('running');
                        const runIcon = btnRun.querySelector('.run-btn-icon');
                        if (runIcon) runIcon.textContent = '⏳';
                        setRunStatus('loading', 'Compilando y ejecutando código Python...');

                        if (viewController.isPlaying) {
                            viewController.stopAutoPlay();
                        }

                        try {
                            const compileResult = await executionEngine.compile(sourceCode);
                            if (!compileResult.success) {
                                setRunStatus('error', compileResult.error);
                                return;
                            }

                            setRunStatus('loading', 'Capturando estados de ejecución...');

                            const states = await executionEngine.captureStates(sourceCode);

                            if (states.length === 0) {
                                setRunStatus('error', 'No se capturaron pasos de ejecución. El código puede no tener instrucciones ejecutables.');
                                return;
                            }

                            stateStore.setStates(states);
                            stateStore.reset();

                            const initialState = stateStore.getCurrentState();
                            if (initialState) {
                                animationManager.updateAll(initialState);
                            }

                            viewController.updateButtonStates();

                            // Fetch tokens and populate the Tokens tab (non-blocking)
                            executionEngine.getTokens(sourceCode).then(tokens => {
                                animationManager.setTokens(tokens);
                            });

                            setRunStatus('success', `Listo: ${states.length} pasos de ejecución capturados. Usa Paso Adelante / Reproducir para explorar.`);
                            console.log(`Execution complete: ${states.length} steps captured`);

                        } catch (error) {
                            console.error('Run error:', error);
                            setRunStatus('error', `Error de ejecución: ${error.message || 'Ocurrió un error inesperado.'}`);
                        } finally {
                            btnRun.disabled = false;
                            btnRun.classList.remove('running');
                            if (runIcon) runIcon.textContent = '▶';
                        }
                    });
                }

                // Load the first example by default
                if (typeof CODE_EXAMPLES !== 'undefined' && CODE_EXAMPLES.length > 0) {
                    editor.setValue(CODE_EXAMPLES[0].code);
                    if (exampleSelector) exampleSelector.value = '0';
                    console.log(`Default example loaded: ${CODE_EXAMPLES[0].name}`);
                }

                // Run property-based tests
                console.log('='.repeat(80));
                console.log('PROPERTY-BASED TESTS');
                console.log('='.repeat(80));
                const testResults = PropertyTests.runAll();
                console.log('='.repeat(80));
                console.log('Test Results:', testResults);
                console.log('='.repeat(80));

                // Show the app
                document.getElementById('loading-screen').style.display = 'none';
                document.getElementById('app').style.display = 'block';

                console.log('Application initialized successfully');
                console.log('Monaco Editor version:', monaco.version);

            } catch (error) {
                console.error('Initialization error:', error);
                showError(
                    'Error de Inicialización',
                    error.message || 'Ocurrió un error inesperado durante la inicialización.',
                    error.stack || ''
                );
            }
        }

        // Start initialization when page loads
        window.addEventListener('load', function() {
            setTimeout(initializeApp, 100);
        });
