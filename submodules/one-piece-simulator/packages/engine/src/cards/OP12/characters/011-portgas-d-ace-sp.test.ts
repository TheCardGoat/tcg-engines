import { describe, test } from "vite-plus/test";
import { op12PortgasDAceSp011 } from "../../../../../cards/src/cards/OP12/characters/011-portgas-d-ace-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST13-011 Portgas.D.Ace (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12PortgasDAceSp011);
  });
});
