import { describe, test } from "vite-plus/test";
import { op14eb04Queen032 } from "../../../../../cards/src/cards/characters/eb04-032-queen.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-032 Queen", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Queen032);
  });
});
