import { describe, test } from "vite-plus/test";
import { op04DiableJambeJoueShot116 } from "../../../../../cards/src/cards/events/op04-116-diable-jambe-joue-shot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-116 Diable Jambe Joue Shot", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04DiableJambeJoueShot116);
  });
});
