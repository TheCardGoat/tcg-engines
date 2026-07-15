import { describe, test } from "vite-plus/test";
import { prb02GedatsuReprint102 } from "../../../../../cards/src/cards/PRB02/characters/102-gedatsu-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-102 Gedatsu (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02GedatsuReprint102);
  });
});
