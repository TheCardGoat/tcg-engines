import { describe, test } from "vite-plus/test";
import { op14eb04MissMerrychristmasDrophy088 } from "../../../../../cards/src/cards/OP14EB04/characters/088-miss-merrychristmas-drophy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-088 Miss.MerryChristmas(Drophy)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04MissMerrychristmasDrophy088);
  });
});
