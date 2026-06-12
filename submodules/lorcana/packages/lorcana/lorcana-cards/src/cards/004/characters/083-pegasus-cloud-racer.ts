import type { CharacterCard } from "@tcg/lorcana-types";
import { pegasusCloudRacerI18n } from "./083-pegasus-cloud-racer.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { shift } from "../../../helpers/abilities/shift";

export const pegasusCloudRacer: CharacterCard = {
  id: "nia",
  canonicalId: "ci_nia",
  reprints: ["set4-083"],
  cardType: "character",
  name: "Pegasus",
  version: "Cloud Racer",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 83,
  rarity: "uncommon",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_618b8dca0fe24706aae51c2c75736dd9",
    tcgPlayer: 549387,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "Evasive",
    },
    {
      title: "HOP ON!",
      description:
        "When you play this character, if you used Shift to play him, your characters gain Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    shift(3),
    evasive,
    {
      condition: {
        type: "used-shift",
      },
      effect: {
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
        duration: "until-start-of-next-turn",
      },
      id: "1b8-3",
      name: "HOP ON!",
      text: "HOP ON! When you play this character, if you used Shift to play him, your characters gain Evasive until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: pegasusCloudRacerI18n,
};
