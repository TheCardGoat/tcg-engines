import { describe, test } from "vite-plus/test";
import { op05ONami062 } from "../../../../../cards/src/cards/OP05/characters/062-o-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-062 O-Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05ONami062);
  });
});
