import "bun:test";

declare module "bun:test" {
  interface Matchers<T> {
    toBeSuccessfulCommand(): void;
  }
}
