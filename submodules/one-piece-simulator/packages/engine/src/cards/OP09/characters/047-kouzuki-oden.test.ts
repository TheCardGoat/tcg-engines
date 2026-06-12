import { describe, test } from "vite-plus/test";
import { op09KouzukiOden047 } from "../../../../../cards/src/cards/OP09/characters/047-kouzuki-oden.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-047 Kouzuki Oden", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09KouzukiOden047);
  });
});
