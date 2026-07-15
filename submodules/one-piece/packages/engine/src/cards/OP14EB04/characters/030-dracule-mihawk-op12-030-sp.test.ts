import { describe, test } from "vite-plus/test";
import { op14eb04DraculeMihawkOp12030Sp030 } from "../../../../../cards/src/cards/OP14EB04/characters/030-dracule-mihawk-op12-030-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-030 Dracule Mihawk - OP12-030 (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04DraculeMihawkOp12030Sp030);
  });
});
