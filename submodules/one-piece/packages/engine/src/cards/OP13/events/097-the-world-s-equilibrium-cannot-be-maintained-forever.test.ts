import { describe, test } from "vite-plus/test";
import { op13TheWorldSEquilibriumCannotBeMaintainedForever097 } from "../../../../../cards/src/cards/OP13/events/097-the-world-s-equilibrium-cannot-be-maintained-forever.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-097 The World's Equilibrium Cannot Be Maintained Forever", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13TheWorldSEquilibriumCannotBeMaintainedForever097);
  });
});
