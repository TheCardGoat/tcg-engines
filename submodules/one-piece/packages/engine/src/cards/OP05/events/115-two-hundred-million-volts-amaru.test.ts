import { describe, test } from "vite-plus/test";
import { op05TwoHundredMillionVoltsAmaru115 } from "../../../../../cards/src/cards/events/op05-115-two-hundred-million-volts-amaru.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-115 Two-Hundred Million Volts Amaru", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05TwoHundredMillionVoltsAmaru115);
  });
});
