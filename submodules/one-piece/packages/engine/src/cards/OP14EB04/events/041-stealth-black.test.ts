import { describe, test } from "vite-plus/test";
import { op14eb04StealthBlack041 } from "../../../../../cards/src/cards/OP14EB04/events/041-stealth-black.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-041 Stealth Black", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04StealthBlack041);
  });
});
