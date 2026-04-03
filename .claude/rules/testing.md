---
paths:
  - '**/*.test.{ts,tsx}'
  - '**/*.spec.{ts,tsx}'
---

# Testing Standards

## Test Structure

Use the Arrange-Act-Assert pattern for all tests.

```typescript
describe('userService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData: UserData = {email: 'test@example.com', name: 'John'};
      const mockUser = {id: 'user_123', ...userData};
      vi.spyOn(userRepository, 'create').mockResolvedValue(mockUser);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({id: expect.stringMatching(/^user_/)});
    });
  });
});
```

## Builder Pattern for Test Data

```typescript
// ✅ Builder with sensible defaults and optional overrides
function buildUser(overrides?: Partial<User>): User {
  return {
    id: 'user_123',
    email: 'test@example.com',
    name: 'Test User',
    ...overrides,
  };
}
```

## Mock Patterns

```typescript
// ✅ Mock external dependencies
vi.mock('../services/EmailService', () => ({
  EmailService: {
    send: vi.fn().mockResolvedValue(true),
  },
}));

// ✅ Spy on methods for assertion
vi.spyOn(service, 'method').mockReturnValue(expectedResult);

// ✅ Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});

// ✅ Use vi.fn() for callback assertions
const onChangeMock = vi.fn();
callFunctionUnderTest(onChangeMock);
expect(onChangeMock).toHaveBeenCalledWith(expectedArg);
```

## React Component Testing

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
  it('should submit form with valid credentials', async () => {
    // Arrange
    const mockOnLogin = vi.fn().mockResolvedValue({ success: true });
    render(<LoginForm onLogin={mockOnLogin} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });
});
```

### Query Priority

Follow Testing Library's query priority:

1. `getByRole` — accessible queries first
2. `getByText` — visible text
3. `getByLabelText` — form elements

## Test File Conventions

```typescript
// ✅ One describe block per module/component
// ✅ Nested describe for method/function grouping
// ✅ Test names start with 'should'

describe('ClassName', () => {
  describe('methodName', () => {
    it('should return expected value for valid input', () => {
      /* ... */
    });
    it('should throw when input is null', () => {
      /* ... */
    });
  });
});
```
