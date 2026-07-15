import { describe, test } from "vite-plus/test";
import { op12Kawamatsu023 } from "../../../../../cards/src/cards/OP12/characters/023-kawamatsu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-023 Kawamatsu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Kawamatsu023);
  });
});
