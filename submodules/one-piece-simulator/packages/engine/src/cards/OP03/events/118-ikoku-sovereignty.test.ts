import { describe, test } from "vite-plus/test";
import { op03IkokuSovereignty118 } from "../../../../../cards/src/cards/OP03/events/118-ikoku-sovereignty.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-118 Ikoku Sovereignty", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03IkokuSovereignty118);
  });
});
