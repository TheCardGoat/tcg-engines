import { describe, test } from "vite-plus/test";
import { op08PortgasDAce052 } from "../../../../../cards/src/cards/characters/op08-052-portgas-d-ace.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-052 Portgas.D.Ace", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08PortgasDAce052);
  });
});
