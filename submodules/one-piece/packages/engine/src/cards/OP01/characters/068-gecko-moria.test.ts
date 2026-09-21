import { describe, test } from "vite-plus/test";
import { op01GeckoMoria068 } from "../../../../../cards/src/cards/characters/op01-068-gecko-moria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-068 Gecko Moria", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01GeckoMoria068);
  });
});
