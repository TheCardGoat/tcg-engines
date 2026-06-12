import { describe, test } from "vite-plus/test";
import { eb03Shirahoshi052 } from "../../../../../cards/src/cards/EB03/characters/052-shirahoshi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-052 Shirahoshi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Shirahoshi052);
  });
});
