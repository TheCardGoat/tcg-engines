import { describe, test } from "vite-plus/test";
import { op03Nami040 } from "../../../../../cards/src/cards/OP03/leaders/040-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-040 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Nami040);
  });
});
