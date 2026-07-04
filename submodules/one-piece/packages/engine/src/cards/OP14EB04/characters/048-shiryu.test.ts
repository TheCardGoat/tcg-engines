import { describe, test } from "vite-plus/test";
import { op14eb04Shiryu048 } from "../../../../../cards/src/cards/OP14EB04/characters/048-shiryu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-048 Shiryu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Shiryu048);
  });
});
