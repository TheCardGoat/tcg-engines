import { describe, test } from "vite-plus/test";
import { op06Raki113 } from "../../../../../cards/src/cards/characters/op06-113-raki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-113 Raki", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Raki113);
  });
});
