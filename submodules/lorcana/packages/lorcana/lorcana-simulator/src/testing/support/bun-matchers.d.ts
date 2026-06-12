import "bun:test";
import "@tcg/lorcana-engine/testing/matchers";

declare module "bun:test" {
  interface Matchers<T> {
    toBeSuccessfulCommand(): void;
  }
}
