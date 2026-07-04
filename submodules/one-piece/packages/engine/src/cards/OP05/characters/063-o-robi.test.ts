import { describe, test } from "vite-plus/test";
import { op05ORobi063 } from "../../../../../cards/src/cards/OP05/characters/063-o-robi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-063 O-Robi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05ORobi063);
  });
});
