---
paths:
  - '**/*.tsx'
---

# React Component Standards

## Component Structure

Prefer arrow functions over function declarations for components. Arrow functions require an explicit `displayName`.

```typescript
// ✅ Prefer arrow functions with explicit return type
// ✅ Define and export Props from the same component file
// ✅ Always prefix Props with component name: `ButtonProps` for `Button`
// ❌ Avoid default exports in component files

export type MyComponentProps = {
  title: string;
  // ✅ Drop prefixes for boolean props
  active?: boolean;
  // ✅ Put `className?` and `children?` last in Props definition
  className?: string;
  children?: ReactNode;
};

export const MyComponent = ({
  title,
  active = false,
  className,
  children,
}: MyComponentProps): ReactElement => {
  // 1️⃣ Ref hooks first
  const containerRef = useRef<HTMLDivElement>(null);

  // 2️⃣ Store hooks
  const data = useStore($myStore);

  // 3️⃣ State and derived state
  const [count, setCount] = useState(0);
  const isActive = data?.status === 'active';

  // 4️⃣ Effects last
  useEffect(() => { /* side-effect */ }, [data]);

  // 5️⃣ Class names right before return
  const classNames = cn(
    'p-4 rounded shadow',
    active && 'bg-blue-500',
    className,
  );

  // ✅ Early return for loading / error / guard clauses
  if (!data) return <LoadingIndicator />;

  return (
    <div ref={containerRef} className={classNames} aria-pressed={active}>
      <h1>{title}</h1>
      {children}
    </div>
  );
};

MyComponent.displayName = 'MyComponent';
```

## Display Names

```typescript
// ✅ Default: set displayName with a string literal
export const Button = ({ children }: ButtonProps): ReactElement => (
  <button>{children}</button>
);
Button.displayName = 'Button';

// ✅ If name is reused inside the component (e.g., ID generation), define as const
const TOOLTIP_NAME = 'Tooltip';
export const Tooltip = ({ id, ...props }: TooltipProps): ReactElement => {
  const tooltipId = id ?? `${TOOLTIP_NAME}-${useId()}`;
  return <div id={tooltipId} role='tooltip' {...props} />;
};
Tooltip.displayName = TOOLTIP_NAME;

// ✅ memo()
export const List = React.memo(({ items }: Props) => <ul>...</ul>);
List.displayName = 'List';

// ✅ ref as prop (React 19 — no forwardRef needed)
export type InputProps = {
  ref?: React.Ref<HTMLInputElement>;
} & Props;

export const Input = ({ref, ...props}: InputProps): ReactElement => (
  <input ref={ref} {...props} />
);
Input.displayName = 'Input';
```

## Early Returns

```typescript
// ✅ DO: Return early with null/undefined
const MyContent = ({ isReady }: Props) => {
  if (!isReady) return null;
  return <div>Content</div>;
};

// ❌ DON'T: Wrap conditional content in fragments
const MyContent = ({ isReady }: Props) => {
  return <>{isReady && <div>Content</div>}</>;
};
```

## useEffect Best Practices

```typescript
// ❌ DON'T: Transform data for rendering
useEffect(() => {
  setVisibleTodos(todos.filter(todo => todo.status === filter));
}, [todos, filter]); // Unnecessary effect!

// ✅ DO: Calculate during render
const visibleTodos = useMemo(() => todos.filter(todo => todo.status === filter), [todos, filter]);

// ❌ DON'T: Handle user events in effects
useEffect(() => {
  if (submitted) { sendAnalytics('form_submit'); }
}, [submitted]); // Wrong pattern!

// ✅ DO: Use event handlers directly
const handleSubmit = () => { sendAnalytics('form_submit'); };

// ❌ DON'T: Reset state when prop changes via effect
useEffect(() => { setComment(''); }, [userId]);

// ✅ DO: Use key prop to reset component state
return <Profile key={userId} userId={userId} />;

// ✅ CORRECT uses of useEffect: external system sync and data fetching
useEffect(() => {
  const ws = new WebSocket(url);
  ws.connect();
  return () => ws.disconnect();
}, [url]);

// ❌ DON'T: Early return that blocks re-execution
useEffect(() => {
  if (instanceRef.current) return; // Bug! Won't re-run when items change
  instanceRef.current = createInstance();
  instanceRef.current.setItems(items);
}, [items]);

// ✅ DO: Separate initialization from updates
useEffect(() => {
  if (!instanceRef.current) {
    instanceRef.current = createInstance();
  }
  instanceRef.current.setItems(items);
}, [items]);
```

## Refs in Dependency Arrays

```typescript
// ❌ DON'T: Put ref.current in dependency arrays
useEffect(() => {
  contentRef.current?.focus();
}, [contentRef.current]); // Wrong!

// ✅ DO: Omit from deps, check .current inside
useEffect(() => {
  contentRef.current?.focus();
}, []);
```

## useCallback Best Practices

```typescript
// ❌ DON'T use useCallback when not passed to memo() components or used as hook deps
const handleClick = useCallback(() => console.log('click'), []); // Unnecessary!

// ✅ DO use useCallback when passing to memo() components
const handleClick = useCallback(() => setCount(c => c + 1), []);
return <MemoizedButton onClick={handleClick} />;

// ✅ DO use useCallback when function is a dependency of other hooks
const fetchData = useCallback(() => fetch(url), [url]);
useEffect(() => { fetchData(); }, [fetchData]);
```

## useMemo Best Practices

```typescript
// ❌ DON'T use useMemo for simple calculations
const sum = useMemo(() => a + b, [a, b]); // Overkill!

// ✅ DO use useMemo for expensive calculations
const filtered = useMemo(() => bigArray.filter(...).sort(...), [bigArray]);

// ✅ DO use useMemo for objects/arrays passed to memo() children or used as deps
const options = useMemo(() => ({ sort: true, filter }), [filter]);
return <MemoizedList options={options} />;
```

## Render-Phase Purity

`useMemo`, `useCallback`, component body, and reducers must be pure — no external mutations. React Strict Mode double-invokes these to catch violations. Only `useEffect` and event handlers may produce side effects.

## Extending Component Props

```typescript
// ✅ Use ComponentPropsWithoutRef for standard components
type ButtonProps = {
  variant?: 'primary' | 'secondary';
} & ComponentPropsWithoutRef<'button'>;

// ✅ Use ComponentPropsWithRef when forwarding refs
type InputProps = {
  label?: string;
} & ComponentPropsWithRef<'input'>;

// ❌ DON'T use ComponentProps (doesn't distinguish ref handling)
type BadProps = {value: string} & ComponentProps<'input'>; // Avoid
```

## Performance Patterns

```typescript
// ✅ Wrap heavy components in React.memo
const ImageGrid = React.memo(({ images }: { images: Image[] }) => {
  return images.map(img => <img key={img.id} src={img.src} />);
});
ImageGrid.displayName = 'ImageGrid';

// ✅ Use useLayoutEffect for sync DOM reads/writes before paint
useLayoutEffect(() => {
  if (!ref.current) return;
  const rect = ref.current.getBoundingClientRect();
  setPos(rect.top);
}, []);

// ✅ Throttle high-frequency events (scroll, resize)
const throttledScroll = useCallback(throttle(handleScroll, 100), [handleScroll]);

// ✅ If store is a map, listen for the used keys only
const { account } = useStore($application, { keys: ['account'] });
```
