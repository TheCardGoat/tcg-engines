import { describe, test } from "vite-plus/test";
import { op05Yama113 } from "../../../../../cards/src/cards/characters/op05-113-yama.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-113 Yama", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Yama113);
  });
});
