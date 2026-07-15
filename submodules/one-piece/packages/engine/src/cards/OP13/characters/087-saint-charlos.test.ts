import { describe, test } from "vite-plus/test";
import { op13SaintCharlos087 } from "../../../../../cards/src/cards/OP13/characters/087-saint-charlos.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-087 Saint Charlos", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13SaintCharlos087);
  });
});
