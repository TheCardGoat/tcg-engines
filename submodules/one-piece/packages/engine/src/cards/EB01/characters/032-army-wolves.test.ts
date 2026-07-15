import { describe, test } from "vite-plus/test";
import { eb01ArmyWolves032 } from "../../../../../cards/src/cards/EB01/characters/032-army-wolves.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-032 Army Wolves", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01ArmyWolves032);
  });
});
