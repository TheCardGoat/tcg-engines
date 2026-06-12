import { describe, test } from "vite-plus/test";
import { op13CurlyDadan009 } from "../../../../../cards/src/cards/OP13/characters/009-curly-dadan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-009 Curly.Dadan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13CurlyDadan009);
  });
});
