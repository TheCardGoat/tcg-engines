import type { CharacterCard } from "@tcg/lorcana-types";
import { hydraDeadlySerpentI18n } from "./108-hydra-deadly-serpent.i18n";

export const hydraDeadlySerpent: CharacterCard = {
  id: "dZ8",
  canonicalId: "ci_dZ8",
  reprints: ["set3-108"],
  cardType: "character",
  name: "Hydra",
  version: "Deadly Serpent",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "003",
  cardNumber: 108,
  rarity: "legendary",
  cost: 6,
  strength: 6,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_f9025821a35c4cea9fd04182f7db5896",
    tcgPlayer: 539088,
  },
  text: [
    {
      title: "WATCH THE TEETH",
      description:
        "Whenever this character takes damage, deal that much damage to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      id: "dZ8-1",
      name: "WATCH THE TEETH",
      text: "WATCH THE TEETH Whenever this character takes damage, deal that much damage to chosen opposing character.",
      trigger: {
        event: "damage",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        amount: {
          type: "trigger-amount",
        },
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      type: "triggered",
    },
  ],
  i18n: hydraDeadlySerpentI18n,
};
