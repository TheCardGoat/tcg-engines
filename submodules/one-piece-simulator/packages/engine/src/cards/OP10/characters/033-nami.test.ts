import { describe, test } from "vite-plus/test";
import { op10Nami033 } from "../../../../../cards/src/cards/OP10/characters/033-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-033 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Nami033);
  });
});
