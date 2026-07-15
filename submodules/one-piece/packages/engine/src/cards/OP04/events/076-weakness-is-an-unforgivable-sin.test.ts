import { describe, test } from "vite-plus/test";
import { op04WeaknessIsAnUnforgivableSin076 } from "../../../../../cards/src/cards/OP04/events/076-weakness-is-an-unforgivable-sin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-076 Weakness...Is an Unforgivable Sin.", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04WeaknessIsAnUnforgivableSin076);
  });
});
