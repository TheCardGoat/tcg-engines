import { describe, test } from "vite-plus/test";
import { op03Marco013 } from "../../../../../cards/src/cards/OP03/characters/013-marco.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-013 Marco", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Marco013);
  });
});
