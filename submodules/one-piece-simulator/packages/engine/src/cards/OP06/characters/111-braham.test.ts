import { describe, test } from "vite-plus/test";
import { op06Braham111 } from "../../../../../cards/src/cards/OP06/characters/111-braham.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-111 Braham", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Braham111);
  });
});
