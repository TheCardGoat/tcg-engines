import { describe, test } from "vite-plus/test";
import { prb02YouCanBeMySamuraiPirateFoil055 } from "../../../../../cards/src/cards/PRB02/events/055-you-can-be-my-samurai-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-055 You Can Be My Samurai!! (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02YouCanBeMySamuraiPirateFoil055);
  });
});
