import { describe, test } from "vite-plus/test";
import { op04SpeedJilDashPack006 } from "../../../../../cards/src/cards/OP04/characters/006-speed-jil-dash-pack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-006 Speed Jil (Dash Pack)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04SpeedJilDashPack006);
  });
});
