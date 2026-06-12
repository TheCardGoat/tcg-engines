import { describe, test } from "vite-plus/test";
import { eb02ClovenRoseBlizzard007 } from "../../../../../cards/src/cards/EB02/events/007-cloven-rose-blizzard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-007 Cloven Rose Blizzard", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02ClovenRoseBlizzard007);
  });
});
