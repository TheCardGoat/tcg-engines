import { describe, test } from "vite-plus/test";
import { op04BuggyDashPack032 } from "../../../../../cards/src/cards/OP04/characters/032-buggy-dash-pack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-032 Buggy (Dash Pack)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04BuggyDashPack032);
  });
});
