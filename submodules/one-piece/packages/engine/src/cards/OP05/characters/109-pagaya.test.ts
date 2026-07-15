import { describe, test } from "vite-plus/test";
import { op05Pagaya109 } from "../../../../../cards/src/cards/OP05/characters/109-pagaya.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-109 Pagaya", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Pagaya109);
  });
});
