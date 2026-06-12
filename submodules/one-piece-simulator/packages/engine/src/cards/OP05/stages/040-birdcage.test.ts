import { describe, test } from "vite-plus/test";
import { op05Birdcage040 } from "../../../../../cards/src/cards/OP05/stages/040-birdcage.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-040 Birdcage", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Birdcage040);
  });
});
