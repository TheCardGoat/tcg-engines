import { describe, test } from "vite-plus/test";
import { op05BunnyJoe013 } from "../../../../../cards/src/cards/OP05/characters/013-bunny-joe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-013 Bunny Joe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05BunnyJoe013);
  });
});
