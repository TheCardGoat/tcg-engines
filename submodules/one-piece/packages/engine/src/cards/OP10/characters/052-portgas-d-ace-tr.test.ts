import { describe, test } from "vite-plus/test";
import { op10PortgasDAceTr052 } from "../../../../../cards/src/cards/OP10/characters/052-portgas-d-ace-tr.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-052 Portgas.D.Ace (TR)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10PortgasDAceTr052);
  });
});
