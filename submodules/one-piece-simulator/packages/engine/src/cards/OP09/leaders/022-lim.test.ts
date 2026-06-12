import { describe, test } from "vite-plus/test";
import { op09Lim022 } from "../../../../../cards/src/cards/OP09/leaders/022-lim.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-022 Lim", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Lim022);
  });
});
