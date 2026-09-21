import { describe, test } from "vite-plus/test";
import { op02Smoker093 } from "../../../../../cards/src/cards/leaders/op02-093-smoker.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-093 Smoker", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Smoker093);
  });
});
