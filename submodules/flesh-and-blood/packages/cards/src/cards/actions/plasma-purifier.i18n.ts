import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { plasmaPurifier } from "./plasma-purifier.ts";

export const plasmaPurifierI18n = defineFamilyI18n(plasmaPurifier, {
  en: {
    name: "Plasma Purifier",
    text: "Action - {r}: If there are no steam counters on Plasma Purifier, put a steam counter on it. Go again\nOnce per Turn Action - Remove a steam counter from Plasma Purifier: Target Mechanologist pistol you control gains +1{p} until end of turn. Go again",
    typeText: "Mechanologist Action - Item",
    abilities: {
      actionResourceThereNoSteamCountersPlasmaPurifierPutSteamCounterGoAgain: {
        displayName: "Add a steam counter",
      },
      oncePerTurnActionRemoveSteamCounterPlasmaPurifierTargetMechanologistPistolGains1PowerEndTurnGoAgain:
        {
          displayName: "Give a pistol +1 power",
        },
    },
  },
});

export const { red: plasmaPurifierRedI18n } = plasmaPurifierI18n.cards;
