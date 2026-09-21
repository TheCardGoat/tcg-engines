import { describe, test } from "vite-plus/test";
import { op02KouzukiToki031 } from "../../../../../cards/src/cards/characters/op02-031-kouzuki-toki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-031 Kouzuki Toki", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02KouzukiToki031);
  });
});
