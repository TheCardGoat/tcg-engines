import { describe, test } from "vite-plus/test";
import { op14eb04Tashigi029 } from "../../../../../cards/src/cards/OP14EB04/characters/029-tashigi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-029 Tashigi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Tashigi029);
  });
});
