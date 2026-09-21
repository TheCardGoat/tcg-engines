import { describe, test } from "vite-plus/test";
import { eb01Sanji014 } from "../../../../../cards/src/cards/characters/eb01-014-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-014 Sanji", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Sanji014);
  });
});
