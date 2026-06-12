import type { CharacterCard } from "@tcg/lorcana-types";
import { cubbyMightyLostBoyI18n } from "./069-cubby-mighty-lost-boy.i18n";

export const cubbyMightyLostBoy: CharacterCard = {
  id: "3Fn",
  canonicalId: "ci_3Fn",
  reprints: ["set3-069"],
  cardType: "character",
  name: "Cubby",
  version: "Mighty Lost Boy",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 69,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1406e73a81ad4687ad3e502447d21287",
    tcgPlayer: 537945,
  },
  text: [
    {
      title: "THE BEAR",
      description: "Whenever this character moves to a location, he gets +3 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 3,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1y3-1",
      name: "THE BEAR",
      text: "THE BEAR Whenever this character moves to a location, he gets +3 {S} this turn.",
      trigger: {
        event: "move",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: cubbyMightyLostBoyI18n,
};
