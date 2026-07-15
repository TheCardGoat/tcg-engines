import { describe, test } from "vite-plus/test";
import { eb02TrafalgarLaw045 } from "../../../../../cards/src/cards/EB02/characters/045-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-045 Trafalgar Law", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02TrafalgarLaw045);
  });
});
