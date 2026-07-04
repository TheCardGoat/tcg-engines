import { describe, test } from "vite-plus/test";
import { op01HitokiriKamazo108 } from "../../../../../cards/src/cards/OP01/characters/108-hitokiri-kamazo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-108 Hitokiri Kamazo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01HitokiriKamazo108);
  });
});
