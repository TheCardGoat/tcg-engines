import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckSecretAgentI18n } from "./076-daisy-duck-secret-agent.i18n";

export const daisyDuckSecretAgent: CharacterCard = {
  id: "2mw",
  canonicalId: "ci_BEH",
  reprints: ["set2-076", "set9-093"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Secret Agent",
  inkType: ["emerald"],
  set: "002",
  cardNumber: 76,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2da1b21d6bdc4b29b5e04bacfa14eded",
    tcgPlayer: 650032,
  },
  text: [
    {
      title: "THWART",
      description: "Whenever this character quests, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      id: "1wn-1",
      name: "THWART",
      text: "THWART Whenever this character quests, each opponent chooses and discards a card.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: daisyDuckSecretAgentI18n,
};
