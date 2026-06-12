import { describe, test } from "vite-plus/test";
import { prb01RaizoFullArt052 } from "../../../../../cards/src/cards/PRB01/characters/052-raizo-full-art.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-052 Raizo (Full Art)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01RaizoFullArt052);
  });
});
