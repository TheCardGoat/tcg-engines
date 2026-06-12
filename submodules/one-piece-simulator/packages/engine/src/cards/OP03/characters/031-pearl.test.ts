import { describe, test } from "vite-plus/test";
import { op03Pearl031 } from "../../../../../cards/src/cards/OP03/characters/031-pearl.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-031 Pearl", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Pearl031);
  });
});
