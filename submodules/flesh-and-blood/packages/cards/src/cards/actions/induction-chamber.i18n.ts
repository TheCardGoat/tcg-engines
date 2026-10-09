import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { inductionChamber } from "./induction-chamber.ts";

export const inductionChamberI18n = defineFamilyI18n(inductionChamber, {
  en: {
    name: "Induction Chamber",
    text: "Action - {r}: If there are no steam counters on Induction Chamber, put a steam counter on it. Go again\nOnce per Turn Attack Reaction - Remove a steam counter from Induction Chamber: Target Mechanologist pistol attack gains go again.",
    typeText: "Mechanologist Action - Item",
    abilities: {
      actionResourceThereNoSteamCountersInductionChamberPutSteamCounterGoAgain: {
        displayName: "Add a steam counter",
      },
      oncePerTurnAttackReactionRemoveSteamCounterInductionChamberTargetMechanologistPistolAttackGainsGoAgain:
        {
          displayName: "Give a pistol attack go again",
        },
    },
  },
});

export const { red: inductionChamberRedI18n } = inductionChamberI18n.cards;
