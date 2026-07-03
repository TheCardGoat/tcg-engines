import { describe, test } from "vite-plus/test";
import { op06VinsmokeYonji066 } from "../../../../../cards/src/cards/OP06/characters/066-vinsmoke-yonji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-066 Vinsmoke Yonji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06VinsmokeYonji066);
  });
});
