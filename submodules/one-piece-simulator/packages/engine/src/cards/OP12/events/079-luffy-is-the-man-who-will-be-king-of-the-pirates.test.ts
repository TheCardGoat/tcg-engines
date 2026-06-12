import { describe, test } from "vite-plus/test";
import { op12LuffyIsTheManWhoWillBeKingOfThePirates079 } from "../../../../../cards/src/cards/OP12/events/079-luffy-is-the-man-who-will-be-king-of-the-pirates.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-079 Luffy Is the Man Who Will Be King of the Pirates!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12LuffyIsTheManWhoWillBeKingOfThePirates079);
  });
});
