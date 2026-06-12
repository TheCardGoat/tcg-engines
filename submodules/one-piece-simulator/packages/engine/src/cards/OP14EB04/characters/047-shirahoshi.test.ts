import { describe, test } from "vite-plus/test";
import { op14eb04Shirahoshi047 } from "../../../../../cards/src/cards/OP14EB04/characters/047-shirahoshi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-047 Shirahoshi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Shirahoshi047);
  });
});
