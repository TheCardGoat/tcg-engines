import { describe, test } from "vite-plus/test";
import { op09PortgasDAce035 } from "../../../../../cards/src/cards/OP09/characters/035-portgas-d-ace.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-035 Portgas.D.Ace", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09PortgasDAce035);
  });
});
