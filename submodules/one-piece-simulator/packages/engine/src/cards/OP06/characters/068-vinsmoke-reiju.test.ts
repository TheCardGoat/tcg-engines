import { describe, test } from "vite-plus/test";
import { op06VinsmokeReiju068 } from "../../../../../cards/src/cards/OP06/characters/068-vinsmoke-reiju.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-068 Vinsmoke Reiju", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06VinsmokeReiju068);
  });
});
