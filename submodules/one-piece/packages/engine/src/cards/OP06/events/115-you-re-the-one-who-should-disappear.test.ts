import { describe, test } from "vite-plus/test";
import { op06YouReTheOneWhoShouldDisappear115 } from "../../../../../cards/src/cards/OP06/events/115-you-re-the-one-who-should-disappear.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-115 You're the One Who Should Disappear", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06YouReTheOneWhoShouldDisappear115);
  });
});
