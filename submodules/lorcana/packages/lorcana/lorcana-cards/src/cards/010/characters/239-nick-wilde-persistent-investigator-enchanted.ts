import type { CharacterCard } from "@tcg/lorcana-types";
import { nickWildePersistentInvestigatorEnchantedI18n } from "./239-nick-wilde-persistent-investigator-enchanted.i18n";

export const nickWildePersistentInvestigatorEnchanted: CharacterCard = {
  id: "Pby",
  canonicalId: "ci_YpV",
  slug: "lorcana-ci_YpV",
  printings: [
    {
      id: "set10-239-enchanted",
      artId: "ci_YpV-enchanted",
      setCode: "set10",
      collectorNumber: "239",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set10-187"],
  cardType: "character",
  name: "Nick Wilde",
  version: "Persistent Investigator",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 239,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_8a558015ad0948f5be96f85dc60b3c76",
    tcgPlayer: "660030",
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "CASE CLOSED",
      description:
        "During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Detective"],
  abilities: [
    {
      id: "17t-1",
      cost: {
        ink: 3,
      },
      keyword: "Shift",
      type: "keyword",
      text: "Shift 3 {I}",
    },
    {
      id: "17t-2",
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "CASE CLOSED",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Detective",
        },
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
      text: "CASE CLOSED During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.",
    },
  ],
  i18n: nickWildePersistentInvestigatorEnchantedI18n,
};
