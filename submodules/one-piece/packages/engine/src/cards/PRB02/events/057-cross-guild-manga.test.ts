import { describe, test } from "vite-plus/test";
import { prb02CrossGuildManga057 } from "../../../../../cards/src/cards/PRB02/events/057-cross-guild-manga.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-057 Cross Guild (Manga)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CrossGuildManga057);
  });
});
