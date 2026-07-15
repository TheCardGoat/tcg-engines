import { describe, test } from "vite-plus/test";
import { op04BoodleDashPack050 } from "../../../../../cards/src/cards/OP04/characters/050-boodle-dash-pack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-050 Boodle (Dash Pack)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04BoodleDashPack050);
  });
});
