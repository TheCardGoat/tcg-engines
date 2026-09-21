import { describe, test } from "vite-plus/test";
import { op02Squard009 } from "../../../../../cards/src/cards/characters/op02-009-squard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-009 Squard", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Squard009);
  });
});
