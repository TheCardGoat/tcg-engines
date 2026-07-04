import { describe, test } from "vite-plus/test";
import { eb03Lim037 } from "../../../../../cards/src/cards/EB03/characters/037-lim.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-037 Lim", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Lim037);
  });
});
