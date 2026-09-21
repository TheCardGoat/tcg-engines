import { describe, test } from "vite-plus/test";
import { op04Eric022 } from "../../../../../cards/src/cards/characters/op04-022-eric.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-022 Eric", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Eric022);
  });
});
