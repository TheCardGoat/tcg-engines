import { describe, test } from "vite-plus/test";
import { op07PortgasDAce119 } from "../../../../../cards/src/cards/OP07/characters/119-portgas-d-ace.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-119 Portgas.D.Ace", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07PortgasDAce119);
  });
});
