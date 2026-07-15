import { describe, test } from "vite-plus/test";
import { op02Atmos003 } from "../../../../../cards/src/cards/OP02/characters/003-atmos.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-003 Atmos", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Atmos003);
  });
});
