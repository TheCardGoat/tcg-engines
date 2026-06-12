import { describe, test } from "vite-plus/test";
import { op01Babanuki107 } from "../../../../../cards/src/cards/OP01/characters/107-babanuki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-107 Babanuki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Babanuki107);
  });
});
