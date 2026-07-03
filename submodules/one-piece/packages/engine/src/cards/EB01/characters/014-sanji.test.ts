import { describe, test } from "vite-plus/test";
import { eb01Sanji014 } from "../../../../../cards/src/cards/EB01/characters/014-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-014 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Sanji014);
  });
});
