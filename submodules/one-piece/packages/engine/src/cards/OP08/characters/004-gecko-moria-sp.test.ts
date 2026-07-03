import { describe, test } from "vite-plus/test";
import { op08GeckoMoriaSp004 } from "../../../../../cards/src/cards/OP08/characters/004-gecko-moria-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST03-004 Gecko Moria (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08GeckoMoriaSp004);
  });
});
