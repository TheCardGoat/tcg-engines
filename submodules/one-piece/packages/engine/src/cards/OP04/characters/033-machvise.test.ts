import { describe, test } from "vite-plus/test";
import { op04Machvise033 } from "../../../../../cards/src/cards/OP04/characters/033-machvise.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-033 Machvise", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Machvise033);
  });
});
