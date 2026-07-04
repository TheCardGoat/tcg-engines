import { describe, test } from "vite-plus/test";
import { op10Urouge101 } from "../../../../../cards/src/cards/OP10/characters/101-urouge.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-101 Urouge", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Urouge101);
  });
});
