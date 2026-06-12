import { describe, test } from "vite-plus/test";
import { op05BartholomewKuma011 } from "../../../../../cards/src/cards/OP05/characters/011-bartholomew-kuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-011 Bartholomew Kuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05BartholomewKuma011);
  });
});
