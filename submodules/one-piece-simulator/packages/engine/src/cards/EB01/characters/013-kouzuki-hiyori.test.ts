import { describe, test } from "vite-plus/test";
import { eb01KouzukiHiyori013 } from "../../../../../cards/src/cards/EB01/characters/013-kouzuki-hiyori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-013 Kouzuki Hiyori", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01KouzukiHiyori013);
  });
});
