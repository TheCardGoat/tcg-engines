import { describe, test } from "vite-plus/test";
import { op12PortgasDAceSp011 } from "../../../../../cards/src/cards/characters/st13-011-portgas-d-ace-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST13-011 Portgas.D.Ace (SP)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12PortgasDAceSp011);
  });
});
