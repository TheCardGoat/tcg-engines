import { describe, test } from "vite-plus/test";
import { op14eb04DraculeMihawkOp14020020 } from "../../../../../cards/src/cards/OP14EB04/leaders/020-dracule-mihawk-op14-020.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-020 Dracule Mihawk - OP14-020", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04DraculeMihawkOp14020020);
  });
});
