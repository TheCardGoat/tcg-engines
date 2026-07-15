import { describe, test } from "vite-plus/test";
import { op13PortgasDAce002 } from "../../../../../cards/src/cards/OP13/leaders/002-portgas-d-ace.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-002 Portgas.D.Ace", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13PortgasDAce002);
  });
});
