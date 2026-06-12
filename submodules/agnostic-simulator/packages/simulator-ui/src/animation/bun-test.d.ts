declare module "bun:test" {
  export function describe(name: string, fn: () => void): void;
  export function test(name: string, fn: () => void | Promise<void>): void;

  export function expect<T>(value: T): {
    toBe(expected: T): void;
    toBeNull(): void;
    toEqual(expected: unknown): void;
    toBeUndefined(): void;
  };
}
