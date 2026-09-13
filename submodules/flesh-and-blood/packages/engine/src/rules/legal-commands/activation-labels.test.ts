import { describe, expect, it } from "vite-plus/test";
import { bravoShowstopper } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo-showstopper";
import { bravoShowstopperI18n } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo-showstopper.i18n";
import { rhinarRecklessRampage } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar-reckless-rampage";
import { rhinarRecklessRampageI18n } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar-reckless-rampage.i18n";
import { localizeFleshAndBloodCard } from "../../../../cards/src/localization.ts";
import { listLegalCommands } from "../../automation/legal-commands.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";

describe("activation labels", () => {
  it("keeps the effect and go again readable beyond the former 48-character cutoff", () => {
    const bravo = localizeFleshAndBloodCard(bravoShowstopper, bravoShowstopperI18n);
    const rhinar = localizeFleshAndBloodCard(rhinarRecklessRampage, rhinarRecklessRampageI18n);
    const game = FabTestEngine.start(
      { hero: bravo, resourcePoints: 2, deck: 6 },
      { hero: rhinar, deck: 6 },
      { autoPassPriority: false },
    );
    const activation = listLegalCommands(game.getRuntime(), game.as(bravo).id).find(
      (command) => command.move === "activate",
    );
    expect(activation?.label).toMatch(/dominate/i);
    expect(activation?.label).toMatch(/go again/i);
  });
});
