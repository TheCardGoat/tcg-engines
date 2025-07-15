/**
 * Consolidated test utilities for core-engine tests
 */

// Re-export all test utilities
export * from "./assertion-utils";
export * from "./card-utils";
export * from "./context-utils";
export * from "./error-utils";
export * from "./mock-factories";

// Import test dependencies for convenience
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";

// Export test dependencies
export { describe, it, expect, beforeEach, afterEach, mock, spyOn };

/**
 * Creates a mock function that returns the provided value
 */
export function mockFn<T = unknown>(returnValue?: T) {
  return mock(() => returnValue);
}

// Removed unused functions: mockAsyncFn, mockObject, wait
