import { describe, test } from "vite-plus/test";
import { prb01MissDoublefingerZalaFullArt073 } from "../../../../../cards/src/cards/PRB01/characters/073-miss-doublefinger-zala-full-art.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-073 Miss Doublefinger(Zala) (Full Art)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01MissDoublefingerZalaFullArt073);
  });
});
