import { describe, test } from "vite-plus/test";
import { op14eb04Marguerite113 } from "../../../../../cards/src/cards/OP14EB04/characters/113-marguerite.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-113 Marguerite", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Marguerite113);
  });
});
