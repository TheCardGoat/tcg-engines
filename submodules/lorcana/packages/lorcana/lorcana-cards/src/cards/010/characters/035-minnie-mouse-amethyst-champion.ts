import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseAmethystChampionI18n } from "./035-minnie-mouse-amethyst-champion.i18n";

export const minnieMouseAmethystChampion: CharacterCard = {
  id: "8af",
  canonicalId: "ci_8af",
  reprints: ["set10-035"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Amethyst Champion",
  inkType: ["amethyst"],
  set: "010",
  cardNumber: 35,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7667c79b34784802930a659a5c904ccf",
    tcgPlayer: 659760,
  },
  text: [
    {
      title: "MYSTICAL BALANCE",
      description:
        "Whenever one of your other Amethyst characters is banished in a challenge, you may draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "1kv-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "MYSTICAL BALANCE",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_AMETHYST_CHARACTERS",
        restrictions: [
          {
            type: "in-challenge",
          },
        ],
      },
      type: "triggered",
      text: "MYSTICAL BALANCE Whenever one of your other Amethyst characters is banished in a challenge, you may draw a card.",
    },
  ],
  i18n: minnieMouseAmethystChampionI18n,
};
