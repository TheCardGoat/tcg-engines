import { describe, test } from "vite-plus/test";
import { op01TrafalgarLaw047 } from "../../../../../cards/src/cards/OP01/characters/047-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-047 Trafalgar Law", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01TrafalgarLaw047);
  });
});
