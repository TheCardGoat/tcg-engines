import { describe, test } from "vite-plus/test";
import { op12LuffyIsTheManWhoWillBecomeTheKingOfPirates039 } from "../../../../../cards/src/cards/events/op12-039-luffy-is-the-man-who-will-become-the-king-of-pirates.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-039 Luffy Is the Man Who Will Become the King of Pirates!!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12LuffyIsTheManWhoWillBecomeTheKingOfPirates039);
  });
});
