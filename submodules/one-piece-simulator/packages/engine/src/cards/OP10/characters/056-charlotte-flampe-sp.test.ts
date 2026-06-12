import { describe, test } from "vite-plus/test";
import { op10CharlotteFlampeSp056 } from "../../../../../cards/src/cards/OP10/characters/056-charlotte-flampe-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-056 Charlotte Flampe (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10CharlotteFlampeSp056);
  });
});
