import { describe, test } from "vite-plus/test";
import { op02Blugori084 } from "../../../../../cards/src/cards/OP02/characters/084-blugori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-084 Blugori", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Blugori084);
  });
});
