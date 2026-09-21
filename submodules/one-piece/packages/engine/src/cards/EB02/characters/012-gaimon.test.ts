import { describe, test } from "vite-plus/test";
import { eb02Gaimon012 } from "../../../../../cards/src/cards/characters/eb02-012-gaimon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-012 Gaimon", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Gaimon012);
  });
});
