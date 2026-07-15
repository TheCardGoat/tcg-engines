import { describe, test } from "vite-plus/test";
import { op11Brook056 } from "../../../../../cards/src/cards/OP11/characters/056-brook.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-056 Brook", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Brook056);
  });
});
