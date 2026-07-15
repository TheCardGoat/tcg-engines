import { describe, test } from "vite-plus/test";
import { op09BennBeckman009 } from "../../../../../cards/src/cards/OP09/characters/009-benn-beckman.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-009 Benn.Beckman", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09BennBeckman009);
  });
});
