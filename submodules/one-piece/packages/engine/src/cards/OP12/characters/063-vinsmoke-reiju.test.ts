import { describe, test } from "vite-plus/test";
import { op12VinsmokeReiju063 } from "../../../../../cards/src/cards/OP12/characters/063-vinsmoke-reiju.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-063 Vinsmoke Reiju", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12VinsmokeReiju063);
  });
});
