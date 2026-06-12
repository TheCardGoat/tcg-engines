import { describe, test } from "vite-plus/test";
import { op12IceBlockPheasantPeck057 } from "../../../../../cards/src/cards/OP12/events/057-ice-block-pheasant-peck.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-057 Ice Block Pheasant Peck", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12IceBlockPheasantPeck057);
  });
});
