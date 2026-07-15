import { describe, test } from "vite-plus/test";
import { op06VinsmokeIchiji060 } from "../../../../../cards/src/cards/OP06/characters/060-vinsmoke-ichiji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-060 Vinsmoke Ichiji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06VinsmokeIchiji060);
  });
});
