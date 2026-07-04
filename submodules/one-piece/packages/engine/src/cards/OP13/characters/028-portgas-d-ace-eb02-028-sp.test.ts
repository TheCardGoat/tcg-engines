import { describe, test } from "vite-plus/test";
import { op13PortgasDAceEb02028Sp028 } from "../../../../../cards/src/cards/OP13/characters/028-portgas-d-ace-eb02-028-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-028 Portgas.D.Ace - EB02-028 (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13PortgasDAceEb02028Sp028);
  });
});
