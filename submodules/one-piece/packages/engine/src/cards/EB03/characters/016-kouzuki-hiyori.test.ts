import { describe, test } from "vite-plus/test";
import { eb03KouzukiHiyori016 } from "../../../../../cards/src/cards/characters/eb03-016-kouzuki-hiyori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-016 Kouzuki Hiyori", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03KouzukiHiyori016);
  });
});
