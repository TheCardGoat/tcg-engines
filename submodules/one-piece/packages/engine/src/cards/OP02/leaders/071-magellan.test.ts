import { describe, test } from "vite-plus/test";
import { op02Magellan071 } from "../../../../../cards/src/cards/leaders/op02-071-magellan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-071 Magellan", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Magellan071);
  });
});
