import { describe, test } from "vite-plus/test";
import { op07PortgasDAce053 } from "../../../../../cards/src/cards/OP07/characters/053-portgas-d-ace.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-053 Portgas.D.Ace", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07PortgasDAce053);
  });
});
