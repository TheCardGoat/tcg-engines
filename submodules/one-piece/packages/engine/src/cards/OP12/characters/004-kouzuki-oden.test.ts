import { describe, test } from "vite-plus/test";
import { op12KouzukiOden004 } from "../../../../../cards/src/cards/OP12/characters/004-kouzuki-oden.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-004 Kouzuki Oden", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12KouzukiOden004);
  });
});
