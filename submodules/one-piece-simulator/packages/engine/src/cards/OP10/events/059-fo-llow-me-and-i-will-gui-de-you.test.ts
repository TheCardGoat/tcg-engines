import { describe, test } from "vite-plus/test";
import { op10FoLlowMeAndIWillGuiDeYou059 } from "../../../../../cards/src/cards/OP10/events/059-fo-llow-me-and-i-will-gui-de-you.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-059 Fo...llow...Me...and...I...Will...Gui...de...You", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10FoLlowMeAndIWillGuiDeYou059);
  });
});
