import { describe, test } from "vite-plus/test";
import { op13SaintRosward095 } from "../../../../../cards/src/cards/OP13/characters/095-saint-rosward.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-095 Saint Rosward", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13SaintRosward095);
  });
});
