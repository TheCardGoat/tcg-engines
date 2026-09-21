import { describe, test } from "vite-plus/test";
import { op12Concasser059 } from "../../../../../cards/src/cards/events/op12-059-concasser.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-059 Concasser", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Concasser059);
  });
});
