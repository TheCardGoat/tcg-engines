import { describe, test } from "vite-plus/test";
import { op04MissMerrychristmasDrophy067 } from "../../../../../cards/src/cards/characters/op04-067-miss-merrychristmas-drophy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-067 Miss.MerryChristmas(Drophy)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04MissMerrychristmasDrophy067);
  });
});
