import { describe, test } from "vite-plus/test";
import { op13SaintMjosgard092 } from "../../../../../cards/src/cards/OP13/characters/092-saint-mjosgard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-092 Saint Mjosgard", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13SaintMjosgard092);
  });
});
