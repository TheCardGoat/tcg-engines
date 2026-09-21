import { describe, test } from "vite-plus/test";
import { op02KouzukiOden030 } from "../../../../../cards/src/cards/characters/op02-030-kouzuki-oden.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-030 Kouzuki Oden", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02KouzukiOden030);
  });
});
