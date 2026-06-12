import { describe, test } from "vite-plus/test";
import { op09Brook073 } from "../../../../../cards/src/cards/OP09/characters/073-brook.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-073 Brook", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Brook073);
  });
});
