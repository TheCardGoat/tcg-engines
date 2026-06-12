import { describe, test } from "vite-plus/test";
import { op13KouzukiOden063 } from "../../../../../cards/src/cards/OP13/characters/063-kouzuki-oden.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-063 Kouzuki Oden", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13KouzukiOden063);
  });
});
