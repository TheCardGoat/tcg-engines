import { describe, test } from "vite-plus/test";
import { op14eb04PeronaOp14111111 } from "../../../../../cards/src/cards/OP14EB04/characters/111-perona-op14-111.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-111 Perona - OP14-111", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04PeronaOp14111111);
  });
});
