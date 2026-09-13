import { useFabCardPresentation } from "./useFabCardPresentation";
import { useMemo, useState } from "react";
import type { SimulatorMatchHistoryRow } from "@tcg/simulator-contract";
import { getFabEngineScenario } from "./engineScenarios";
import { presentRuntime } from "./projection";
import { FleshAndBloodTabletop } from "./FleshAndBloodTabletop";
import { useFabCardArt } from "./FabPresentationCatalog";
import type { FabCardDefinition } from "./state";

// Explicit variants from the review sample; never infer pitch from a name in production.
const historyDefinitions: Record<string, FabCardDefinition> = {
  Durendal: { name: "Durendal", cardType: "Weapon" },
  "Hammerhead, Harpoon Cannon": { name: "Hammerhead, Harpoon Cannon", cardType: "Weapon" },
  "King Kraken Harpoon": { name: "King Kraken Harpoon", cardType: "Action", pitchValue: 1 },
  "Big Game Trophy Shot": { name: "Big Game Trophy Shot", cardType: "Action", pitchValue: 2 },
  "Run Through": { name: "Run Through", cardType: "Attack Reaction", pitchValue: 2 },
  "run-through-blue": { name: "Run Through", cardType: "Attack Reaction", pitchValue: 3 },
  "Swordmaster's Path": { name: "Swordmaster's Path", cardType: "Action", pitchValue: 1 },
  "Sharp 'n Shine": { name: "Sharp 'n Shine", cardType: "Action", pitchValue: 2 },
  "Authority of Ataya": { name: "Authority of Ataya", cardType: "Resource", pitchValue: 3 },
  "Burdens of the Past": { name: "Burdens of the Past", cardType: "Action", pitchValue: 3 },
};

const HISTORY_PRESENTATION_REFERENCES: Readonly<Record<string, string>> = {
  Durendal: "gzLPbbGKHBB9fKJdkGdJg",
  "Hammerhead, Harpoon Cannon": "mTpzzz7FRDn6pfwQkQtRw",
  "King Kraken Harpoon": "pnjKtMh8BcRHL8NJkFWpL",
  "Big Game Trophy Shot": "mcWPGtmMHtkG7RrMpnKgq",
  "Run Through": "DBDwbqjgnpnNfFrJ8Dmhr",
  "run-through-blue": "RRBhCdRN8Fj7zw6hQdLPJ",
  "Swordmaster's Path": "gTLKtttbcq6CcLMHghJKw",
  "Sharp 'n Shine": "GhWWCbCPqB9FCRQP6zzpm",
  "Authority of Ataya": "Wkg8Fp6Wg7Cnb8rzHGqFh",
  "Burdens of the Past": "bCr7BCMzbRDWdBCJfTdTM",
};

/** Presentation-only log sample based on the typography review screenshots. */
const entries: Omit<SimulatorMatchHistoryRow, "id" | "timestamp">[] = [
  { turn: 1, kind: "match-start", title: "Match started · You go first" },
  {
    turn: 1,
    kind: "combat",
    actorSeatId: "player-1",
    title: "You attacked Opponent with Durendal",
    cardRefs: [{ name: "Durendal" }],
    metrics: [{ kind: "value", label: "Attack", value: 4 }],
  },
  ...["King Kraken Harpoon", "Big Game Trophy Shot"].map(
    (name): Omit<SimulatorMatchHistoryRow, "id" | "timestamp"> => ({
      turn: 1,
      kind: "combat",
      actorSeatId: "player-2",
      title: `Opponent defended with ${name}`,
      cardRefs: [{ name }],
      metrics: [{ kind: "value", label: "Defense", value: 3 }],
    }),
  ),
  {
    turn: 1,
    kind: "activity",
    actorSeatId: "player-1",
    title: "You played Run Through",
    cardRefs: [{ name: "Run Through" }],
  },
  {
    turn: 1,
    kind: "activity",
    actorSeatId: "player-1",
    title: "Run Through gives the next attack +2 power",
    cardRefs: [{ name: "Run Through" }],
  },
  {
    turn: 1,
    kind: "outcome",
    actorSeatId: "player-1",
    title: "Durendal was blocked by Opponent",
    cardRefs: [{ name: "Durendal" }],
    metrics: [
      { kind: "comparison", leftLabel: "Attack", left: 4, rightLabel: "Defense", right: 6 },
    ],
  },
  {
    turn: 1,
    kind: "activity",
    actorSeatId: "player-1",
    title: "Durendal lost 1 +1 power counter",
    cardRefs: [{ name: "Durendal" }],
  },
  {
    turn: 1,
    kind: "activity",
    actorSeatId: "player-1",
    title: "You drew: Swordmaster's Path, Sharp 'n Shine, Run Through, Sharp 'n Shine",
    cardRefs: ["Swordmaster's Path", "Sharp 'n Shine", "Run Through", "Sharp 'n Shine"].map(
      (name) => ({ name, definitionId: name === "Run Through" ? "run-through-blue" : name }),
    ),
  },
  { turn: 2, kind: "activity", actorSeatId: "player-2", title: "Opponent drew 2 cards" },
  {
    turn: 2,
    kind: "activity",
    actorSeatId: "player-2",
    title: "Hammerhead, Harpoon Cannon was tapped",
    cardRefs: [{ name: "Hammerhead, Harpoon Cannon" }],
  },
  {
    turn: 2,
    kind: "activity",
    actorSeatId: "player-2",
    title: "Opponent activated Hammerhead, Harpoon Cannon",
    cardRefs: [{ name: "Hammerhead, Harpoon Cannon" }],
    details: [
      {
        kind: "cards",
        label: "Cost",
        lead: "Pitched",
        cards: [{ name: "Authority of Ataya" }],
        amount: 3,
      },
      {
        kind: "cards",
        label: "",
        lead: "Pitched",
        cards: [{ name: "Burdens of the Past" }],
        amount: 3,
      },
    ],
  },
  {
    turn: 2,
    kind: "activity",
    actorSeatId: "player-2",
    title: "Hammerhead, Harpoon Cannon gives the next attack +4 power",
    cardRefs: [{ name: "Hammerhead, Harpoon Cannon" }],
  },
];

export const FAB_HISTORY_READING_ROWS: SimulatorMatchHistoryRow[] = entries.map((entry, index) => ({
  ...entry,
  id: `reading-sample-${index}`,
  timestamp: new Date(index).toISOString(),
  turnOwnerSeatId: entry.turn === 1 ? "player-1" : "player-2",
}));

export function FabHistoryFixture() {
  const [match] = useState(() => getFabEngineScenario("opening")!.boot());
  const definitions = useMemo(
    () => [
      ...Object.values(match.runtime.getState().cardDefinitions),
      ...Object.entries(historyDefinitions).map(([canonicalId, definition]) => ({
        canonicalId,
        name: definition.name,
        presentationReference: HISTORY_PRESENTATION_REFERENCES[canonicalId],
      })),
    ],
    [match],
  );
  useFabCardPresentation(definitions, "history-reading");
  const resolver = useFabCardArt();
  const state = presentRuntime(match.runtime, "player-1", resolver);
  return (
    <FleshAndBloodTabletop
      state={{ ...state, cardDefinitions: { ...state.cardDefinitions, ...historyDefinitions } }}
      viewerId="player-1"
      legalCommands={[]}
      readOnly
      matchHistory={FAB_HISTORY_READING_ROWS}
    />
  );
}
