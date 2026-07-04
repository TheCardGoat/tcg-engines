import { describe, test } from "vite-plus/test";
import { op08Heliceratops097 } from "../../../../../cards/src/cards/OP08/events/097-heliceratops.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-097 Heliceratops", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Heliceratops097);
  });
});
