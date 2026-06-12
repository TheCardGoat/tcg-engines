import { describe, test } from "vite-plus/test";
import { op04MonkeyDLuffyDashPack070 } from "../../../../../cards/src/cards/OP04/characters/070-monkey-d-luffy-dash-pack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-070 Monkey.D.Luffy (Dash Pack)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04MonkeyDLuffyDashPack070);
  });
});
