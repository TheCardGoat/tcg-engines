import { describe, test } from "vite-plus/test";
import { eb03TrafalgarLaw062 } from "../../../../../cards/src/cards/EB03/characters/062-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-062 Trafalgar Law", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03TrafalgarLaw062);
  });
});
