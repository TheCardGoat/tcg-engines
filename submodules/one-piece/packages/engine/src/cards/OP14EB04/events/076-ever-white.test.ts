import { describe, test } from "vite-plus/test";
import { op14eb04EverWhite076 } from "../../../../../cards/src/cards/OP14EB04/events/076-ever-white.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-076 Ever White", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04EverWhite076);
  });
});
