import { describe, test } from "vite-plus/test";
import { op14eb04SpiderMice081 } from "../../../../../cards/src/cards/OP14EB04/characters/081-spider-mice.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-081 Spider Mice", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04SpiderMice081);
  });
});
