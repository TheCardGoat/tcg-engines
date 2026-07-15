import { describe, test } from "vite-plus/test";
import { op10Nami088 } from "../../../../../cards/src/cards/OP10/characters/088-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-088 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Nami088);
  });
});
