import { describe, test } from "vite-plus/test";
import { op05Stainless045 } from "../../../../../cards/src/cards/OP05/characters/045-stainless.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-045 Stainless", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Stainless045);
  });
});
