import { describe, test } from "vite-plus/test";
import { op13ShanksOp09004SpSilver004 } from "../../../../../cards/src/cards/OP13/characters/004-shanks-op09-004-sp-silver.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-004 Shanks - OP09-004 (SP) (Silver)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13ShanksOp09004SpSilver004);
  });
});
