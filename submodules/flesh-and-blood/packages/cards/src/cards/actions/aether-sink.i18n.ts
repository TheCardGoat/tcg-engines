import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { aetherSink } from "./aether-sink.ts";

export const aetherSinkI18n = defineFamilyI18n(aetherSink, {
  en: {
    name: "Aether Sink",
    text: "Aether Sink enters the arena with a steam counter on it.\nAction - {r}: If there are no steam counters on Aether Sink, put a steam counter on it. Go again\nInstant - Remove a steam counter from Aether Sink: Aether Sink gains Arcane Barrier 2 until end of turn.",
    typeText: "Mechanologist Action - Item",
    abilities: {
      actionIfThereAreNoSteamCountersAetherSink: {
        displayName: "Add a steam counter",
      },
      instantRemoveSteamCounterFromAetherSinkAetherSink: {
        displayName: "Gain Arcane Barrier 2",
      },
    },
  },
});

export const { yellow: aetherSinkYellowI18n } = aetherSinkI18n.cards;
