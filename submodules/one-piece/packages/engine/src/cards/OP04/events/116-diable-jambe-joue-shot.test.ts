import { describe, test } from "vite-plus/test";
import { op04DiableJambeJoueShot116 } from "../../../../../cards/src/cards/OP04/events/116-diable-jambe-joue-shot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-116 Diable Jambe Joue Shot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04DiableJambeJoueShot116);
  });
});
