import { describe, test } from "vite-plus/test";
import { op05Hack012 } from "../../../../../cards/src/cards/OP05/characters/012-hack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-012 Hack", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Hack012);
  });
});
