import { describe, test } from "vite-plus/test";
import { op12Sengoku047 } from "../../../../../cards/src/cards/OP12/characters/047-sengoku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-047 Sengoku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Sengoku047);
  });
});
