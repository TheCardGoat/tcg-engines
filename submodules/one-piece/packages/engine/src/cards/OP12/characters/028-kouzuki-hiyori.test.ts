import { describe, test } from "vite-plus/test";
import { op12KouzukiHiyori028 } from "../../../../../cards/src/cards/OP12/characters/028-kouzuki-hiyori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-028 Kouzuki Hiyori", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12KouzukiHiyori028);
  });
});
