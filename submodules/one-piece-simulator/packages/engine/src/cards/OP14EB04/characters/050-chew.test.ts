import { describe, test } from "vite-plus/test";
import { op14eb04Chew050 } from "../../../../../cards/src/cards/OP14EB04/characters/050-chew.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-050 Chew", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Chew050);
  });
});
