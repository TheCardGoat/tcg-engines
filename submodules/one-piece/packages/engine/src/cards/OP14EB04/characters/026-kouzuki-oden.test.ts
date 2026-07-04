import { describe, test } from "vite-plus/test";
import { op14eb04KouzukiOden026 } from "../../../../../cards/src/cards/OP14EB04/characters/026-kouzuki-oden.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-026 Kouzuki Oden", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04KouzukiOden026);
  });
});
