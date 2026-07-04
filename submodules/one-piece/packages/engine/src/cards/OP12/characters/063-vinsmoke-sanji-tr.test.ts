import { describe, test } from "vite-plus/test";
import { op12VinsmokeSanjiTr063 } from "../../../../../cards/src/cards/OP12/characters/063-vinsmoke-sanji-tr.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-063 Vinsmoke Sanji (TR)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12VinsmokeSanjiTr063);
  });
});
