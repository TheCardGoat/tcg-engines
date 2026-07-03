import { describe, test } from "vite-plus/test";
import { eb02Chopperman016 } from "../../../../../cards/src/cards/EB02/characters/016-chopperman.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-016 Chopperman", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Chopperman016);
  });
});
