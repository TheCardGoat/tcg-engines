import { describe, test } from "vite-plus/test";
import { op03ToothAttack037 } from "../../../../../cards/src/cards/OP03/events/037-tooth-attack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-037 Tooth Attack", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03ToothAttack037);
  });
});
