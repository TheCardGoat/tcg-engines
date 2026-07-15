import { describe, test } from "vite-plus/test";
import { eb03Makino009 } from "../../../../../cards/src/cards/EB03/characters/009-makino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-009 Makino", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Makino009);
  });
});
