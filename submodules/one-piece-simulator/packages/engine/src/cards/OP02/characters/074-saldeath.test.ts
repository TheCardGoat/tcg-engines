import { describe, test } from "vite-plus/test";
import { op02Saldeath074 } from "../../../../../cards/src/cards/OP02/characters/074-saldeath.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-074 Saldeath", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Saldeath074);
  });
});
