import { describe, test } from "vite-plus/test";
import { op11Ryuboshi113 } from "../../../../../cards/src/cards/OP11/characters/113-ryuboshi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-113 Ryuboshi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Ryuboshi113);
  });
});
