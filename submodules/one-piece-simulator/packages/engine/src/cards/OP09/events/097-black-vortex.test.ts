import { describe, test } from "vite-plus/test";
import { op09BlackVortex097 } from "../../../../../cards/src/cards/OP09/events/097-black-vortex.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-097 Black Vortex", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09BlackVortex097);
  });
});
