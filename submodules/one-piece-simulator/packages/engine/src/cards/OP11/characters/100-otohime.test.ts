import { describe, test } from "vite-plus/test";
import { op11Otohime100 } from "../../../../../cards/src/cards/OP11/characters/100-otohime.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-100 Otohime", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Otohime100);
  });
});
