import { describe, test } from "vite-plus/test";
import { op13BennBeckmanSp009 } from "../../../../../cards/src/cards/OP13/characters/009-benn-beckman-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-009 Benn.Beckman (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13BennBeckmanSp009);
  });
});
