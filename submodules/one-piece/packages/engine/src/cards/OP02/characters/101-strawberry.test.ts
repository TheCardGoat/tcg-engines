import { describe, test } from "vite-plus/test";
import { op02Strawberry101 } from "../../../../../cards/src/cards/characters/op02-101-strawberry.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-101 Strawberry", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Strawberry101);
  });
});
