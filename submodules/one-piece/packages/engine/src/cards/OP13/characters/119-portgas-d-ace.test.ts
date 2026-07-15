import { describe, test } from "vite-plus/test";
import { op13PortgasDAce119 } from "../../../../../cards/src/cards/OP13/characters/119-portgas-d-ace.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-119 Portgas.D.Ace", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13PortgasDAce119);
  });
});
