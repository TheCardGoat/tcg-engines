import { describe, test } from "vite-plus/test";
import { op05SaintMjosgard089 } from "../../../../../cards/src/cards/OP05/characters/089-saint-mjosgard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-089 Saint Mjosgard", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05SaintMjosgard089);
  });
});
