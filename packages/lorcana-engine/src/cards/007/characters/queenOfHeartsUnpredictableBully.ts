import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { putDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";

export const queenOfHeartsUnpredictableBully: LorcanitoCharacterCard = {
  id: "mky",
  name: "Queen Of Hearts",
  title: "Unpredictable Bully",
  characteristics: ["floodborn", "villain", "queen"],
  text: "Shift 3\nIF I LOSE MY TEMPER… Whenever another character is played, put a damage counter on them.",
  type: "character",
  abilities: [
    shiftAbility(3, "Queen Of Hearts"),
    wheneverPlays({
      name: "IF I LOSE MY TEMPER…",
      text: "Whenever another character is played, put a damage counter on them.",
      excludeSelf: true,
      triggerTarget: {
        type: "card",
        excludeSelf: true,
        value: 1,
        filters: [{ filter: "type", value: "character" }],
      },
      effects: [
        putDamageEffect(1, {
          type: "card",
          value: "all",
          filters: [{ filter: "trigger", value: "target" }],
        }),
      ],
    }),
  ],
  inkwell: false,
  // @ts-expect-error
  color: "",
  colors: ["emerald", "ruby"],
  cost: 5,
  strength: 2,
  willpower: 6,
  illustrator: "Alice Pisoni",
  number: 95,
  set: "007",
  rarity: "super_rare",
  lore: 2,
};
