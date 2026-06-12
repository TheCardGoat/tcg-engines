import { describe, test } from "vite-plus/test";
import { op12Jango045 } from "../../../../../cards/src/cards/OP12/characters/045-jango.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-045 Jango", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Jango045);
  });
});
