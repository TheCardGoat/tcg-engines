import { describe, test } from "vite-plus/test";
import { op10Vergo004 } from "../../../../../cards/src/cards/OP10/characters/004-vergo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-004 Vergo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Vergo004);
  });
});
