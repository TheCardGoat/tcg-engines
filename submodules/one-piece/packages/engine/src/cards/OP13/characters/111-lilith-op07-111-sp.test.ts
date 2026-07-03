import { describe, test } from "vite-plus/test";
import { op13LilithOp07111Sp111 } from "../../../../../cards/src/cards/OP13/characters/111-lilith-op07-111-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-111 Lilith - OP07-111 (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13LilithOp07111Sp111);
  });
});
