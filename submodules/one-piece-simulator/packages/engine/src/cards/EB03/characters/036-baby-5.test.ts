import { describe, test } from "vite-plus/test";
import { eb03Baby5036 } from "../../../../../cards/src/cards/EB03/characters/036-baby-5.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-036 Baby 5", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Baby5036);
  });
});
