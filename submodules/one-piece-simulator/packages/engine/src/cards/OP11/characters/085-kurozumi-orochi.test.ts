import { describe, test } from "vite-plus/test";
import { op11KurozumiOrochi085 } from "../../../../../cards/src/cards/OP11/characters/085-kurozumi-orochi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-085 Kurozumi Orochi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11KurozumiOrochi085);
  });
});
