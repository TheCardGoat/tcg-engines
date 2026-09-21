import { describe, test } from "vite-plus/test";
import { op02LandOfWano048 } from "../../../../../cards/src/cards/stages/op02-048-land-of-wano.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-048 Land of Wano", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02LandOfWano048);
  });
});
