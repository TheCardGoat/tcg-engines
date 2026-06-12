import { describe, test } from "vite-plus/test";
import { eb03Hibari008 } from "../../../../../cards/src/cards/EB03/characters/008-hibari.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-008 Hibari", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Hibari008);
  });
});
