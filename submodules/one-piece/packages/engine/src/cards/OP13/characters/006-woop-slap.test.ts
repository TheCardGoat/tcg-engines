import { describe, test } from "vite-plus/test";
import { op13WoopSlap006 } from "../../../../../cards/src/cards/OP13/characters/006-woop-slap.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-006 Woop Slap", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13WoopSlap006);
  });
});
