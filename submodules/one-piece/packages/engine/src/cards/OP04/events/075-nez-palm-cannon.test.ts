import { describe, test } from "vite-plus/test";
import { op04NezPalmCannon075 } from "../../../../../cards/src/cards/OP04/events/075-nez-palm-cannon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-075 Nez-Palm Cannon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04NezPalmCannon075);
  });
});
