import { describe, test } from "vite-plus/test";
import { op05RevolutionaryArmyHq021 } from "../../../../../cards/src/cards/stages/op05-021-revolutionary-army-hq.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-021 Revolutionary Army HQ", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05RevolutionaryArmyHq021);
  });
});
