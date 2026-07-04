import { describe, test } from "vite-plus/test";
import { op01InTwoYearsAtTheSabaodyArchipelago030 } from "../../../../../cards/src/cards/OP01/events/030-in-two-years-at-the-sabaody-archipelago.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-030 In Two Years!! At the Sabaody Archipelago!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01InTwoYearsAtTheSabaodyArchipelago030);
  });
});
