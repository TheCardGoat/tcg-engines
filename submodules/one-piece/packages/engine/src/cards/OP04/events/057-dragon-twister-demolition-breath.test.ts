import { describe, test } from "vite-plus/test";
import { op04DragonTwisterDemolitionBreath057 } from "../../../../../cards/src/cards/OP04/events/057-dragon-twister-demolition-breath.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-057 Dragon Twister Demolition Breath", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04DragonTwisterDemolitionBreath057);
  });
});
