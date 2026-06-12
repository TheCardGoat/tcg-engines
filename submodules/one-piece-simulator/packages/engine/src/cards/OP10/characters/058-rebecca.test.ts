import { describe, test } from "vite-plus/test";
import { op10Rebecca058 } from "../../../../../cards/src/cards/OP10/characters/058-rebecca.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-058 Rebecca", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Rebecca058);
  });
});
