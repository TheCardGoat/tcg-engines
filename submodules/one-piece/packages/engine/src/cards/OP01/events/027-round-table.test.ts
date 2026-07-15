import { describe, test } from "vite-plus/test";
import { op01RoundTable027 } from "../../../../../cards/src/cards/OP01/events/027-round-table.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-027 Round Table", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01RoundTable027);
  });
});
