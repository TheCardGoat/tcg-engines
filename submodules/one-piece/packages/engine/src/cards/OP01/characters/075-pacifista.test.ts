import { describe, test } from "vite-plus/test";
import { op01Pacifista075 } from "../../../../../cards/src/cards/characters/op01-075-pacifista.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-075 Pacifista", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Pacifista075);
  });
});
