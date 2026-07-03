import { describe, test } from "vite-plus/test";
import { op02PortgasDAce013 } from "../../../../../cards/src/cards/OP02/characters/013-portgas-d-ace.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-013 Portgas.D.Ace", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02PortgasDAce013);
  });
});
