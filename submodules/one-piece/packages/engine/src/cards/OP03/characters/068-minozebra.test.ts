import { describe, test } from "vite-plus/test";
import { op03Minozebra068 } from "../../../../../cards/src/cards/OP03/characters/068-minozebra.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-068 Minozebra", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Minozebra068);
  });
});
