import { describe, test } from "vite-plus/test";
import { op02Atmos003 } from "../../../../../cards/src/cards/characters/op02-003-atmos.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-003 Atmos", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Atmos003);
  });
});
