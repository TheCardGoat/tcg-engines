import { describe, test } from "vite-plus/test";
import { prb01NamiOp01016Manga016 } from "../../../../../cards/src/cards/PRB01/characters/016-nami-op01-016-manga.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-016 Nami (OP01-016) (Manga)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01NamiOp01016Manga016);
  });
});
