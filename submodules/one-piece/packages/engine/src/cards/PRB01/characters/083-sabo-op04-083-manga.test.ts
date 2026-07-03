import { describe, test } from "vite-plus/test";
import { prb01SaboOp04083Manga083 } from "../../../../../cards/src/cards/PRB01/characters/083-sabo-op04-083-manga.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-083 Sabo (OP04-083) (Manga)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01SaboOp04083Manga083);
  });
});
