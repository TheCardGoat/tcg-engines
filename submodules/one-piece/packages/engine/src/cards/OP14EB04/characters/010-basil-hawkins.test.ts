import { describe, test } from "vite-plus/test";
import { op14eb04BasilHawkins010 } from "../../../../../cards/src/cards/OP14EB04/characters/010-basil-hawkins.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-010 Basil Hawkins", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04BasilHawkins010);
  });
});
