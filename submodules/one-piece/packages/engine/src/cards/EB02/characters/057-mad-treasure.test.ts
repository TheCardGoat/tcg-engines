import { describe, test } from "vite-plus/test";
import { eb02MadTreasure057 } from "../../../../../cards/src/cards/EB02/characters/057-mad-treasure.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-057 Mad Treasure", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02MadTreasure057);
  });
});
