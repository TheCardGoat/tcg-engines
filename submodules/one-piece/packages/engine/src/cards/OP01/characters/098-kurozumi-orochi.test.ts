import { describe, test } from "vite-plus/test";
import { op01KurozumiOrochi098 } from "../../../../../cards/src/cards/OP01/characters/098-kurozumi-orochi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-098 Kurozumi Orochi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01KurozumiOrochi098);
  });
});
