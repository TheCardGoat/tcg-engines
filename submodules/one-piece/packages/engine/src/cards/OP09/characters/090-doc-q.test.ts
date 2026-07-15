import { describe, test } from "vite-plus/test";
import { op09DocQ090 } from "../../../../../cards/src/cards/OP09/characters/090-doc-q.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-090 Doc Q", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09DocQ090);
  });
});
