import { describe, test } from "vite-plus/test";
import { op05UsoHachi061 } from "../../../../../cards/src/cards/OP05/characters/061-uso-hachi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-061 Uso-Hachi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05UsoHachi061);
  });
});
