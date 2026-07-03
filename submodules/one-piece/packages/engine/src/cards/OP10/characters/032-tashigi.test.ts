import { describe, test } from "vite-plus/test";
import { op10Tashigi032 } from "../../../../../cards/src/cards/OP10/characters/032-tashigi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-032 Tashigi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Tashigi032);
  });
});
