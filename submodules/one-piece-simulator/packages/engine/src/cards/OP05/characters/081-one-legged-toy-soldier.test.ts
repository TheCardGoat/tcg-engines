import { describe, test } from "vite-plus/test";
import { op05OneLeggedToySoldier081 } from "../../../../../cards/src/cards/OP05/characters/081-one-legged-toy-soldier.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-081 One-Legged Toy Soldier", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05OneLeggedToySoldier081);
  });
});
