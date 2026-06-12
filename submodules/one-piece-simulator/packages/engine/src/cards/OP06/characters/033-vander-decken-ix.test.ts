import { describe, test } from "vite-plus/test";
import { op06VanderDeckenIx033 } from "../../../../../cards/src/cards/OP06/characters/033-vander-decken-ix.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-033 Vander Decken IX", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06VanderDeckenIx033);
  });
});
