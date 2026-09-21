import { describe, test } from "vite-plus/test";
import { op08GeckoMoriaSp004 } from "../../../../../cards/src/cards/characters/st03-004-gecko-moria-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST03-004 Gecko Moria (SP)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08GeckoMoriaSp004);
  });
});
