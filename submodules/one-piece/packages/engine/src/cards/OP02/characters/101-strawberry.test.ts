import { describe, test } from "vite-plus/test";
import { op02Strawberry101 } from "../../../../../cards/src/cards/OP02/characters/101-strawberry.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-101 Strawberry", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Strawberry101);
  });
});
