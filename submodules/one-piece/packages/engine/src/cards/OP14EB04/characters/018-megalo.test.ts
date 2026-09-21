import { describe, test } from "vite-plus/test";
import { op14eb04Megalo018 } from "../../../../../cards/src/cards/characters/eb04-018-megalo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-018 Megalo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Megalo018);
  });
});
