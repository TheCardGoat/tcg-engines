import { describe, test } from "vite-plus/test";
import { op12VinsmokeSora062 } from "../../../../../cards/src/cards/OP12/characters/062-vinsmoke-sora.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-062 Vinsmoke Sora", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12VinsmokeSora062);
  });
});
