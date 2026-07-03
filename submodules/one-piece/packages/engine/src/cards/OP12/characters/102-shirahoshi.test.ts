import { describe, test } from "vite-plus/test";
import { op12Shirahoshi102 } from "../../../../../cards/src/cards/OP12/characters/102-shirahoshi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-102 Shirahoshi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Shirahoshi102);
  });
});
