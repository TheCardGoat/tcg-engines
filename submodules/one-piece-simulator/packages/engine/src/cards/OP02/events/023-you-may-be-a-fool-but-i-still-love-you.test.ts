import { describe, test } from "vite-plus/test";
import { op02YouMayBeAFoolButIStillLoveYou023 } from "../../../../../cards/src/cards/OP02/events/023-you-may-be-a-fool-but-i-still-love-you.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-023 You May Be a Fool...but I Still Love You", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02YouMayBeAFoolButIStillLoveYou023);
  });
});
