import { describe, test } from "vite-plus/test";
import { op06Wyper114 } from "../../../../../cards/src/cards/OP06/characters/114-wyper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-114 Wyper", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Wyper114);
  });
});
