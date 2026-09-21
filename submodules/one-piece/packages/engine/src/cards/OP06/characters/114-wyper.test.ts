import { describe, test } from "vite-plus/test";
import { op06Wyper114 } from "../../../../../cards/src/cards/characters/op06-114-wyper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-114 Wyper", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Wyper114);
  });
});
