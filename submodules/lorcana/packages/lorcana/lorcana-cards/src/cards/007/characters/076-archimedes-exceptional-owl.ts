import type { CharacterCard } from "@tcg/lorcana-types";
import { archimedesExceptionalOwlI18n } from "./076-archimedes-exceptional-owl.i18n";

export const archimedesExceptionalOwl: CharacterCard = {
  id: "8Al",
  canonicalId: "ci_8Al",
  reprints: ["set7-076"],
  cardType: "character",
  name: "Archimedes",
  version: "Exceptional Owl",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "007",
  cardNumber: 76,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_35cac934c7154962803cd87c1d34e32a",
    tcgPlayer: 618700,
  },
  text: [
    {
      title: "MORE TO LEARN",
      description:
        "Whenever an opponent chooses this character for an action or ability, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "crp-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "MORE TO LEARN",
      trigger: {
        event: "be-chosen",
        on: "SELF",
        timing: "whenever",
        sourceFilter: {
          sourceController: "opponent",
        },
      },
      type: "triggered",
      text: "MORE TO LEARN Whenever an opponent chooses this character for an action or ability, you may draw a card.",
    },
  ],
  i18n: archimedesExceptionalOwlI18n,
};
