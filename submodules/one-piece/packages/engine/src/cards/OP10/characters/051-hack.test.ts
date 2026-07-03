import { describe, test } from "vite-plus/test";
import { op10Hack051 } from "../../../../../cards/src/cards/OP10/characters/051-hack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-051 Hack", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Hack051);
  });
});
