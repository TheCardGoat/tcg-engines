import { describe, test } from "vite-plus/test";
import { op11Doll008 } from "../../../../../cards/src/cards/OP11/characters/008-doll.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-008 Doll", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Doll008);
  });
});
