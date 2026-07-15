import { describe, test } from "vite-plus/test";
import { op02Shiryu076 } from "../../../../../cards/src/cards/OP02/characters/076-shiryu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-076 Shiryu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Shiryu076);
  });
});
