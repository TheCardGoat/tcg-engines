import { describe, test } from "vite-plus/test";
import { op14eb04DonTWorryIMHere057 } from "../../../../../cards/src/cards/events/op14-057-don-t-worry-i-m-here.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-057 Don't Worry!! I'm Here!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04DonTWorryIMHere057);
  });
});
