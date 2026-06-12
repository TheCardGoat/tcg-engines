import { describe, test } from "vite-plus/test";
import { op11VinsmokeIchiji043 } from "../../../../../cards/src/cards/OP11/characters/043-vinsmoke-ichiji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-043 Vinsmoke Ichiji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11VinsmokeIchiji043);
  });
});
