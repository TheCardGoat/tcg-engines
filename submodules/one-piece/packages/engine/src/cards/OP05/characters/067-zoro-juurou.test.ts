import { describe, test } from "vite-plus/test";
import { op05ZoroJuurou067 } from "../../../../../cards/src/cards/OP05/characters/067-zoro-juurou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-067 Zoro-Juurou", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05ZoroJuurou067);
  });
});
