import { describe, test } from "vite-plus/test";
import { prb01KalifaFullArt060 } from "../../../../../cards/src/cards/PRB01/characters/060-kalifa-full-art.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-060 Kalifa (Full Art)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01KalifaFullArt060);
  });
});
