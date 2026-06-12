import { describe, test } from "vite-plus/test";
import { eb03Ain002 } from "../../../../../cards/src/cards/EB03/characters/002-ain.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-002 Ain", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Ain002);
  });
});
