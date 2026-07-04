import { describe, test } from "vite-plus/test";
import { prb02HinaReprint008 } from "../../../../../cards/src/cards/PRB02/characters/008-hina-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST06-008 Hina (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02HinaReprint008);
  });
});
