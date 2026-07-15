import { describe, test } from "vite-plus/test";
import { op05Amazon099 } from "../../../../../cards/src/cards/OP05/characters/099-amazon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-099 Amazon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Amazon099);
  });
});
