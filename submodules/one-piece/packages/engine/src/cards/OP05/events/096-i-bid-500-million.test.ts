import { describe, test } from "vite-plus/test";
import { op05IBid500Million096 } from "../../../../../cards/src/cards/OP05/events/096-i-bid-500-million.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-096 I Bid 500 Million!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05IBid500Million096);
  });
});
