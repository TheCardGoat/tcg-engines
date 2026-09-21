import { describe, test } from "vite-plus/test";
import { op03TempestKickSkySlicer096 } from "../../../../../cards/src/cards/events/op03-096-tempest-kick-sky-slicer.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-096 Tempest Kick Sky Slicer", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03TempestKickSkySlicer096);
  });
});
