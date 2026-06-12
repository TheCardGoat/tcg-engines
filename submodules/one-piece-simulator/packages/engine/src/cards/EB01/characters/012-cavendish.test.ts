import { describe, test } from "vite-plus/test";
import { eb01Cavendish012 } from "../../../../../cards/src/cards/EB01/characters/012-cavendish.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-012 Cavendish", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Cavendish012);
  });
});
