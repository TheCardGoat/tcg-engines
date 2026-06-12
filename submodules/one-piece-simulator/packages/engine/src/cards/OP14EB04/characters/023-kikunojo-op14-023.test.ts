import { describe, test } from "vite-plus/test";
import { op14eb04KikunojoOp14023023 } from "../../../../../cards/src/cards/OP14EB04/characters/023-kikunojo-op14-023.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-023 Kikunojo - OP14-023", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04KikunojoOp14023023);
  });
});
