import { describe, test } from "vite-plus/test";
import { op06Raizo112 } from "../../../../../cards/src/cards/characters/op06-112-raizo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-112 Raizo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Raizo112);
  });
});
