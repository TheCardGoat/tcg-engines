import { describe, test } from "vite-plus/test";
import { op05SaintMjosgard089 } from "../../../../../cards/src/cards/characters/op05-089-saint-mjosgard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-089 Saint Mjosgard", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05SaintMjosgard089);
  });
});
