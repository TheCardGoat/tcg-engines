import { describe, test } from "vite-plus/test";
import { op05Mozambia053 } from "../../../../../cards/src/cards/OP05/characters/053-mozambia.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-053 Mozambia", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Mozambia053);
  });
});
