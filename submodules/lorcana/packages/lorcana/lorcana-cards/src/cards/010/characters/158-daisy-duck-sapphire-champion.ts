import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckSapphireChampionI18n } from "./158-daisy-duck-sapphire-champion.i18n";

export const daisyDuckSapphireChampion: CharacterCard = {
  id: "CLU",
  canonicalId: "ci_CLU",
  reprints: ["set10-158"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Sapphire Champion",
  inkType: ["sapphire"],
  set: "010",
  cardNumber: 158,
  rarity: "rare",
  cost: 5,
  strength: 5,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a41add9515e547cb8273ba6973b125b4",
    tcgPlayer: 659630,
  },
  text: [
    {
      title: "STAND FAST",
      description: "Your other Sapphire characters gain Resist +1.",
    },
    {
      title: "LOOK AHEAD",
      description:
        "Whenever one of your other Sapphire characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "YOUR_OTHER_SAPPHIRE_CHARACTERS",
        type: "gain-keyword",
        value: 1,
      },
      id: "107-1",
      name: "STAND FAST",
      text: "STAND FAST Your other Sapphire characters gain Resist +1.",
      type: "static",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 1,
          destinations: [
            {
              zone: "deck-top",
              min: 0,
              max: 1,
            },
            {
              zone: "deck-bottom",
              remainder: true,
            },
          ],
        },
        type: "optional",
      },
      id: "107-2",
      name: "LOOK AHEAD",
      text: "LOOK AHEAD Whenever one of your other Sapphire characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      trigger: {
        event: "quest",
        on: "YOUR_OTHER_SAPPHIRE_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: daisyDuckSapphireChampionI18n,
};
