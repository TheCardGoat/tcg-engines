import { describe, test } from "vite-plus/test";
import { op05Shura106 } from "../../../../../cards/src/cards/OP05/characters/106-shura.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-106 Shura", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Shura106);
  });
});
