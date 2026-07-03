import type { CharacterCard } from "@tcg/lorcana-types";
import { genieHardToGraspI18n } from "./045-genie-hard-to-grasp.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const genieHardToGrasp: CharacterCard = {
  id: "xGR",
  canonicalId: "ci_xGR",
  slug: "lorcana-ci_xGR",
  printings: [
    {
      id: "set13-045",
      artId: "set13-045",
      setCode: "set13",
      collectorNumber: "45",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-045"],
  cardType: "character",
  name: "Genie",
  version: "Hard to Grasp",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "013",
  cardNumber: 45,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fbd50cee68644238a38bb3dc1e2a13fb",
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: genieHardToGraspI18n,
};
