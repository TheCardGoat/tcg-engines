import { describe, test } from "vite-plus/test";
import { op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037 } from "../../../../../cards/src/cards/events/op05-037-because-the-side-of-justice-will-be-whichever-side-wins.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-037 Because the Side of Justice Will Be Whichever Side Wins!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037);
  });
});
