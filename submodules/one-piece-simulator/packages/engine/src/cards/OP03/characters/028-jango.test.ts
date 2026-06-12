import { describe, test } from "vite-plus/test";
import { op03Jango028 } from "../../../../../cards/src/cards/OP03/characters/028-jango.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-028 Jango", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Jango028);
  });
});
