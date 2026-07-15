import { describe, test } from "vite-plus/test";
import { op14eb04DrHogback110 } from "../../../../../cards/src/cards/OP14EB04/characters/110-dr-hogback.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-110 Dr. Hogback", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04DrHogback110);
  });
});
