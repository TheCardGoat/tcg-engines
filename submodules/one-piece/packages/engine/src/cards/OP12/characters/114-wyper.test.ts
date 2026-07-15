import { describe, test } from "vite-plus/test";
import { op12Wyper114 } from "../../../../../cards/src/cards/OP12/characters/114-wyper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-114 Wyper", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Wyper114);
  });
});
