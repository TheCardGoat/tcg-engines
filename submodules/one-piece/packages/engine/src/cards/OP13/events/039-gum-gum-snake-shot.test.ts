import { describe, test } from "vite-plus/test";
import { op13GumGumSnakeShot039 } from "../../../../../cards/src/cards/events/op13-039-gum-gum-snake-shot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-039 Gum-Gum Snake Shot", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13GumGumSnakeShot039);
  });
});
