import { describe, test } from "vite-plus/test";
import { op11AfterAllTheseYearsIMLosingMyEdge097 } from "../../../../../cards/src/cards/OP11/events/097-after-all-these-years-i-m-losing-my-edge.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-097 After All These Years I'm Losing My Edge!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11AfterAllTheseYearsIMLosingMyEdge097);
  });
});
