import { describe, test } from "vite-plus/test";
import { op08Atmos040 } from "../../../../../cards/src/cards/characters/op08-040-atmos.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-040 Atmos", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Atmos040);
  });
});
