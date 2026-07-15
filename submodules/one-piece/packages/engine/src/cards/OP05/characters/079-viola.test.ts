import { describe, test } from "vite-plus/test";
import { op05Viola079 } from "../../../../../cards/src/cards/OP05/characters/079-viola.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-079 Viola", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Viola079);
  });
});
