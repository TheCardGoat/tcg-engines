import { describe, test } from "vite-plus/test";
import { eb02Uuuuus058 } from "../../../../../cards/src/cards/EB02/events/058-uuuuus.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-058 UUUUUS!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Uuuuus058);
  });
});
