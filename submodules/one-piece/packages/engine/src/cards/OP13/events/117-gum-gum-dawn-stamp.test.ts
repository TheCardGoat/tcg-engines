import { describe, test } from "vite-plus/test";
import { op13GumGumDawnStamp117 } from "../../../../../cards/src/cards/OP13/events/117-gum-gum-dawn-stamp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-117 Gum-Gum Dawn Stamp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13GumGumDawnStamp117);
  });
});
