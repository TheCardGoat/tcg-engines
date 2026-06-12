import type { CharacterCard } from "@tcg/lorcana-types";
import { meridaFormidableArcherI18n } from "./191-merida-formidable-archer.i18n";

export const meridaFormidableArcher: CharacterCard = {
  id: "m1s",
  canonicalId: "ci_m1s",
  reprints: ["set12-191"],
  cardType: "character",
  name: "Merida",
  version: "Formidable Archer",
  inkType: ["steel"],
  franchise: "Brave",
  set: "012",
  cardNumber: 191,
  rarity: "legendary",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_4811e7317e3149db966bab69151147cc",
  },
  text: [
    {
      title: "FULL QUIVER",
      description:
        "When you play this character, you may return an action card named Three Arrows from your discard to your hand.",
    },
    {
      title: "STEADY AIM",
      description:
        "Whenever one of your actions deals damage to an opposing character, deal 2 damage to that character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "0Eq-1",
      name: "FULL QUIVER",
      type: "triggered",
      text: "FULL QUIVER When you play this character, you may return an action card named Three Arrows from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-from-discard",
          cardType: "action",
          cardName: "Three Arrows",
          destination: "hand",
          target: "CONTROLLER",
        },
      },
    },
    {
      id: "0Eq-2",
      name: "STEADY AIM",
      type: "triggered",
      text: "STEADY AIM Whenever one of your actions deals damage to an opposing character, deal 2 damage to that character.",
      trigger: {
        event: "deal-damage",
        on: {
          controller: "opponent",
          cardType: "character",
        },
        timing: "whenever",
        sourceFilter: {
          cardType: ["action"],
          sourceController: "you",
        },
      },
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          ref: "trigger-subject",
        },
      },
    },
  ],
  i18n: meridaFormidableArcherI18n,
};
