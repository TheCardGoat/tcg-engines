import { describe, test } from "vite-plus/test";
import { op04HeavenlyFire117 } from "../../../../../cards/src/cards/events/op04-117-heavenly-fire.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-117 Heavenly Fire", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04HeavenlyFire117);
  });
});
