import { describe, test } from "vite-plus/test";
import { op14eb04GeckoMoriaOp14104104 } from "../../../../../cards/src/cards/OP14EB04/characters/104-gecko-moria-op14-104.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-104 Gecko Moria - OP14-104", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04GeckoMoriaOp14104104);
  });
});
