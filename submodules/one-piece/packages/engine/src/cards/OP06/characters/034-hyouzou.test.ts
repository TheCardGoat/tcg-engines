import { describe, test } from "vite-plus/test";
import { op06Hyouzou034 } from "../../../../../cards/src/cards/characters/op06-034-hyouzou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-034 Hyouzou", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Hyouzou034);
  });
});
