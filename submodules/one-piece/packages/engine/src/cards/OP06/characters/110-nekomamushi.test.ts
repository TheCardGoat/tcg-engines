import { describe, test } from "vite-plus/test";
import { op06Nekomamushi110 } from "../../../../../cards/src/cards/OP06/characters/110-nekomamushi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-110 Nekomamushi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Nekomamushi110);
  });
});
