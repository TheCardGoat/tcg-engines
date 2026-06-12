import { describe, test } from "vite-plus/test";
import { eb02Jinbe055 } from "../../../../../cards/src/cards/EB02/characters/055-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-055 Jinbe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Jinbe055);
  });
});
