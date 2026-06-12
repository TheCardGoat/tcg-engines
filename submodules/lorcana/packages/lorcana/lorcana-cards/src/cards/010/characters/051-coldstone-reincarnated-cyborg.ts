import type { CharacterCard } from "@tcg/lorcana-types";
import { coldstoneReincarnatedCyborgI18n } from "./051-coldstone-reincarnated-cyborg.i18n";

export const coldstoneReincarnatedCyborg: CharacterCard = {
  id: "uHx",
  canonicalId: "ci_uHx",
  reprints: ["set10-051"],
  cardType: "character",
  name: "Coldstone",
  version: "Reincarnated Cyborg",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 51,
  rarity: "rare",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_988e3140d13242c5b38ba85e86702f91",
    tcgPlayer: 659762,
  },
  text: [
    {
      title: "THE CANTRIPS HAVE BEEN SPOKEN",
      description:
        "When you play this character, if you have 2 or more Gargoyle character cards in your discard, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Gargoyle"],
  abilities: [
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["discard"],
          cardType: "character",
          filters: [
            {
              type: "classification",
              classification: "Gargoyle",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "1uk-1",
      name: "THE CANTRIPS HAVE BEEN SPOKEN",
      text: "THE CANTRIPS HAVE BEEN SPOKEN When you play this character, if you have 2 or more Gargoyle character cards in your discard, gain 2 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: coldstoneReincarnatedCyborgI18n,
};
