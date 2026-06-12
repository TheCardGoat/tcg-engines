import { describe, test } from "vite-plus/test";
import { op05UtaSp120 } from "../../../../../cards/src/cards/OP05/characters/120-uta-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-120 Uta (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05UtaSp120);
  });
});
