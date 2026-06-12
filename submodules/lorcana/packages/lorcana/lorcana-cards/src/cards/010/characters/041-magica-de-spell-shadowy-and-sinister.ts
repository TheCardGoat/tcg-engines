import type { CharacterCard } from "@tcg/lorcana-types";
import { magicaDeSpellShadowyAndSinisterI18n } from "./041-magica-de-spell-shadowy-and-sinister.i18n";

export const magicaDeSpellShadowyAndSinister: CharacterCard = {
  id: "EI4",
  canonicalId: "ci_EI4",
  reprints: ["set10-041"],
  cardType: "character",
  name: "Magica De Spell",
  version: "Shadowy and Sinister",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 41,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6f5c4ee5c5ee4479be8ad253eb275033",
    tcgPlayer: 659459,
  },
  text: [
    {
      title: "DARK INCANTATION",
      description:
        "When you play this character, you may shuffle a card from chosen player's discard into their deck.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          intoDeck: "owner",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["discard"],
          },
          type: "shuffle-into-deck",
        },
        type: "optional",
      },
      id: "1l8-1",
      name: "DARK INCANTATION",
      text: "DARK INCANTATION When you play this character, you may shuffle a card from chosen player's discard into their deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: magicaDeSpellShadowyAndSinisterI18n,
};
