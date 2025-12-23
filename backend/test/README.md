# Test Suite

This directory contains unit tests for the backend application.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

- `utils/` - Tests for utility functions (hash, jwt, compare, response)
- `services/` - Tests for service layer (authService, userService, friendService)
- `dtos/` - Tests for data transfer objects
- `middlewares/` - Tests for middleware functions

## Test Coverage

The test suite covers:
- ✅ Utility functions (hash, jwt, compare, response)
- ✅ Service validation methods
- ✅ DTO transformations
- ✅ Middleware authentication logic

## Notes

- Tests use Jest with ES module support
- Some service tests require mocking Mongoose models, which can be complex in ES modules
- For full integration tests, consider using `mongodb-memory-server` or a test database
- Mocking is done using `jest.unstable_mockModule` for ES module compatibility

