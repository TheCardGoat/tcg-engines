import { describe, test } from "vite-plus/test";
import { op14eb04GroundDeath096 } from "../../../../../cards/src/cards/events/op14-096-ground-death.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-096 Ground Death", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04GroundDeath096);
  });
});
