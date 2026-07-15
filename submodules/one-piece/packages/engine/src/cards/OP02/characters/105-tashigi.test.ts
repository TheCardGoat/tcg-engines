import { describe, test } from "vite-plus/test";
import { op02Tashigi105 } from "../../../../../cards/src/cards/OP02/characters/105-tashigi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-105 Tashigi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Tashigi105);
  });
});
