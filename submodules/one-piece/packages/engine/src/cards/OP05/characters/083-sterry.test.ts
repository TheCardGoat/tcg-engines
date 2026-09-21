import { describe, test } from "vite-plus/test";
import { op05Sterry083 } from "../../../../../cards/src/cards/characters/op05-083-sterry.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-083 Sterry", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Sterry083);
  });
});
