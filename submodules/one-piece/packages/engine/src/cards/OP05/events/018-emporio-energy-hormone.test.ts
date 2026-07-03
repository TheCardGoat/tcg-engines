import { describe, test } from "vite-plus/test";
import { op05EmporioEnergyHormone018 } from "../../../../../cards/src/cards/OP05/events/018-emporio-energy-hormone.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-018 Emporio Energy Hormone", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05EmporioEnergyHormone018);
  });
});
