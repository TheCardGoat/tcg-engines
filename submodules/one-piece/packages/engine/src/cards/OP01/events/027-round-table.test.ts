import { describe, test } from "vite-plus/test";
import { op01RoundTable027 } from "../../../../../cards/src/cards/events/op01-027-round-table.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-027 Round Table", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01RoundTable027);
  });
});
