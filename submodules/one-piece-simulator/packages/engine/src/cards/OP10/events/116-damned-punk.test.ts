import { describe, test } from "vite-plus/test";
import { op10DamnedPunk116 } from "../../../../../cards/src/cards/OP10/events/116-damned-punk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-116 Damned Punk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10DamnedPunk116);
  });
});
