# @lorequary/parser — Expression Language Design Spec

> Reference document for guiding parser implementation. Not a teaching doc.

## 1. Overview

`@lorequary/parser` is a standalone package in the lorequary monorepo (`packages/parser`). It provides parsing, validation, and evaluation of a small expression language used in game dialogue systems. Both the Lorequary editor and the Order of Lust game runtime consume it as a dependency.

The language has two strict modes:
- **Conditions**: pure boolean checks, no side effects.
- **Effects**: pure mutations (assignments), no control flow.

No control flow, no variable declarations, no loops, no user-defined functions. All branching is handled by the dialogue graph, not the expression language.

## 2. Expression Language

### 2.1 Conditions

A condition is an expression that evaluates to a boolean.

```
hero.money > 50
hero.skills.rhetoric >= 4 || hero.skills.empathy >= 3
(hero.origin == "noble" && game.difficulty != "hardcore") || hero.money >= 1000
npc.aurelia.attitude > seenCount() * 2
!quest.baron_alive
```

Bare path shorthand: `quest.baron_alive` equals `quest.baron_alive == true`.

### 2.2 Effects

An effect is a single assignment statement. Left side is always a path. Right side is an arithmetic expression.

```
hero.money += 100
hero.xp = 0
npc.aurelia.attitude -= 1
hero.money *= 2
hero.money /= random(1, 4)
```

Assignment operators: `=`, `+=`, `-=`, `*=`, `/=`.

### 2.3 Paths

Dot-separated identifiers. The parser treats them as opaque strings — no structural knowledge of namespaces or entity types. Validation checks paths against a variable registry.

```
hero.money
hero.skills.rhetoric
npc.aurelia.attitude
game.difficulty
quest.baron_alive
```

Path segments: `[a-zA-Z_][a-zA-Z0-9_]*` separated by `.`.

### 2.4 Literals

| Type    | Examples              | Notes                          |
|---------|-----------------------|--------------------------------|
| Number  | `50`, `3.5`           | Integer and float. Negative numbers are unary `-` + number. |
| String  | `"noble"`, `"hardcore"` | Double-quoted only             |
| Boolean | `true`, `false`       | Keywords                       |

### 2.5 Operators

#### Comparison
`==`, `!=`, `>`, `<`, `>=`, `<=`

#### Logical
`&&`, `||`, `!`

#### Arithmetic (in expressions)
`+`, `-` (binary), `*`, `/`

#### Unary
`!` (logical negation), `-` (numeric negation)

#### Assignment (effects only)
`=`, `+=`, `-=`, `*=`, `/=`

#### Grouping
`(`, `)`

### 2.6 Operator Precedence (lowest to highest)

| Level | Operators              | Associativity |
|-------|------------------------|---------------|
| 1     | `\|\|`                 | Left          |
| 2     | `&&`                   | Left          |
| 3     | `==`, `!=`             | Left          |
| 4     | `<`, `>`, `<=`, `>=`   | Left          |
| 5     | `+`, `-` (binary)      | Left          |
| 6     | `*`, `/`               | Left          |
| 7     | `!`, `-` (unary)       | Right (prefix)|
| 8     | Function calls, literals, paths, `()` groups | — |

### 2.7 Built-in Functions

Functions use plain `name(args)` syntax in the language. No `$` prefix — the editor may add visual decorators (`$`, `@`) in its rendering layer, but those are not part of the grammar.

#### `random`
- `random(max)` — random integer in `[1, max]`
- `random(min, max)` — random integer in `[min, max]`
- Returns: `number`
- Usable in conditions and effect right-hand sides.

#### `seenCount`
- `seenCount()` — no arguments, refers to current node
- Returns: `number` (visit count)
- Value provided by consumer via `Context.seenCount`. The evaluator reads it; it does not track state.

