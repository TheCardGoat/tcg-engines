import { describe, test } from "vite-plus/test";
import { op14eb04HitokiriKamazo035 } from "../../../../../cards/src/cards/OP14EB04/characters/035-hitokiri-kamazo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-035 Hitokiri Kamazo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04HitokiriKamazo035);
  });
});
