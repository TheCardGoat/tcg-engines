import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cognitionNodes } from "./cognition-nodes.ts";

export const cognitionNodesI18n = defineFamilyI18n(cognitionNodes, {
  en: {
    name: "Cognition Nodes",
    text: 'Action - {r}: If there are no steam counters on Cognition Nodes, put a steam counter on it. Go again\nOnce per Turn Attack Reaction - Remove a steam counter from Cognition Nodes: Target attack action card gains "When this hits, put it on the bottom of its owner\'s deck."',
    typeText: "Mechanologist Action - Item",
    abilities: {
      actionIfThereAreNoSteamCountersCognitionNodes: {
        displayName: "Add a steam counter",
      },
      oncePerTurnAttackReactionRemoveSteamCounterFrom: {
        displayName: "Give an attack bottom-deck on hit",
      },
    },
  },
});

export const { blue: cognitionNodesBlueI18n } = cognitionNodesI18n.cards;
