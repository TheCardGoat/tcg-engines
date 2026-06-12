import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckLivelyPirateI18n } from "./098-donald-duck-lively-pirate.i18n";

export const donaldDuckLivelyPirate: CharacterCard = {
  id: "z2w",
  canonicalId: "ci_z2w",
  reprints: ["set7-098"],
  cardType: "character",
  name: "Donald Duck",
  version: "Lively Pirate",
  inkType: ["emerald"],
  set: "007",
  cardNumber: 98,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_3c1ded27230c410bb3f454c406bab158",
    tcgPlayer: 619458,
  },
  text: [
    {
      title: "DUCK OF ACTION",
      description:
        "Whenever this character is challenged, you may return an action card that isn't a song card from your discard to your hand.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          filter: {
            cardType: "action",
            notCardType: "song",
          },
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      id: "17f-1",
      name: "DUCK OF ACTION",
      text: "DUCK OF ACTION Whenever this character is challenged, you may return an action card that isn't a song card from your discard to your hand.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: donaldDuckLivelyPirateI18n,
};
