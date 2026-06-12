import { describe, test } from "vite-plus/test";
import { eb01Laboon047 } from "../../../../../cards/src/cards/EB01/characters/047-laboon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-047 Laboon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Laboon047);
  });
});
