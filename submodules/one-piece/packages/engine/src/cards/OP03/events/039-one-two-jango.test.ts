import { describe, test } from "vite-plus/test";
import { op03OneTwoJango039 } from "../../../../../cards/src/cards/events/op03-039-one-two-jango.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-039 One, Two, Jango", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03OneTwoJango039);
  });
});
