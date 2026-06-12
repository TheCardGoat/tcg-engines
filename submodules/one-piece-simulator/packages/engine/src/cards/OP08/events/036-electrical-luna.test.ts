import { describe, test } from "vite-plus/test";
import { op08ElectricalLuna036 } from "../../../../../cards/src/cards/OP08/events/036-electrical-luna.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-036 Electrical Luna", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08ElectricalLuna036);
  });
});
