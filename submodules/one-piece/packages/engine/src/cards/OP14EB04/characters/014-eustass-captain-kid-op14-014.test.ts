import { describe, test } from "vite-plus/test";
import { op14eb04EustassCaptainKidOp14014014 } from "../../../../../cards/src/cards/OP14EB04/characters/014-eustass-captain-kid-op14-014.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-014 014-eustass-captain-kid-op14-014", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04EustassCaptainKidOp14014014);
  });
});
