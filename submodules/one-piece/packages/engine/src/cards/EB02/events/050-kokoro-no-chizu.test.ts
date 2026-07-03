import { describe, test } from "vite-plus/test";
import { eb02KokoroNoChizu050 } from "../../../../../cards/src/cards/EB02/events/050-kokoro-no-chizu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-050 Kokoro no Chizu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02KokoroNoChizu050);
  });
});
