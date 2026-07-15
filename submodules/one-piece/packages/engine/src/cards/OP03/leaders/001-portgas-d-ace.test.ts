import { describe, test } from "vite-plus/test";
import { op03PortgasDAce001 } from "../../../../../cards/src/cards/OP03/leaders/001-portgas-d-ace.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-001 Portgas.D.Ace", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03PortgasDAce001);
  });
});
