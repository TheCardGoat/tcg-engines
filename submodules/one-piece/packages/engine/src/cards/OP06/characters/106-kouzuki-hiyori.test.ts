import { describe, test } from "vite-plus/test";
import { op06KouzukiHiyori106 } from "../../../../../cards/src/cards/OP06/characters/106-kouzuki-hiyori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-106 Kouzuki Hiyori", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06KouzukiHiyori106);
  });
});
