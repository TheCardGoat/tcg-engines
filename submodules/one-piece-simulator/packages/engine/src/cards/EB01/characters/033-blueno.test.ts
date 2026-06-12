import { describe, test } from "vite-plus/test";
import { eb01Blueno033 } from "../../../../../cards/src/cards/EB01/characters/033-blueno.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-033 Blueno", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Blueno033);
  });
});
