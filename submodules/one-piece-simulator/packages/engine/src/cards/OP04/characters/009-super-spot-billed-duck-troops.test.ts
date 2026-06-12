import { describe, test } from "vite-plus/test";
import { op04SuperSpotBilledDuckTroops009 } from "../../../../../cards/src/cards/OP04/characters/009-super-spot-billed-duck-troops.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-009 Super Spot-Billed Duck Troops", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04SuperSpotBilledDuckTroops009);
  });
});
