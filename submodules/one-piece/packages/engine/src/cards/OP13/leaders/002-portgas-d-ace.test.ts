import { describe, test } from "vite-plus/test";
import { op13PortgasDAce002 } from "../../../../../cards/src/cards/leaders/op13-002-portgas-d-ace.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-002 Portgas.D.Ace", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13PortgasDAce002);
  });
});
