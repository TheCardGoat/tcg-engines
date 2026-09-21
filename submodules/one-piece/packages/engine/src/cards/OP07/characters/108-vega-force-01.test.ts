import { describe, test } from "vite-plus/test";
import { op07VegaForce01108 } from "../../../../../cards/src/cards/characters/op07-108-vega-force-01.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-108 Vega Force 01", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07VegaForce01108);
  });
});
