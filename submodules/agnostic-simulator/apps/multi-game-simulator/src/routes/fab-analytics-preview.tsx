import { FabPostGameSummary } from "../games/flesh-and-blood/FabPostGameSummary";
import { FabPresentationCatalogProvider } from "../games/flesh-and-blood/FabPresentationCatalog";
import type { FabPostGameSummaryModel } from "../games/flesh-and-blood/FabPostGameSummary.model";

/** Small visual fixture: no deck loading; all numbers are explicitly illustrative. */
const summary: FabPostGameSummaryModel = {
  viewer: { id: "p1", label: "Example player", heroName: "Rhinar", life: 14, result: "win" },
  opponent: { id: "p2", label: "Example opponent", heroName: "Bravo", life: 0, result: "loss" },
  outcome: "victory",
  outcomeTitle: "Victory",
  outcomeDetail: "Illustrative analytics example",
  reason: { value: "Example only", source: "mock" },
  turnNumber: { value: 2, source: "mock" },
  durationSeconds: { value: 120, source: "mock" },
  formatLabel: { value: "Pilot preview", source: "mock" },
  comparison: [
    { id: "damage", label: "Attack damage", viewer: "6", opponent: "2", source: "mock" },
  ],
  lifeByTurn: { turns: [0, 1, 2], viewer: [20, 18, 14], opponent: [20, 14, 0], source: "mock" },
  turns: [1, 2].map((turn) => ({
    turn,
    cardsPlayed: 1,
    cardsPitched: 1,
    resourcesGenerated: 3,
    damageDealt: 3,
    cardsDefended: 1,
    cardsPlayedFromArsenal: turn === 2 ? 1 : 0,
    source: "mock",
  })),
  cards: [],
  opponentCards: [],
  hands: [
    {
      cycle: 1,
      openedAfterTurn: null,
      openedBy: "opening-hand",
      startingCards: [
        { id: "wrecker-romp-red", name: "Wrecker Romp" },
        { id: "barraging-beatdown-red", name: "Barraging Beatdown" },
        { id: "savage-feast-red", name: "Savage Feast" },
        { id: "pack-call-yellow", name: "Pack Call" },
      ],
      carriedCards: [],
      endingCards: [{ id: "pack-call-yellow", name: "Pack Call" }],
      actions: [
        {
          sequence: 1,
          turn: 1,
          kind: "pitched",
          cardId: "wrecker-romp-red",
          cardName: "Wrecker Romp",
          origin: "hand",
          destination: "pitch",
        },
        {
          sequence: 2,
          turn: 1,
          kind: "played",
          cardId: "barraging-beatdown-red",
          cardName: "Barraging Beatdown",
          origin: "hand",
          destination: "stack",
        },
        {
          sequence: 3,
          turn: 1,
          kind: "arsenaled",
          cardId: "savage-feast-red",
          cardName: "Savage Feast",
          origin: "hand",
          destination: "arsenal",
        },
        {
          sequence: 4,
          turn: 3,
          kind: "played",
          cardId: "savage-feast-red",
          cardName: "Savage Feast",
          origin: "arsenal",
          destination: "stack",
        },
      ],
      closedAfterTurn: 1,
      source: "mock",
    },
    {
      cycle: 2,
      openedAfterTurn: 1,
      openedBy: "draw-to-intellect",
      startingCards: [
        { id: "pack-call-yellow", name: "Pack Call" },
        { id: "swing-fist-think-later-blue", name: "Swing Fist, Think Later" },
      ],
      carriedCards: [{ id: "pack-call-yellow", name: "Pack Call" }],
      endingCards: [],
      actions: [
        {
          sequence: 5,
          turn: 2,
          kind: "defended",
          cardId: "pack-call-yellow",
          cardName: "Pack Call",
          origin: "hand",
          destination: "combat-chain",
        },
      ],
      closedAfterTurn: 2,
      source: "mock",
    },
  ],
  hasMockData: true,
  match: {
    source: "mock",
    viewerWins: 1,
    opponentWins: 0,
    games: [],
    comparison: [],
    observations: [],
  },
  combatValue: {
    source: "mock",
    viewer: { attack: 12, otherDamage: 2, defense: 6, prevention: 2, total: 22 },
    opponent: { attack: 10, otherDamage: 0, defense: 4, prevention: 0, total: 14 },
    turns: [
      {
        turn: 1,
        completed: true,
        viewer: { attack: 6, otherDamage: 2, defense: 0, prevention: 0, total: 8 },
        opponent: { attack: 0, otherDamage: 0, defense: 4, prevention: 0, total: 4 },
      },
      {
        turn: 2,
        completed: false,
        viewer: { attack: 6, otherDamage: 0, defense: 6, prevention: 2, total: 14 },
        opponent: { attack: 10, otherDamage: 0, defense: 0, prevention: 0, total: 10 },
      },
    ],
  },
};
export default function FabAnalyticsPreview() {
  if (!import.meta.env.DEV) return null;
  return (
    <FabPresentationCatalogProvider>
      <FabPostGameSummary
        summary={summary}
        onInspectBoard={() => {
          window.location.href = "/flesh-and-blood/simulator/analytics-methodology";
        }}
        onMainMenu={() => {
          window.location.href = "/flesh-and-blood/simulator";
        }}
        onPlayAgain={() => {
          window.location.reload();
        }}
      />
    </FabPresentationCatalogProvider>
  );
}
