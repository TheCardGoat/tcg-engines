import { describe, test } from "vite-plus/test";
import { op02Nekomamushi038 } from "../../../../../cards/src/cards/OP02/characters/038-nekomamushi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-038 Nekomamushi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Nekomamushi038);
  });
});
