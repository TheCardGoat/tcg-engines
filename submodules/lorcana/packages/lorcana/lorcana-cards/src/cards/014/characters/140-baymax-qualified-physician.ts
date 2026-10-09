import type { CharacterCard } from "@tcg/lorcana-types";
import { baymaxQualifiedPhysicianI18n } from "./140-baymax-qualified-physician.i18n";

export const baymaxQualifiedPhysician: CharacterCard = {
  id: "y2o",
  canonicalId: "ci_y2o",
  slug: "lorcana-ci_y2o",
  printings: [
    {
      id: "set14-140",
      artId: "set14-140",
      setCode: "set14",
      collectorNumber: "140",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-140"],
  cardType: "character",
  name: "Baymax",
  version: "Qualified Physician",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 140,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b67c7d8bd4474a5791f646d30212bc96",
  },
  text: [
    {
      title: "MEDICAL ASSISTANCE",
      description: "Whenever this character quests, remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Super", "Hero", "Robot"],
  abilities: [
    {
      id: "baymax-physician-1",
      name: "MEDICAL ASSISTANCE",
      type: "triggered",
      text: "MEDICAL ASSISTANCE Whenever this character quests, remove up to 2 damage from chosen character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "remove-damage",
        amount: {
          type: "up-to",
          value: 2,
        },
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: baymaxQualifiedPhysicianI18n,
};
