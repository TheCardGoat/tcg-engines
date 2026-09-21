import { describe, test } from "vite-plus/test";
import { op08ItSToDieFor076 } from "../../../../../cards/src/cards/events/op08-076-it-s-to-die-for.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-076 It's to Die For", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08ItSToDieFor076);
  });
});
