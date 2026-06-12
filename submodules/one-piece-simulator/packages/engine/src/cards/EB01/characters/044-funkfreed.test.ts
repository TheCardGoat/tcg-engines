import { describe, test } from "vite-plus/test";
import { eb01Funkfreed044 } from "../../../../../cards/src/cards/EB01/characters/044-funkfreed.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-044 Funkfreed", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Funkfreed044);
  });
});
