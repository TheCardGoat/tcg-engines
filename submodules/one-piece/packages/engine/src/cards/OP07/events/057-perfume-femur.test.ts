import { describe, test } from "vite-plus/test";
import { op07PerfumeFemur057 } from "../../../../../cards/src/cards/OP07/events/057-perfume-femur.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-057 Perfume Femur", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07PerfumeFemur057);
  });
});
