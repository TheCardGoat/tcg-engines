import { describe, test } from "vite-plus/test";
import { op08Nekomamushi028 } from "../../../../../cards/src/cards/OP08/characters/028-nekomamushi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-028 Nekomamushi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Nekomamushi028);
  });
});
