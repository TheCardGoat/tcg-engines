import { describe, test } from "vite-plus/test";
import { op14eb04GeckoMoriaOp14080080 } from "../../../../../cards/src/cards/OP14EB04/leaders/080-gecko-moria-op14-080.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-080 Gecko Moria - OP14-080", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04GeckoMoriaOp14080080);
  });
});
