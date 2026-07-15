import { describe, test } from "vite-plus/test";
import { op06NothingAtAll096 } from "../../../../../cards/src/cards/OP06/events/096-nothing-at-all.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-096 ...Nothing...at All!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06NothingAtAll096);
  });
});
