import { describe, test } from "vite-plus/test";
import { op02Yamakaji116 } from "../../../../../cards/src/cards/OP02/characters/116-yamakaji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-116 Yamakaji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Yamakaji116);
  });
});
