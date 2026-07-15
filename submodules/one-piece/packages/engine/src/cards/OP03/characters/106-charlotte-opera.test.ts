import { describe, test } from "vite-plus/test";
import { op03CharlotteOpera106 } from "../../../../../cards/src/cards/OP03/characters/106-charlotte-opera.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-106 Charlotte Opera", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03CharlotteOpera106);
  });
});
