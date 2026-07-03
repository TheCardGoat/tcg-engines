import { describe, test } from "vite-plus/test";
import { op02KouzukiToki031 } from "../../../../../cards/src/cards/OP02/characters/031-kouzuki-toki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-031 Kouzuki Toki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02KouzukiToki031);
  });
});
