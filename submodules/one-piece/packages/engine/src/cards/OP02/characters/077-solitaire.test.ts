import { describe, test } from "vite-plus/test";
import { op02Solitaire077 } from "../../../../../cards/src/cards/OP02/characters/077-solitaire.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-077 Solitaire", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Solitaire077);
  });
});
