import { describe, test } from "vite-plus/test";
import { op05Killer064 } from "../../../../../cards/src/cards/OP05/characters/064-killer.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-064 Killer", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Killer064);
  });
});
