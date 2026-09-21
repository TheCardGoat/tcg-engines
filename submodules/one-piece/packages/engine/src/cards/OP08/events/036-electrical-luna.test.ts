import { describe, test } from "vite-plus/test";
import { op08ElectricalLuna036 } from "../../../../../cards/src/cards/events/op08-036-electrical-luna.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-036 Electrical Luna", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08ElectricalLuna036);
  });
});
