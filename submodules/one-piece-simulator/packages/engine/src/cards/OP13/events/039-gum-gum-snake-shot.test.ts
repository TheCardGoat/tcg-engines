import { describe, test } from "vite-plus/test";
import { op13GumGumSnakeShot039 } from "../../../../../cards/src/cards/OP13/events/039-gum-gum-snake-shot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-039 Gum-Gum Snake Shot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13GumGumSnakeShot039);
  });
});
