import { describe, test } from "vite-plus/test";
import { op12TheExtinguishesAllSoundCreatedByYourInfluenceTechnique077 } from "../../../../../cards/src/cards/OP12/events/077-the-extinguishes-all-sound-created-by-your-influence-technique.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-077 077-the-extinguishes-all-sound-created-by-your-influence-technique", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12TheExtinguishesAllSoundCreatedByYourInfluenceTechnique077);
  });
});
