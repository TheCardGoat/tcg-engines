import { describe, test } from "vite-plus/test";
import { eb01Hannyabal021 } from "../../../../../cards/src/cards/EB01/leaders/021-hannyabal.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-021 Hannyabal", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Hannyabal021);
  });
});
