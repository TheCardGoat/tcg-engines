import { describe, test } from "vite-plus/test";
import { op05Buffalo031 } from "../../../../../cards/src/cards/OP05/characters/031-buffalo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-031 Buffalo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Buffalo031);
  });
});
