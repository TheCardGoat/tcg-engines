import { describe, test } from "vite-plus/test";
import { op05TrafalgarLaw069 } from "../../../../../cards/src/cards/OP05/characters/069-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-069 Trafalgar Law", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05TrafalgarLaw069);
  });
});
