import { describe, test } from "vite-plus/test";
import { eb03Nami053 } from "../../../../../cards/src/cards/EB03/characters/053-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-053 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Nami053);
  });
});
