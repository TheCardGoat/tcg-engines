import { describe, test } from "vite-plus/test";
import { op12Poker091 } from "../../../../../cards/src/cards/OP12/characters/091-poker.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-091 Poker", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Poker091);
  });
});
