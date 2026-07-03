import { describe, test } from "vite-plus/test";
import { op05MaryGeoise097 } from "../../../../../cards/src/cards/OP05/stages/097-mary-geoise.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-097 Mary Geoise", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05MaryGeoise097);
  });
});
