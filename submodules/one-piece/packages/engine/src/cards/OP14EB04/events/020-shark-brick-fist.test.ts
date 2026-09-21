import { describe, test } from "vite-plus/test";
import { op14eb04SharkBrickFist020 } from "../../../../../cards/src/cards/events/eb04-020-shark-brick-fist.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-020 Shark Brick Fist", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04SharkBrickFist020);
  });
});
