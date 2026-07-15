import { describe, test } from "vite-plus/test";
import { op07VegaForce01108 } from "../../../../../cards/src/cards/OP07/characters/108-vega-force-01.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-108 Vega Force 01", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07VegaForce01108);
  });
});
