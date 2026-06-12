import { describe, test } from "vite-plus/test";
import { op04KouzukiHiyori103 } from "../../../../../cards/src/cards/OP04/characters/103-kouzuki-hiyori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-103 Kouzuki Hiyori", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04KouzukiHiyori103);
  });
});
