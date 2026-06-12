import { describe, test } from "vite-plus/test";
import { op05SaintCharlos084 } from "../../../../../cards/src/cards/OP05/characters/084-saint-charlos.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-084 Saint Charlos", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05SaintCharlos084);
  });
});
