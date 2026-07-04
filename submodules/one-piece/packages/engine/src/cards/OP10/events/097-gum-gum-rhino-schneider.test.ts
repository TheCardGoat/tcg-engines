import { describe, test } from "vite-plus/test";
import { op10GumGumRhinoSchneider097 } from "../../../../../cards/src/cards/OP10/events/097-gum-gum-rhino-schneider.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-097 Gum-Gum Rhino Schneider", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10GumGumRhinoSchneider097);
  });
});
