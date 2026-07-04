import { describe, test } from "vite-plus/test";
import { eb01Blueno017 } from "../../../../../cards/src/cards/EB01/characters/017-blueno.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-017 Blueno", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Blueno017);
  });
});
