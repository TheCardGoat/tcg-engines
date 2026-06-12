import { describe, test } from "vite-plus/test";
import { op05TrafalgarLaw027 } from "../../../../../cards/src/cards/OP05/characters/027-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-027 Trafalgar Law", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05TrafalgarLaw027);
  });
});
