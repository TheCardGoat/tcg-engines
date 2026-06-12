import { describe, test } from "vite-plus/test";
import { op06VinsmokeIchiji061 } from "../../../../../cards/src/cards/OP06/characters/061-vinsmoke-ichiji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-061 Vinsmoke Ichiji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06VinsmokeIchiji061);
  });
});
