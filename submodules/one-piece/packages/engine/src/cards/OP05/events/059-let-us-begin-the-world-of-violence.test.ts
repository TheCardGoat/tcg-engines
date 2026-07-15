import { describe, test } from "vite-plus/test";
import { op05LetUsBeginTheWorldOfViolence059 } from "../../../../../cards/src/cards/OP05/events/059-let-us-begin-the-world-of-violence.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-059 Let Us Begin the World of Violence!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05LetUsBeginTheWorldOfViolence059);
  });
});
