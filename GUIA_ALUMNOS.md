# Cómo Python ejecuta tu código — Guía del visualizador

Este visualizador muestra **todo lo que ocurre internamente** cuando Python ejecuta un programa, paso a paso. Cada panel representa una etapa diferente del proceso.

---

## El pipeline de Python

Cuando escribís una línea como `x = 5 + 3`, Python **no la ejecuta directamente**. La hace pasar por varias transformaciones antes de producir un resultado:

```
Código fuente  →  Tokens  →  AST  →  Bytecode  →  PVM (ejecución)
```

El diagrama en la parte superior muestra en qué etapa está Python en cada momento.

---

## Panel de Tokens / Bytecode

### ¿Qué es un Token?

Un **token** es la unidad mínima de significado en el código fuente. El primer trabajo de Python es leer tu texto y dividirlo en piezas reconocibles.

Por ejemplo, `x = 5 + 3` se divide en:

| Token | Tipo |
|-------|------|
| `x` | `NAME` — nombre de variable |
| `=` | `OP` — operador / símbolo |
| `5` | `NUMBER` — número literal |
| `+` | `OP` — operador |
| `3` | `NUMBER` — número literal |

**Tipos de tokens que vas a ver:**

| Color | Tipo | Descripción |
|-------|------|-------------|
| 🔵 Azul | `NAME` | Nombres: variables, funciones, palabras clave (`for`, `if`, `def`, …) |
| 🟢 Verde | `NUMBER` | Números literales: `42`, `3.14` |
| 🟠 Naranja | `STRING` | Cadenas de texto: `"hola"`, `'mundo'` |
| ⚪ Gris | `OP` | Operadores y símbolos: `=`, `+`, `(`, `:` |
| 🔸 Cursiva | `COMMENT` | Comentarios: `# esto es un comentario` |
| Tenue | `NEWLINE` | Fin de línea lógica |
| Tenue | `INDENT` / `DEDENT` | Cambio de indentación (importante en Python) |

> **Clave:** si escribís algo que Python no puede reconocer como token, el intérprete lanza un **SyntaxError** antes de ejecutar cualquier cosa.

---

### ¿Qué es el Bytecode?

Después de tokenizar y parsear el código, Python lo **compila** a bytecode. El bytecode es un conjunto de instrucciones simples para una **máquina virtual** (la PVM — Python Virtual Machine). Es un lenguaje intermedio: no es código fuente legible, pero tampoco es lenguaje de máquina.

Cada instrucción tiene:

- **Offset** — posición de la instrucción en la secuencia (número en gris a la izquierda)
- **Nombre** — qué hace la instrucción (en azul): `LOAD_FAST`, `STORE_NAME`, `BINARY_OP`, etc.
- **Argumento** — con qué dato opera
- **Línea** — a qué línea del código fuente corresponde

**Instrucciones más comunes:**

| Instrucción | Qué hace |
|-------------|----------|
| `LOAD_CONST` | Carga un valor constante (ej: el número `5`) en la pila de evaluación |
| `LOAD_NAME` / `LOAD_FAST` | Carga el valor de una variable |
| `STORE_NAME` / `STORE_FAST` | Guarda un valor en una variable |
| `BINARY_OP` | Realiza una operación aritmética o lógica |
| `CALL` | Llama a una función |
| `RETURN_VALUE` | Devuelve un valor desde una función |
| `POP_TOP` | Descarta el valor en la cima de la pila |
| `GET_ITER` / `FOR_ITER` | Mecanismo interno del `for` |

> La instrucción resaltada en azul es la que **está a punto de ejecutarse** en el paso actual.

---

## Panel del Call Stack (Pila de llamadas)

### ¿Qué es la pila de llamadas?

Cada vez que Python empieza a ejecutar un bloque de código, crea un **frame** (marco). El frame guarda:

- El nombre de la función que se está ejecutando
- Las **variables locales** y sus valores actuales
- La dirección de retorno (a dónde volver cuando la función termine)

Todos los frames activos forman la **call stack** (pila de llamadas). El frame de más arriba es el que se está ejecutando ahora.

```
┌──────────────────────┐  ← frame activo (función actual)
│ calcular_area()      │
│   base = 5           │
│   altura = 3         │
├──────────────────────┤
│ <module>             │  ← frame de nivel superior
│   resultado = ...    │
└──────────────────────┘
```

