import { describe, test } from "vite-plus/test";
import { op01GeckoMoria068 } from "../../../../../cards/src/cards/OP01/characters/068-gecko-moria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-068 Gecko Moria", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01GeckoMoria068);
  });
});
