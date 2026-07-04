import { describe, test } from "vite-plus/test";
import { op09Shanks004 } from "../../../../../cards/src/cards/OP09/characters/004-shanks.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-004 Shanks", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Shanks004);
  });
});
