import { describe, test } from "vite-plus/test";
import { op10Sai048 } from "../../../../../cards/src/cards/OP10/characters/048-sai.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-048 Sai", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Sai048);
  });
});
