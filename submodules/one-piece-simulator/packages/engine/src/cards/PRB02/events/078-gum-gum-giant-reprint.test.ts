import { describe, test } from "vite-plus/test";
import { prb02GumGumGiantReprint078 } from "../../../../../cards/src/cards/PRB02/events/078-gum-gum-giant-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-078 Gum-Gum Giant (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02GumGumGiantReprint078);
  });
});
