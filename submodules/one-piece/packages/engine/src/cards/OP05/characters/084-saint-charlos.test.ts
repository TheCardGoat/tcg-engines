import { describe, test } from "vite-plus/test";
import { op05SaintCharlos084 } from "../../../../../cards/src/cards/characters/op05-084-saint-charlos.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-084 Saint Charlos", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05SaintCharlos084);
  });
});
