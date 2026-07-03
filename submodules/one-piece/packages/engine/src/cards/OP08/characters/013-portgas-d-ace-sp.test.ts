import { describe, test } from "vite-plus/test";
import { op08PortgasDAceSp013 } from "../../../../../cards/src/cards/OP08/characters/013-portgas-d-ace-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-013 Portgas.D.Ace (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08PortgasDAceSp013);
  });
});
