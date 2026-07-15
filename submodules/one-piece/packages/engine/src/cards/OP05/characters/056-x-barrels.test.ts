import { describe, test } from "vite-plus/test";
import { op05XBarrels056 } from "../../../../../cards/src/cards/OP05/characters/056-x-barrels.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-056 X.Barrels", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05XBarrels056);
  });
});
