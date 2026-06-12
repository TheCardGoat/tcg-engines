import type { CharacterCard } from "@tcg/lorcana-types";
import { helgaSinclairNoBackupNeededI18n } from "./073-helga-sinclair-no-backup-needed.i18n";

export const helgaSinclairNoBackupNeeded: CharacterCard = {
  id: "A1F",
  canonicalId: "ci_A1F",
  reprints: ["set12-073"],
  cardType: "character",
  name: "Helga Sinclair",
  version: "No Backup Needed",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 73,
  rarity: "common",
  cost: 4,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e740021277ed4be3848dadea5db10bb6",
  },
  text: [
    {
      title: "CRISIS MANAGEMENT",
      description:
        "If 2 or more cards were put into your discard this turn, you pay 2 {I} less to play this character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      id: "A1F-1",
      name: "CRISIS MANAGEMENT",
      type: "static",
      text: "CRISIS MANAGEMENT If 2 or more cards were put into your discard this turn, you pay 2 {I} less to play this character.",
      sourceZones: ["hand"],
      condition: {
        type: "turn-metric",
        metric: "discard-cards-entered",
        ownerScope: "you",
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      effect: {
        type: "cost-reduction",
        amount: 2,
        cardType: "character",
      },
    },
  ],
  i18n: helgaSinclairNoBackupNeededI18n,
};
