import { describe, test } from "vite-plus/test";
import { op14eb04Kumacy102 } from "../../../../../cards/src/cards/OP14EB04/characters/102-kumacy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-102 Kumacy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Kumacy102);
  });
});
