import { describe, test } from "vite-plus/test";
import { op11Saldeath064 } from "../../../../../cards/src/cards/OP11/characters/064-saldeath.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-064 Saldeath", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Saldeath064);
  });
});
