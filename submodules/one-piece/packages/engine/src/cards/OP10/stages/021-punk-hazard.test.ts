import { describe, test } from "vite-plus/test";
import { op10PunkHazard021 } from "../../../../../cards/src/cards/OP10/stages/021-punk-hazard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-021 Punk Hazard", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10PunkHazard021);
  });
});