**¿Qué observar?**

- Las variables locales **aparecen y desaparecen** a medida que se crean y el frame se elimina
- Cuando llamás a una función, se **apila** un nuevo frame encima
- Cuando la función termina (`return`), el frame se **desapila** y el programa continúa donde lo dejó
- Si llamás demasiadas funciones sin retornar, obtenés un **RecursionError** (la pila se llena)

---

## Panel de Memoria (Heap)

### ¿Qué es el Heap?

En Python, **todos los objetos viven en el heap** (montículo de memoria). Cuando escribís `x = [1, 2, 3]`, la lista no se guarda "dentro" de la variable — la variable `x` es solo una **referencia** (flecha) que apunta al objeto lista que está en el heap.

Cada tarjeta en este panel representa un objeto en memoria y muestra:

- **Tipo** — `int`, `str`, `list`, `dict`, `function`, etc.
- **ID del objeto** — su dirección única en memoria
- **Valor** — el contenido actual del objeto
- **Ref Count** — contador de referencias

### ¿Qué es el Ref Count (contador de referencias)?

Python usa **conteo de referencias** como su mecanismo principal de gestión de memoria. Cada objeto sabe cuántas variables (u otros objetos) están apuntando a él.

```python
x = [1, 2, 3]   # Ref count de la lista: 1
y = x            # Ref count de la lista: 2
del x            # Ref count de la lista: 1
del y            # Ref count de la lista: 0 → Python libera la memoria
```

> Cuando el **Ref Count llega a 0**, el **Garbage Collector** de Python libera ese objeto de la memoria automáticamente.

---

## El indicador del GIL

El **GIL** (Global Interpreter Lock — Candado Global del Intérprete) es un mutex que garantiza que **solo un hilo de Python puede ejecutar bytecode a la vez**, incluso en computadoras con múltiples núcleos.

- 🟢 **ACQUIRED** — el hilo actual tiene el GIL y está ejecutando código Python
- 🔴 **RELEASED** — el GIL fue liberado (ocurre durante operaciones de I/O o llamadas a código C)

> El GIL es una de las características más discutidas de CPython. Simplifica la gestión de memoria, pero limita el paralelismo real en programas con muchos hilos.

---

## Los botones de control

| Botón | Función |
|-------|---------|
| ▶ **Ejecutar** | Compila y captura todos los pasos de ejecución |
| **⟩ Step Forward** | Avanza un paso y actualiza todos los paneles |
| **⟨ Step Back** | Retrocede un paso |
| **▶▶ Auto-play** | Reproduce los pasos automáticamente |
| **↺ Reset** | Vuelve al primer paso |
| **💡 Explain** | Muestra una explicación del paso actual |
| **Velocidad** | Controla qué tan rápido corre el auto-play |

---

## Ejemplo: recorriendo un `for`

```python
numeros = [10, 20, 30]
for n in numeros:
    resultado = n * 2
```

Al ejecutar esto, observá:

1. **Tokens:** `for`, `n`, `in`, `numeros`, `:` aparecen cada uno como un token separado
2. **Bytecode:** verás instrucciones `GET_ITER` → `FOR_ITER` → `STORE_NAME` → `BINARY_OP` repetidas por cada iteración
3. **Stack:** la variable `n` cambia de valor en cada paso (`10` → `20` → `30`)
4. **Heap:** la lista `[10, 20, 30]` existe como un objeto con Ref Count ≥ 1 mientras `numeros` la referencia

---

## Glosario rápido

| Término | Definición |
|---------|-----------|
| **Token** | Unidad léxica mínima del código fuente |
| **AST** | Árbol de Sintaxis Abstracta — representación estructurada del código |
| **Bytecode** | Código intermedio que ejecuta la PVM |
| **PVM** | Python Virtual Machine — el motor que interpreta el bytecode |
| **Frame** | Entorno de ejecución de una función (variables locales + estado) |
| **Call Stack** | Pila de todos los frames activos |
| **Heap** | Zona de memoria donde viven los objetos Python |
| **Ref Count** | Cantidad de referencias que apuntan a un objeto |
| **GIL** | Candado que permite ejecutar solo un hilo Python a la vez |
| **Garbage Collector** | Mecanismo que libera objetos con Ref Count = 0 |
