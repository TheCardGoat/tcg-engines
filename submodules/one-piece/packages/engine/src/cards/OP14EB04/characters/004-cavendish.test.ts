import { describe, test } from "vite-plus/test";
import { op14eb04Cavendish004 } from "../../../../../cards/src/cards/OP14EB04/characters/004-cavendish.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-004 Cavendish", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Cavendish004);
  });
});
