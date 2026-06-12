import { describe, test } from "vite-plus/test";
import { op02KouzukiOden030 } from "../../../../../cards/src/cards/OP02/characters/030-kouzuki-oden.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-030 Kouzuki Oden", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02KouzukiOden030);
  });
});
