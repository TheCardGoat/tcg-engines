import { describe, test } from "vite-plus/test";
import { op05JohnGiant044 } from "../../../../../cards/src/cards/OP05/characters/044-john-giant.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-044 John Giant", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05JohnGiant044);
  });
});
