import { describe, test } from "vite-plus/test";
import { eb02Hannyabal021 } from "../../../../../cards/src/cards/EB02/leaders/021-hannyabal.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-021 Hannyabal", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Hannyabal021);
  });
});
