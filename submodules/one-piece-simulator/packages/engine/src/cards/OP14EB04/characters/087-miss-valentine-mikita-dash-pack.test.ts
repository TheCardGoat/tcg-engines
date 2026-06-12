import { describe, test } from "vite-plus/test";
import { op14eb04MissValentineMikitaDashPack087 } from "../../../../../cards/src/cards/OP14EB04/characters/087-miss-valentine-mikita-dash-pack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-087 Miss.Valentine(Mikita) (Dash Pack)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04MissValentineMikitaDashPack087);
  });
});
