import { describe, test } from "vite-plus/test";
import { prb02WhiteSnakePirateFoil059 } from "../../../../../cards/src/cards/PRB02/events/059-white-snake-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-059 White Snake (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02WhiteSnakePirateFoil059);
  });
});
