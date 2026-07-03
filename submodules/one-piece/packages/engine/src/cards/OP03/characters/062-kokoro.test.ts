import { describe, test } from "vite-plus/test";
import { op03Kokoro062 } from "../../../../../cards/src/cards/OP03/characters/062-kokoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-062 Kokoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Kokoro062);
  });
});
