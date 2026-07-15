import { describe, test } from "vite-plus/test";
import { eb03UtaManga061 } from "../../../../../cards/src/cards/EB03/characters/061-uta-manga.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-061 Uta (Manga)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03UtaManga061);
  });
});
