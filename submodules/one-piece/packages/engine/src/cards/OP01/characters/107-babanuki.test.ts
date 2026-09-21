import { describe, test } from "vite-plus/test";
import { op01Babanuki107 } from "../../../../../cards/src/cards/characters/op01-107-babanuki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-107 Babanuki", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Babanuki107);
  });
});
