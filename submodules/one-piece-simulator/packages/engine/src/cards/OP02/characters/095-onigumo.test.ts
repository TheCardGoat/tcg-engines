import { describe, test } from "vite-plus/test";
import { op02Onigumo095 } from "../../../../../cards/src/cards/OP02/characters/095-onigumo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-095 Onigumo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Onigumo095);
  });
});
