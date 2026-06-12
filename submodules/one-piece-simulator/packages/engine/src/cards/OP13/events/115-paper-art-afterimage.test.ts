import { describe, test } from "vite-plus/test";
import { op13PaperArtAfterimage115 } from "../../../../../cards/src/cards/OP13/events/115-paper-art-afterimage.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-115 Paper Art Afterimage", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13PaperArtAfterimage115);
  });
});
