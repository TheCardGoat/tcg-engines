import { describe, test } from "vite-plus/test";
import { op14eb04Diamante066 } from "../../../../../cards/src/cards/OP14EB04/characters/066-diamante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-066 Diamante", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Diamante066);
  });
});
