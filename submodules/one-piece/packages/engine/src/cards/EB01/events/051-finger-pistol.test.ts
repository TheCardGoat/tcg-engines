import { describe, test } from "vite-plus/test";
import { eb01FingerPistol051 } from "../../../../../cards/src/cards/EB01/events/051-finger-pistol.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-051 Finger Pistol", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01FingerPistol051);
  });
});
