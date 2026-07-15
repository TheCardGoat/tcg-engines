import { describe, test } from "vite-plus/test";
import { op14eb04GroundDeath096 } from "../../../../../cards/src/cards/OP14EB04/events/096-ground-death.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-096 Ground Death", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04GroundDeath096);
  });
});
