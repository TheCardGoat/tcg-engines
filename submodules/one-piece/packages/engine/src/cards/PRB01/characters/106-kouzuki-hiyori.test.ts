import { describe, test } from "vite-plus/test";
import { prb01KouzukiHiyori106 } from "../../../../../cards/src/cards/PRB01/characters/106-kouzuki-hiyori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-106 Kouzuki Hiyori", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01KouzukiHiyori106);
  });
});
