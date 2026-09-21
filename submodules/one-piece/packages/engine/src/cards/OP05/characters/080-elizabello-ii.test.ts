import { describe, test } from "vite-plus/test";
import { op05ElizabelloIi080 } from "../../../../../cards/src/cards/characters/op05-080-elizabello-ii.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-080 Elizabello II", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05ElizabelloIi080);
  });
});
