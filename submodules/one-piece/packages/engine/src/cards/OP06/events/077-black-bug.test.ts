import { describe, test } from "vite-plus/test";
import { op06BlackBug077 } from "../../../../../cards/src/cards/OP06/events/077-black-bug.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-077 Black Bug", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06BlackBug077);
  });
});
