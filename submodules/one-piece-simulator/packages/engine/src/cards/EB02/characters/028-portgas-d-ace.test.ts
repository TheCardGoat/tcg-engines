import { describe, test } from "vite-plus/test";
import { eb02PortgasDAce028 } from "../../../../../cards/src/cards/EB02/characters/028-portgas-d-ace.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-028 Portgas.D.Ace", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02PortgasDAce028);
  });
});
