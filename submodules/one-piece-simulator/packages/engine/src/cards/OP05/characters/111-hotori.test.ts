import { describe, test } from "vite-plus/test";
import { op05Hotori111 } from "../../../../../cards/src/cards/OP05/characters/111-hotori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-111 Hotori", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Hotori111);
  });
});