#### Extensibility
The parser recognizes function calls generically — any `identifier(args)` is parsed as a `FunctionCall` node. The validator checks against a function registry. The evaluator dispatches through a handler map. Adding a new built-in requires only a registry entry and a handler — no parser changes.

Consumers can register custom functions for game-specific needs.

## 3. AST Node Types

Every node has a `type` string discriminator.

### 3.1 Expression Nodes

| Node           | Fields                        | Description                              |
|----------------|-------------------------------|------------------------------------------|
| `BinaryExpr`   | `op`, `left`, `right`         | Arithmetic, comparison, or logical       |
| `UnaryExpr`    | `op`, `operand`               | `!` (negation) or `-` (numeric negative) |
| `Literal`      | `value: number\|string\|boolean` | Constant value                        |
| `Path`         | `value: string`               | Dot-separated variable path              |
| `FunctionCall` | `name: string`, `args: Expr[]`| Built-in or custom function              |
| `Group`        | `expression: Expr`            | Parenthesized sub-expression             |

### 3.2 Statement Nodes

| Node         | Fields                    | Description                 |
|--------------|---------------------------|-----------------------------|
| `Assignment` | `path: Path`, `op`, `expr`| Mutation statement          |

### 3.3 Top-level Nodes

| Node        | Wraps         | Description                 |
|-------------|---------------|-----------------------------|
| `Condition` | `expression`  | Boolean check entry point   |
| `Effect`    | `assignment`  | Mutation entry point        |

### 3.4 Example ASTs

`hero.money > 50 && npc.aurelia.attitude >= 5`:
```
Condition
  BinaryExpr(&&)
    BinaryExpr(>)
      Path("hero.money")
      Literal(50)
    BinaryExpr(>=)
      Path("npc.aurelia.attitude")
      Literal(5)
```

`hero.money += random(10, 50)`:
```
Effect
  Assignment(+=)
    Path("hero.money")
    FunctionCall("random")
      Literal(10)
      Literal(50)
```

`!quest.baron_alive`:
```
Condition
  UnaryExpr(!)
    Path("quest.baron_alive")
```

`(hero.skills.rhetoric >= 4 || hero.skills.empathy >= 3) && hero.money > 100`:
```
Condition
  BinaryExpr(&&)
    Group
      BinaryExpr(||)
        BinaryExpr(>=)
          Path("hero.skills.rhetoric")
          Literal(4)
        BinaryExpr(>=)
          Path("hero.skills.empathy")
          Literal(3)
    BinaryExpr(>)
      Path("hero.money")
      Literal(100)
```

## 4. Public API

### 4.1 Result Type

All fallible operations return `Result<T, E>` instead of throwing. Errors are data, not exceptions.

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
```

### 4.2 Parsing

```ts
parseCondition(source: string): Result<ConditionNode, ParseError>
parseEffect(source: string):    Result<EffectNode, ParseError>
```

Two entry points enforce condition/effect separation at the grammar level.

### 4.3 Validation

```ts
type VariableSchema = Record<string, {
  type: 'number' | 'string' | 'boolean';
}>;

validate(node: ConditionNode | EffectNode, schema: VariableSchema): ValidationError[]
```

Returns an array — empty means valid. Multiple errors can be reported in one pass.

### 4.4 Evaluation

```ts
type Resolver = (path: string) => unknown;
type FunctionHandler = (args: unknown[]) => unknown;

type Context = {
  resolve: Resolver;
  seenCount: number;
  functions?: Record<string, FunctionHandler>;
};

