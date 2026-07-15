import { describe, test } from "vite-plus/test";
import { prb02ComeOnWeLlFightYouManga020 } from "../../../../../cards/src/cards/PRB02/events/020-come-on-we-ll-fight-you-manga.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-020 Come On!! We'll Fight You!! (Manga)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ComeOnWeLlFightYouManga020);
  });
});
