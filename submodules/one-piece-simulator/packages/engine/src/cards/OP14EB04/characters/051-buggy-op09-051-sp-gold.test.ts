import { describe, test } from "vite-plus/test";
import { op14eb04BuggyOp09051SpGold051 } from "../../../../../cards/src/cards/OP14EB04/characters/051-buggy-op09-051-sp-gold.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-051 Buggy - OP09-051 (SP) (Gold)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04BuggyOp09051SpGold051);
  });
});
