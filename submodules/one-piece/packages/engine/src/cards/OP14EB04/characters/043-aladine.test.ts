import { describe, test } from "vite-plus/test";
import { op14eb04Aladine043 } from "../../../../../cards/src/cards/OP14EB04/characters/043-aladine.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-043 Aladine", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Aladine043);
  });
});
