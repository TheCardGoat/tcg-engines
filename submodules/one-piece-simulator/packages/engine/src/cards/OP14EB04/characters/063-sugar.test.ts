import { describe, test } from "vite-plus/test";
import { op14eb04Sugar063 } from "../../../../../cards/src/cards/OP14EB04/characters/063-sugar.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-063 Sugar", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Sugar063);
  });
});
