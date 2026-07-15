import { describe, test } from "vite-plus/test";
import { eb01Mr9037 } from "../../../../../cards/src/cards/EB01/characters/037-mr-9.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-037 Mr. 9", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Mr9037);
  });
});
