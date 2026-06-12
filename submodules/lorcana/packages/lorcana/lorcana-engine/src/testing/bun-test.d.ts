declare module "bun:test" {
  export interface Matchers<T = unknown> {
    not: Matchers<T>;
    resolves: Matchers<unknown>;
    rejects: Matchers<unknown>;
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
    toStrictEqual(expected: unknown): void;
    toContain(expected: unknown): void;
    toBeDefined(): void;
    toBeUndefined(): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toHaveLength(expected: number): void;
    toHaveProperty(path: string, value?: unknown): void;
    toMatchObject(expected: Record<string, unknown>): void;
    [key: string]: any;
  }

  export interface Expect {
    <T = unknown>(actual: T): Matchers<T>;
    extend(matchers: Record<string, (...args: any[]) => any>): void;
    objectContaining(expected: Record<string, unknown>): any;
    any(constructor: unknown): any;
  }

  export const expect: Expect;

  export type TestFn = ((
    name: string,
    fn: () => void | Promise<void>,
    options?: { timeout?: number },
  ) => void) & {
    skip: (name: string, fn: () => void | Promise<void>, options?: { timeout?: number }) => void;
    only: (name: string, fn: () => void | Promise<void>, options?: { timeout?: number }) => void;
    todo: (name: string) => void;
  };

  export type DescribeFn = ((name: string, fn: () => void) => void) & {
    skip: (name: string, fn: () => void) => void;
    only: (name: string, fn: () => void) => void;
    todo: (name: string, fn?: () => void) => void;
  };

  export const describe: DescribeFn;
  export const it: TestFn;
  export const test: TestFn;
  export const beforeEach: (fn: () => void | Promise<void>) => void;
  export const afterEach: (fn: () => void | Promise<void>) => void;
}
