import { describe, test } from "vite-plus/test";
import { op04Cavendish081 } from "../../../../../cards/src/cards/characters/op04-081-cavendish.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-081 Cavendish", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Cavendish081);
  });
});
