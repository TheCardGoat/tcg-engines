import { describe, test } from "vite-plus/test";
import { op05SaintRosward092 } from "../../../../../cards/src/cards/OP05/characters/092-saint-rosward.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-092 Saint Rosward", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05SaintRosward092);
  });
});
