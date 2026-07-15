import { describe, test } from "vite-plus/test";
import { op03Jabra085 } from "../../../../../cards/src/cards/OP03/characters/085-jabra.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-085 Jabra", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Jabra085);
  });
});
