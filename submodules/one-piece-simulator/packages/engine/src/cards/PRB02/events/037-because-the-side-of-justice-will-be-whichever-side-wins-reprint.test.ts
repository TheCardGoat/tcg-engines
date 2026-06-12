import { describe, test } from "vite-plus/test";
import { prb02BecauseTheSideOfJusticeWillBeWhicheverSideWinsReprint037 } from "../../../../../cards/src/cards/PRB02/events/037-because-the-side-of-justice-will-be-whichever-side-wins-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-037 Because the Side of Justice Will Be Whichever Side Wins!! (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BecauseTheSideOfJusticeWillBeWhicheverSideWinsReprint037);
  });
});
