import { describe, test } from "vite-plus/test";
import { op01Kaido094 } from "../../../../../cards/src/cards/OP01/characters/094-kaido.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-094 Kaido", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Kaido094);
  });
});
