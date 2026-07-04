import { describe, test } from "vite-plus/test";
import { op11Shirahoshi030 } from "../../../../../cards/src/cards/OP11/characters/030-shirahoshi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-030 Shirahoshi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Shirahoshi030);
  });
});
