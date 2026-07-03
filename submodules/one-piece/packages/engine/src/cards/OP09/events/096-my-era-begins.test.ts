import { describe, test } from "vite-plus/test";
import { op09MyEraBegins096 } from "../../../../../cards/src/cards/OP09/events/096-my-era-begins.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-096 My Era...Begins!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09MyEraBegins096);
  });
});
