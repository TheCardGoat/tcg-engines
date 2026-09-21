import { describe, test } from "vite-plus/test";
import { op10BlueGilly054 } from "../../../../../cards/src/cards/characters/op10-054-blue-gilly.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-054 Blue Gilly", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10BlueGilly054);
  });
});
