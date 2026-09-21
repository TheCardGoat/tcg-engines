import { describe, test } from "vite-plus/test";
import { op03DonquixoteDoflamingoWantedPoster009 } from "../../../../../cards/src/cards/characters/st03-009-donquixote-doflamingo-wanted-poster.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST03-009 Donquixote Doflamingo (Wanted Poster)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03DonquixoteDoflamingoWantedPoster009);
  });
});
