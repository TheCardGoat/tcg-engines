import type { CharacterCard } from "@tcg/lorcana-types";
import { geniePowersUnleashedI18n } from "./076-genie-powers-unleashed.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { shift } from "../../../helpers/abilities/shift";

export const geniePowersUnleashed: CharacterCard = {
  id: "Mpt",
  canonicalId: "ci_Mpt",
  reprints: ["set1-076"],
  cardType: "character",
  name: "Genie",
  version: "Powers Unleashed",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 76,
  rarity: "rare",
  cost: 8,
  strength: 3,
  willpower: 5,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_976b70e13c194a6f8b955d7ea5307bbc",
    tcgPlayer: 508766,
  },
  text: [
    {
      title: "Shift 6",
    },
    {
      title: "Evasive",
    },
    {
      title: "PHENOMENAL COSMIC POWER!",
      description:
        "Whenever this character quests, you may play an action with cost 5 or less for free.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift("Genie", 6),
    evasive,
    {
      id: "dgz-3",
      name: "PHENOMENAL COSMIC POWER!",
      text: "PHENOMENAL COSMIC POWER! Whenever this character quests, you may play an action with cost 5 or less for free.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 5,
          },
          filter: {
            cardType: "action",
          },
        },
      },
    },
  ],
  i18n: geniePowersUnleashedI18n,
};
