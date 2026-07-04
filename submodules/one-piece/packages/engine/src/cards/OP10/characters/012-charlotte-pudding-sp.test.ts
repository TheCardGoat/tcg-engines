import { describe, test } from "vite-plus/test";
import { op10CharlottePuddingSp012 } from "../../../../../cards/src/cards/OP10/characters/012-charlotte-pudding-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST12-012 Charlotte Pudding (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10CharlottePuddingSp012);
  });
});