evaluateCondition(node: ConditionNode, context: Context | Record<string, unknown>): Result<boolean, EvalError>
evaluateEffect(node: EffectNode, context: Context | Record<string, unknown>):       Result<EffectResult, EvalError>
```

When a plain `Record<string, unknown>` is passed, the evaluator wraps it in a default resolver that walks nested properties by dot path. `seenCount` defaults to `0` in this case.

### 4.5 Effect Result

```ts
interface EffectResult {
  path: string;       // e.g., "hero.money"
  value: unknown;     // the computed new value
}
```

The evaluator computes the new value but does not mutate state. The consumer decides what to do with the result.

## 5. Error Types

All errors share a `kind` discriminator for uniform handling.

### 5.1 ParseError

```ts
interface ParseError {
  kind: 'parse';
  message: string;
  offset: number;       // character offset from start
  line: number;
  column: number;
}
```

Produced when the input is not valid grammar.

Examples:
- `hero.money >` — "Expected expression after `>`"
- `hero.money >> 5` — "Unexpected token `>`"
- `"unterminated` — "Unterminated string literal"

### 5.2 ValidationError

```ts
interface ValidationError {
  kind: 'validation';
  message: string;
  path?: string;
  node: ASTNode;
}
```

Produced when the AST references unknown variables, type-mismatches, or unknown functions.

Examples:
- `hero.moneyyy > 50` — "Unknown variable `hero.moneyyy`"
- `hero.money == "noble"` — "Cannot compare number with string"
- `unknown_func(1)` — "Unknown function `unknown_func`"

### 5.3 EvalError

```ts
interface EvalError {
  kind: 'eval';
  message: string;
  node: ASTNode;
}
```

Produced at runtime when evaluation fails.

Examples:
- `hero.money / 0` — "Division by zero"
- `random(5, 1)` — "`random`: min must be less than max"
- Resolver returns `undefined` — "Variable `hero.money` has no value"

## 6. Storage and Integration

### 6.1 Document Format

Expressions are stored as plain strings in `.lorequary` JSON files:

```json
{
  "conditions": ["hero.money > 50 && npc.aurelia.attitude >= 5"],
  "effects": ["hero.money += 100"]
}
```

No compiled/pre-parsed form. Both the editor and the game parse strings at load time.

### 6.2 Editor Integration

- Parse on every keystroke for real-time validation and error highlighting.
- Editor may render visual decorators (`@` for variable links, `$` for function calls) — these are display-layer only, not stored.
- Autocomplete powered by the variable registry (same `VariableSchema` used for validation).
- The editor UI composes multiple conditions visually (AND/OR at the node/edge level). Individual condition strings stay simple.

### 6.3 Game Integration

- Game loads `.lorequary` JSON, parses condition/effect strings with the parser.
- Provides a `Resolver` function that maps paths to game state values.
- Provides `seenCount` from its own visit tracking.
- Can register custom `FunctionHandler` entries for game-specific built-ins.
- Receives `EffectResult` and applies mutations to game state however it wants.

## 7. Package Structure

```
packages/parser/
  src/
    result.ts         — Result<T, E> type
    errors.ts         — ParseError, ValidationError, EvalError
    tokens.ts         — TokenType enum and Token interface
    lexer.ts          — tokenize(source) → Result<Token[], ParseError>
    ast.ts            — AST node type definitions
    parser.ts         — recursive descent parser
    validate.ts       — AST validation against schema + function registry
    evaluate.ts       — AST tree-walking evaluator
    functions.ts      — built-in function registry and handlers
    index.ts          — public API exports
  tests/
    lexer.test.ts
    parser.test.ts
    validate.test.ts
    evaluate.test.ts
```

## 8. Implementation Order

Each part builds on the previous. Designed for incremental learning:

1. **Result type + Error types** — `result.ts`, `errors.ts`
2. **Token types** — `tokens.ts`
3. **Lexer** — `lexer.ts` + `lexer.test.ts`
4. **AST types** — `ast.ts`
5. **Parser** (broken into sub-steps):
   - 5a. Literals and paths
   - 5b. Function calls
   - 5c. Unary operators (`!`, `-`)
   - 5d. Multiplicative (`*`, `/`)
   - 5e. Additive (`+`, `-`)
   - 5f. Comparison (`==`, `!=`, `>`, `<`, `>=`, `<=`)
   - 5g. Logical (`&&`, `||`)
   - 5h. Grouped expressions (parentheses)
   - 5i. Assignments (effects)
   - 5j. Entry points (`parseCondition`, `parseEffect`)
