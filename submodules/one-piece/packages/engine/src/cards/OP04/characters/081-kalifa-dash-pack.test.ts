import { describe, test } from "vite-plus/test";
import { op04KalifaDashPack081 } from "../../../../../cards/src/cards/OP04/characters/081-kalifa-dash-pack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-081 Kalifa (Dash Pack)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04KalifaDashPack081);
  });
});
