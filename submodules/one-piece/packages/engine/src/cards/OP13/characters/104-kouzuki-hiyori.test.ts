import { describe, test } from "vite-plus/test";
import { op13KouzukiHiyori104 } from "../../../../../cards/src/cards/OP13/characters/104-kouzuki-hiyori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-104 Kouzuki Hiyori", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13KouzukiHiyori104);
  });
});
