import { describe, test } from "vite-plus/test";
import { prb02GeckoMoria013 } from "../../../../../cards/src/cards/PRB02/characters/013-gecko-moria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-013 Gecko Moria", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02GeckoMoria013);
  });
});
