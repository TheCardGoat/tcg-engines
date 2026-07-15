import { describe, test } from "vite-plus/test";
import { op06Hyouzou034 } from "../../../../../cards/src/cards/OP06/characters/034-hyouzou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-034 Hyouzou", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Hyouzou034);
  });
});
