import { describe, test } from "vite-plus/test";
import { op11BerryGood091 } from "../../../../../cards/src/cards/OP11/characters/091-berry-good.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-091 Berry Good", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11BerryGood091);
  });
});
