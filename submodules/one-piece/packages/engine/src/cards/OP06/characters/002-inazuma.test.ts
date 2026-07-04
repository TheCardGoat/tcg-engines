import { describe, test } from "vite-plus/test";
import { op06Inazuma002 } from "../../../../../cards/src/cards/OP06/characters/002-inazuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-002 Inazuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Inazuma002);
  });
});
