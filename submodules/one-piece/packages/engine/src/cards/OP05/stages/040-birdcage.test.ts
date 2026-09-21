import { describe, test } from "vite-plus/test";
import { op05Birdcage040 } from "../../../../../cards/src/cards/stages/op05-040-birdcage.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-040 Birdcage", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Birdcage040);
  });
});
