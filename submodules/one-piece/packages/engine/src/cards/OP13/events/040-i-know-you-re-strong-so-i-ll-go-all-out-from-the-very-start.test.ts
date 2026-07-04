import { describe, test } from "vite-plus/test";
import { op13IKnowYouReStrongSoILlGoAllOutFromTheVeryStart040 } from "../../../../../cards/src/cards/OP13/events/040-i-know-you-re-strong-so-i-ll-go-all-out-from-the-very-start.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-040 I Know You're Strong... So I'll Go All Out from the Very Start!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13IKnowYouReStrongSoILlGoAllOutFromTheVeryStart040);
  });
});
