import { describe, test } from "vite-plus/test";
import { prb02DonquixoteRosinanteReprint030 } from "../../../../../cards/src/cards/PRB02/characters/030-donquixote-rosinante-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-030 Donquixote Rosinante (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02DonquixoteRosinanteReprint030);
  });
});
