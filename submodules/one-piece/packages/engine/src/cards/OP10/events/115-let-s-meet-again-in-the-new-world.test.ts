import { describe, test } from "vite-plus/test";
import { op10LetSMeetAgainInTheNewWorld115 } from "../../../../../cards/src/cards/OP10/events/115-let-s-meet-again-in-the-new-world.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-115 Let's Meet Again in the New World", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10LetSMeetAgainInTheNewWorld115);
  });
});
