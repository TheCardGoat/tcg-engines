import { describe, test } from "vite-plus/test";
import { op14eb04CharlottePudding034 } from "../../../../../cards/src/cards/characters/eb04-034-charlotte-pudding.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-034 Charlotte Pudding", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04CharlottePudding034);
  });
});
