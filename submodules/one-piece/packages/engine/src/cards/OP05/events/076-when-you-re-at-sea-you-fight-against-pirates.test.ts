import { describe, test } from "vite-plus/test";
import { op05WhenYouReAtSeaYouFightAgainstPirates076 } from "../../../../../cards/src/cards/events/op05-076-when-you-re-at-sea-you-fight-against-pirates.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-076 When You're at Sea You Fight against Pirates!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05WhenYouReAtSeaYouFightAgainstPirates076);
  });
});
