import { describe, test } from "vite-plus/test";
import { eb02AllHuntGrount042 } from "../../../../../cards/src/cards/EB02/characters/042-all-hunt-grount.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-042 All-Hunt Grount", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02AllHuntGrount042);
  });
});
