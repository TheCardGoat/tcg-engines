import { describe, test } from "vite-plus/test";
import { op06HitokiriKamazo076 } from "../../../../../cards/src/cards/OP06/characters/076-hitokiri-kamazo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-076 Hitokiri Kamazo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06HitokiriKamazo076);
  });
});
