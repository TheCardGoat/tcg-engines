import { describe, test } from "vite-plus/test";
import { op05XBarrels056 } from "../../../../../cards/src/cards/characters/op05-056-x-barrels.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-056 X.Barrels", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05XBarrels056);
  });
});
