import type { LocationCard } from "@tcg/lorcana-types";
import { duckburgFunsosFunzoneI18n } from "./034-duckburg-funsos-funzone.i18n";

export const duckburgFunsosFunzone: LocationCard = {
  id: "Skh",
  canonicalId: "ci_Skh",
  reprints: ["set10-034"],
  cardType: "location",
  name: "Duckburg",
  version: "Funso’s Funzone",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 34,
  rarity: "rare",
  cost: 2,
  willpower: 6,
  moveCost: 2,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_516d19ec66bf46689607d453ce6f267d",
    tcgPlayer: 660034,
  },
  text: [
    {
      title: "WHERE FUN IS IN THE ZONE",
      description:
        "Whenever a character quests while here, you pay 2 less for the next character you play this turn.",
    },
  ],
  abilities: [
    {
      effect: {
        amount: 2,
        cardType: "character",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "bzp-1",
      name: "WHERE FUN IS IN THE ZONE",
      text: "WHERE FUN IS IN THE ZONE Whenever a character quests while here, you pay 2 less for the next character you play this turn.",
      trigger: {
        event: "quest",
        on: "CHARACTERS_HERE",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: duckburgFunsosFunzoneI18n,
};
