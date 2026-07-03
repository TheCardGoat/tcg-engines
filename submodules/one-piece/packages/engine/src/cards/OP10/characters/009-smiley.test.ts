import { describe, test } from "vite-plus/test";
import { op10Smiley009 } from "../../../../../cards/src/cards/OP10/characters/009-smiley.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-009 Smiley", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Smiley009);
  });
});
