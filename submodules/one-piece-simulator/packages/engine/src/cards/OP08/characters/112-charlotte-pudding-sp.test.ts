import { describe, test } from "vite-plus/test";
import { op08CharlottePuddingSp112 } from "../../../../../cards/src/cards/OP08/characters/112-charlotte-pudding-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-112 Charlotte Pudding (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlottePuddingSp112);
  });
});
