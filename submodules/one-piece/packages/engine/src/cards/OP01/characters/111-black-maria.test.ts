import { describe, test } from "vite-plus/test";
import { op01BlackMaria111 } from "../../../../../cards/src/cards/OP01/characters/111-black-maria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-111 Black Maria", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01BlackMaria111);
  });
});
