import { describe, test } from "vite-plus/test";
import { op11HonestyImpact018 } from "../../../../../cards/src/cards/OP11/events/018-honesty-impact.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-018 Honesty Impact", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11HonestyImpact018);
  });
});
