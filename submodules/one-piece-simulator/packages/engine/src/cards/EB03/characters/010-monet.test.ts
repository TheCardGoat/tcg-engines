import { describe, test } from "vite-plus/test";
import { eb03Monet010 } from "../../../../../cards/src/cards/EB03/characters/010-monet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-010 Monet", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Monet010);
  });
});
