import { describe, test } from "vite-plus/test";
import { op13SaboOp07118Sp118 } from "../../../../../cards/src/cards/OP13/characters/118-sabo-op07-118-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-118 Sabo - OP07-118 (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13SaboOp07118Sp118);
  });
});
