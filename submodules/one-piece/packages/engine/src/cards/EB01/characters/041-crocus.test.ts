import { describe, test } from "vite-plus/test";
import { eb01Crocus041 } from "../../../../../cards/src/cards/characters/eb01-041-crocus.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-041 Crocus", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Crocus041);
  });
});
