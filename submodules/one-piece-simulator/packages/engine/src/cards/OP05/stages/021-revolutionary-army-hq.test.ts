import { describe, test } from "vite-plus/test";
import { op05RevolutionaryArmyHq021 } from "../../../../../cards/src/cards/OP05/stages/021-revolutionary-army-hq.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-021 Revolutionary Army HQ", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05RevolutionaryArmyHq021);
  });
});
