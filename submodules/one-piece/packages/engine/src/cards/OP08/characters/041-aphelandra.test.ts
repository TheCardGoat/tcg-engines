import { describe, test } from "vite-plus/test";
import { op08Aphelandra041 } from "../../../../../cards/src/cards/OP08/characters/041-aphelandra.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-041 Aphelandra", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Aphelandra041);
  });
});
