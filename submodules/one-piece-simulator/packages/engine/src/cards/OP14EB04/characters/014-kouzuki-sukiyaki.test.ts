import { describe, test } from "vite-plus/test";
import { op14eb04KouzukiSukiyaki014 } from "../../../../../cards/src/cards/OP14EB04/characters/014-kouzuki-sukiyaki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-014 Kouzuki Sukiyaki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04KouzukiSukiyaki014);
  });
});
