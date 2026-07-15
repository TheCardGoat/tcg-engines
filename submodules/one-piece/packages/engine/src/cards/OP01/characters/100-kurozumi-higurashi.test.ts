import { describe, test } from "vite-plus/test";
import { op01KurozumiHigurashi100 } from "../../../../../cards/src/cards/OP01/characters/100-kurozumi-higurashi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-100 Kurozumi Higurashi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01KurozumiHigurashi100);
  });
});
