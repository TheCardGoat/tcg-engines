import { describe, test } from "vite-plus/test";
import { op05ORobi063 } from "../../../../../cards/src/cards/characters/op05-063-o-robi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-063 O-Robi", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05ORobi063);
  });
});
