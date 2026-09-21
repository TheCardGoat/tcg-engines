import { describe, test } from "vite-plus/test";
import { op08Nekomamushi028 } from "../../../../../cards/src/cards/characters/op08-028-nekomamushi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-028 Nekomamushi", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Nekomamushi028);
  });
});