6. **Validator** — `validate.ts` + `validate.test.ts`
7. **Evaluator** — `evaluate.ts` + `evaluate.test.ts`
8. **Public API** — `index.ts`, wire everything together

## 9. Formal Grammar (EBNF)

For parser implementation reference.

```ebnf
(* Entry points *)
condition     = expression ;
effect        = path assign_op expression ;

(* Assignment operators — effects only *)
assign_op     = "=" | "+=" | "-=" | "*=" | "/=" ;

(* Expressions — precedence climbing *)
expression    = logic_or ;

logic_or      = logic_and ( "||" logic_and )* ;
logic_and     = equality ( "&&" equality )* ;
equality      = comparison ( ( "==" | "!=" ) comparison )* ;
comparison    = addition ( ( "<" | ">" | "<=" | ">=" ) addition )* ;
addition      = multiplication ( ( "+" | "-" ) multiplication )* ;
multiplication = unary ( ( "*" | "/" ) unary )* ;

unary         = ( "!" | "-" ) unary | call ;
call          = IDENTIFIER "(" [ expression ( "," expression )* ] ")"
              | primary ;

primary       = NUMBER
              | STRING
              | "true" | "false"
              | path
              | "(" expression ")" ;

path          = IDENTIFIER ( "." IDENTIFIER )* ;

(* Terminals *)
IDENTIFIER    = [a-zA-Z_] [a-zA-Z0-9_]* ;
NUMBER        = [0-9]+ ( "." [0-9]+ )? ;
STRING        = '"' ( [^"\\] | '\\' . )* '"' ;
```

Note: `path` and `call` share the `IDENTIFIER` prefix. The parser disambiguates by lookahead: if `IDENTIFIER` is followed by `(`, it's a function call; if followed by `.` or anything else, it's a path.

## 10. Design Decisions Log

| Decision | Chosen | Alternatives considered | Rationale |
|----------|--------|------------------------|-----------|
| Package placement | Separate `packages/parser` | In `core`, separate repo | Game may need parser without full core schema. Same monorepo for dev convenience. |
| Variable paths | Opaque dot-notation strings | Structured namespace/entity model | Parser shouldn't encode domain knowledge. Validation against registry handles correctness. |
| Expression storage | Raw strings in JSON | Pre-compiled AST, intermediate compact format | Strings are compact, readable, diffable. Parse cost is trivial. No compile step needed. |
| Control flow | None in expressions | If/then/else in expressions | Dialogue graph IS the control flow. Expression language stays pure. |
| Condition composition | At the data structure level (editor composes AND/OR) | In the expression language | Visual editor should own visual composition. Individual expressions stay simple. Parser still supports `&&`/`||` for power users and game-side evaluation. |
| Error handling | Result<T, E> pattern | Thrown exceptions | Errors are expected (keystroke parsing). Must be typed. No try/catch ceremony. |
| Effect evaluation | Returns EffectResult, no mutation | Evaluator mutates via assign callback | Consumer controls state. No side effects. Cleaner contract. |
| Function syntax | Plain `name(args)` | `$name(args)` prefix | `$`/`@` are editor display decorators, not language syntax. Parser stays minimal. |
| Assignment operators | `=`, `+=`, `-=`, `*=`, `/=` | Single-char `+`, `-` | Industry standard (Ink, Yarn, Ren'Py, articy). Unambiguous. |
| Parser implementation | Hand-rolled recursive descent | Parser combinators (chevrotain), PEG generators (peggy) | Language is small. Full control over error messages. Zero dependencies. |
| Built-in functions | Extensible registry, ship with `random` and `seenCount` | Hardcoded in parser | New functions = registry entry + handler. No parser changes. |
