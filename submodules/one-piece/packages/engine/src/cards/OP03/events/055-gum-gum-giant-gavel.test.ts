import { describe, test } from "vite-plus/test";
import { op03GumGumGiantGavel055 } from "../../../../../cards/src/cards/OP03/events/055-gum-gum-giant-gavel.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-055 Gum-Gum Giant Gavel", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03GumGumGiantGavel055);
  });
});
