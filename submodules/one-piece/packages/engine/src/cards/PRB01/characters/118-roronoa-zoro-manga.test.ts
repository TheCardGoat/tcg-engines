import { describe, test } from "vite-plus/test";
import { prb01RoronoaZoroManga118 } from "../../../../../cards/src/cards/PRB01/characters/118-roronoa-zoro-manga.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-118 Roronoa Zoro (Manga)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01RoronoaZoroManga118);
  });
});
