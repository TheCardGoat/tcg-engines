import { describe, test } from "vite-plus/test";
import { op07BigBun070 } from "../../../../../cards/src/cards/characters/op07-070-big-bun.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-070 Big Bun", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07BigBun070);
  });
});
