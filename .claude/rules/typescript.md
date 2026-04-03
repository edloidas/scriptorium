---
paths:
  - '**/*.{ts,tsx}'
---

# TypeScript Coding Standards

## Code Style

```typescript
// ✅ Spaces inside `{}` in imports, types, objects, and destructuring
import {useState, useEffect} from 'react';
const {signal} = new AbortController();

// ✅ Prefer single quotes
import {atom} from 'nanostores';
const label = `Time: ${Date.now()}`; // Template literals are fine

// ✅ Prefer const over let if variable won't change
const max = 100;

// ✅ Check for both null and undefined with `!= null`
if (response != null) {
  // safe to use response
}

// ❌ No nested ternaries - use if/else or object lookup
const status = isLoading ? 'loading' : isError ? 'error' : 'idle'; // Bad

// ✅ Good alternatives
const status = getStatus(); // Extract to function with if/else, switch/case or object lookup

// ✅ Leverage modern TypeScript syntax
const len = items?.length ?? 0;
settings.debug ||= false;
cache?.clear();
const size = 1_000;

// ✅ Prefer destructuring assignment
const [body, headers = {}] = request;

// ✅ Prefer single-line guard clauses (early return)
if (element == null) return;
if (!isSupported) return false;

// ❌ Do not wrap single-statement guard clauses in braces
if (data == null) {
  return;
}

// ✅ Insert exactly one blank line between logically distinct operations
const result = doSomething();

updateAnotherThing();

// ✅ End every source file with a single trailing newline
```

## Naming Standards

```typescript
// ✅ All stores must start with `$` sign
export const $counter = atom(0);

// ✅ Standalone booleans use `is`/`has`/`can`/`should`/`will` prefixes
const isEnabled = true;
const hasFocus = false;
const canEdit = permissions.includes('edit');

// ✅ Object props and React props: drop prefixes for boolean props
type ButtonProps = {
  disabled?: boolean; // Not 'isDisabled'
  loading?: boolean; // Not 'isLoading'
  active?: boolean; // Not 'isActive'
  onClick?: () => void; // Event handlers use 'on' prefix
};

// ✅ Internal handlers use 'handle' prefix
const handleClick = () => {
  onClick?.();
};

// ✅ Arrays use plural forms
const users: User[] = [];
const selectedIds: string[] = [];

// ✅ Functions use verb prefixes
function getUserById(id: string) {} // get/fetch/load/parse
function setUserName(name: string) {} // set/update/save/calc/compute
function isValidEmail(email: string) {} // is/has for boolean returns

// ✅ Name constants using UPPERCASE and underscore
const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;

// ✅ Add trailing comma in multi-line arguments, arrays, objects
function add(first: number, second: number): number {
  // ...
}
```

## Type Definitions

```typescript
// ✅ Prefer types for object shapes
type User = {
  id: string;
  name: string;
};

// ✅ Use type aliases for unions/primitives
type UserStatus = 'active' | 'inactive' | 'pending';

// ✅ Use T[] syntax for arrays
type Users = User[];
const items: string[] = [];

// ❌ Avoid any type — use unknown with type guards
const data: unknown = fetchData();
if (isUser(data)) {
  // TypeScript knows data is User here
}

// ❌ Avoid type assertions with 'as' - use type guards or proper typing
const user = {} as User; // Bad
if (event.target instanceof HTMLInputElement) {
  /* use target */
} // Good

// ❌ Avoid non-null assertion '!' - use optional chaining or guards
const value = getUserInput() ?? defaultValue;
if (!input) return;

// ✅ Use `satisfies` for precise literal types without widening
const options = {
  retry: 3,
  timeout: 5000,
} satisfies RequestOptions;

// ✅ Define and use `Maybe<T>` for nullish values
type Maybe<T> = T | null | undefined;
function findUser(id: string): Maybe<User> {
  /* ... */
}

// ✅ Prefer `undefined` over `null` for unset values (refs are the exception)
const [activeId, setActiveId] = useState<string | undefined>(undefined);
const ref = useRef<HTMLDivElement | null>(null); // refs use null by convention
```

- Prefer one file per type
- Define types in the same file if one type is used inside another
- Do not place types in the same file as store definitions, except the store's own type

## Type Composition

```typescript
// ✅ Prefer composition: define base "own" types, then extend
type ButtonOwnProps = {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
} & ComponentPropsWithoutRef<'button'>;

// ✅ Single-level Omit is fine; avoid nested Omit gymnastics
type PublicProps = Omit<FullProps, keyof InjectedDeps>;

// ❌ Avoid nested Omit — restructure types instead
type BadProps = Omit<PrimitiveProps, keyof Omit<ContextOps, 'setOpen'>>; // Bad
```

## Function Signatures

```typescript
// ✅ Explicit return types for exported functions
export function calculateTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Arrow functions for one-line helpers
const isEven = (value: number): boolean => value % 2 === 0;

// ✅ Use generic constraints
function updateEntity<T extends {id: string}>(entity: T, updates: Partial<T>): T {
  return {...entity, ...updates};
}
```

## Error Handling

```typescript
// ✅ Use Result pattern for operations that can fail
async function parse(data: string): Promise<Result<User>> {
  return Result.tryCatch((): unknown => JSON.parse(data));
}
```

## Import/Export Standards

```typescript
// ✅ Named exports preferred; no default exports from component files
export {UserService, ProductService};

// ✅ Group imports: external → internal → types
import React, {useState, useEffect} from 'react';

import {UserService} from '@/services/UserService';

import type {User} from '@/types';

// ✅ Use @/ alias for imports outside the current directory
import {MyComponent} from '@/components/MyComponent';

// ✅ Use relative paths only for imports from the same directory
import {helper} from './helper';
```
