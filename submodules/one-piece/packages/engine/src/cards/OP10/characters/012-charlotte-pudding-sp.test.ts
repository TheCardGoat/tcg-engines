import { describe, test } from "vite-plus/test";
import { op10CharlottePuddingSp012 } from "../../../../../cards/src/cards/characters/st12-012-charlotte-pudding-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST12-012 Charlotte Pudding (SP)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10CharlottePuddingSp012);
  });
});
