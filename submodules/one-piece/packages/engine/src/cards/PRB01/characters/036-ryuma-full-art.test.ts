import { describe, test } from "vite-plus/test";
import { prb01RyumaFullArt036 } from "../../../../../cards/src/cards/PRB01/characters/036-ryuma-full-art.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-036 Ryuma (Full Art)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01RyumaFullArt036);
  });
});
