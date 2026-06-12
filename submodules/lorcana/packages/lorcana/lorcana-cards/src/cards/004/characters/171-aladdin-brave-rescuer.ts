import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinBraveRescuerI18n } from "./171-aladdin-brave-rescuer.i18n";

export const aladdinBraveRescuer: CharacterCard = {
  id: "KQ7",
  canonicalId: "ci_KQ7",
  reprints: ["set4-171"],
  cardType: "character",
  name: "Aladdin",
  version: "Brave Rescuer",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "004",
  cardNumber: 171,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2e7bad8041bf496fad79f3ad42a4fd89",
    tcgPlayer: 547768,
  },
  text: [
    {
      title: "Shift: Discard a location card",
      description:
        "(You may discard a location card to play this on top of one of your characters named Aladdin.)",
    },
    {
      title: "CRASHING THROUGH",
      description: "Whenever this character quests, you may banish chosen item.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    {
      type: "keyword",
      keyword: "Shift",
      cost: {
        discardCards: 1,
        discardCardType: "location",
      },
      shiftTarget: "Aladdin",
      text: "Shift: Discard a location card (You may discard a location card to play this on top of one of your characters named Aladdin.)",
    },
    {
      id: "KQ7-2",
      type: "triggered",
      name: "CRASHING THROUGH",
      text: "CRASHING THROUGH Whenever this character quests, you may banish chosen item.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "banish",
          target: "CHOSEN_ITEM",
        },
      },
    },
  ],
  i18n: aladdinBraveRescuerI18n,
};
