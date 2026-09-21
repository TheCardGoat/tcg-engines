import { describe, test } from "vite-plus/test";
import { op14eb04King031 } from "../../../../../cards/src/cards/characters/eb04-031-king.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-031 King", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04King031);
  });
});
