import { describe, test } from "vite-plus/test";
import { op14eb04Ran114 } from "../../../../../cards/src/cards/OP14EB04/characters/114-ran.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-114 Ran", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Ran114);
  });
});
