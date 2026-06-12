import { describe, test } from "vite-plus/test";
import { op07MegatonNineTailsRush078 } from "../../../../../cards/src/cards/OP07/events/078-megaton-nine-tails-rush.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-078 Megaton Nine-Tails Rush", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07MegatonNineTailsRush078);
  });
});
