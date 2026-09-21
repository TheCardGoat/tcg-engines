import { describe, test } from "vite-plus/test";
import { op02GeckoMoria054 } from "../../../../../cards/src/cards/characters/op02-054-gecko-moria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-054 Gecko Moria", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02GeckoMoria054);
  });
});
