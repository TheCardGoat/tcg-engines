import { describe, test } from "vite-plus/test";
import { op09GumGumGiant078 } from "../../../../../cards/src/cards/OP09/events/078-gum-gum-giant.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-078 Gum-Gum Giant", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09GumGumGiant078);
  });
});
