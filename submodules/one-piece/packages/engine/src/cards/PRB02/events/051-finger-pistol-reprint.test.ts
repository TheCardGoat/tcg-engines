import { describe, test } from "vite-plus/test";
import { prb02FingerPistolReprint051 } from "../../../../../cards/src/cards/PRB02/events/051-finger-pistol-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-051 Finger Pistol (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02FingerPistolReprint051);
  });
});
