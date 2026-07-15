import { describe, test } from "vite-plus/test";
import { prb01SogekingManga122 } from "../../../../../cards/src/cards/PRB01/characters/122-sogeking-manga.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-122 Sogeking (Manga)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01SogekingManga122);
  });
});
