import { describe, test } from "vite-plus/test";
import { op02Nekomamushi038 } from "../../../../../cards/src/cards/characters/op02-038-nekomamushi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-038 Nekomamushi", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Nekomamushi038);
  });
});
