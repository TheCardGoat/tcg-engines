import { describe, test } from "vite-plus/test";
import { op13TheFiveEldersAreAtYourService096 } from "../../../../../cards/src/cards/OP13/events/096-the-five-elders-are-at-your-service.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-096 The Five Elders Are at Your Service!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13TheFiveEldersAreAtYourService096);
  });
});
