/// <reference types="node" />
/**
 * Scratch game reader: replays one match with the same setup as runAutoMatch
 * (same seed → same game) while harvesting instanceId→displayName from every
 * filtered view, then prints a turn-by-turn trace with real card names.
 */
import {
  AIPlayer,
  createMatchState,
  createGreedyStrategy,
  DEFAULT_GREEDY_WEIGHTS,
  LocalEngine,
  withDeckProfile,
  type FilteredMatchView,
} from "@tcg/cyberpunk-engine";
import {
  createAuthoredBotLabDecks,
  createStructuredCatalog,
  deckListFromGenerated,
} from "./src/legal-decks.ts";
import { deckProfileFor } from "./src/deck-profiles.ts";
import { createTestPlayers } from "./src/test-catalog.ts";
import { structuredCards } from "@tcg/cyberpunk-cards";

const deckId = process.argv[2]!;
const matchIndex = Number(process.argv[3] ?? 0);
const oppId = process.argv[4] ?? undefined;
const seedBase = process.env.READER_SEED ?? "vs-pool";

const nameByDefId = new Map<string, string>();
for (const c of structuredCards) {
  nameByDefId.set(c.id, c.displayName);
  nameByDefId.set(c.slug, c.displayName);
}

const decks = createAuthoredBotLabDecks();
const deck = decks.find((d) => d.id === deckId)!;
const opp = oppId
  ? decks.find((d) => d.id === oppId)!
  : decks.find((d) => d.id === "authored-johnny-fight-ready-steal")!;
const catalog = createStructuredCatalog();

const candidate = withDeckProfile(
  createGreedyStrategy(DEFAULT_GREEDY_WEIGHTS, "default"),
  deckProfileFor(deck.id)!,
);
const opponent = withDeckProfile(
  createGreedyStrategy(DEFAULT_GREEDY_WEIGHTS, "default"),
  deckProfileFor(opp.id)!,
);

const seed = oppId
  ? `${seedBase}/${deck.id}/vs-${opp.id}/match-${matchIndex}`
  : `vs-johnny/${deck.id}/match-${matchIndex}`;

const players = createTestPlayers();
const deckLists = [deckListFromGenerated(deck, "p1"), deckListFromGenerated(opp, "p2")];
const state = createMatchState({ players, catalog, deckLists, seed });
const engine = new LocalEngine(state);
const ais = players.map(
  (player, idx) => new AIPlayer(engine, player.id, [candidate, opponent][idx]!, { rngSeed: `${seed}:${player.id}` }),
);

const nameByInstanceId = new Map<string, string>();
function harvest(view: FilteredMatchView) {
  for (const player of Object.values(view.players)) {
    for (const cards of Object.values(player.zones)) {
      if (!Array.isArray(cards)) continue;
      for (const card of cards) {
        if (!nameByInstanceId.has(card.instanceId)) {
          const defName = nameByDefId.get(card.definitionId);
          if (defName) nameByInstanceId.set(card.instanceId, defName);
        }
      }
    }
  }
}
function name(id: string | undefined): string {
  if (id === undefined) return "?";
  return nameByInstanceId.get(id) ?? id;
}

function pretty(args: Record<string, unknown>): string {
  return Object.entries(args)
    .map(([k, v]) => {
      if (k === "targetIds" && Array.isArray(v))
        return `targets=${v.map((id) => name(String(id))).join(" | ")}`;
      if (k === "dieIds" && Array.isArray(v)) return `dieIds=${v.join(",")}`;
      if (k === "destinations" && Array.isArray(v)) return `destinations=${JSON.stringify(v).slice(0, 120)}`;
      const str = typeof v === "string" ? v : undefined;
      const isId = str !== undefined && (k === "cardId" || k === "legendId" || k === "attackerId" || k === "defenderId" || k === "blockerId" || k === "attachToId");
      return `${k}=${isId ? name(str) : String(v)}`;
    })
    .join("  ");
}

// Same loop shape as runAutoMatch (same maxSteps default) so the game is identical.
const maxSteps = 5000;
let turn = 0;
let view = engine.getFilteredView(ais[0]!.playerId);
for (let stepIndex = 0; stepIndex < maxSteps; stepIndex++) {
  view = engine.getFilteredView(ais[0]!.playerId);
  if (view.gameEnded) {
    console.log(`=== END winner=${view.winnerId ?? "draw"} reason=${view.winReason ?? "-"} turn=${view.turnNumber}`);
    break;
  }
  harvest(engine.getFilteredView(ais[0]!.playerId));
  harvest(engine.getFilteredView(ais[1]!.playerId));
  if (view.turnNumber !== turn) {
    turn = view.turnNumber;
    const v1 = engine.getFilteredView(ais[0]!.playerId);
    const v2 = engine.getFilteredView(ais[1]!.playerId);
    const s1 = v1.players[ais[0]!.playerId as string];
    const s2 = v2.players[ais[1]!.playerId as string];
    const handCount = (v: FilteredMatchView, pid: string) => {
      const z = v.players[pid]?.zones.hand;
      return Array.isArray(z) ? z.length : typeof z === "number" ? z : 0;
    };
    const fieldCount = (v: FilteredMatchView, pid: string) => {
      const z = v.players[pid]?.zones.field;
      return Array.isArray(z) ? z.length : typeof z === "number" ? z : 0;
    };
    console.log(
      `--- turn ${turn} | P1 ${(deck.title ?? deck.id).slice(0, 22)} gigs=${s1?.gigCount} eddies=${s1?.eddies} hand=${handCount(v1, ais[0]!.playerId as string)} field=${fieldCount(v1, ais[0]!.playerId as string)}` +
        ` | P2 ${(opp.title ?? opp.id).slice(0, 22)} gigs=${s2?.gigCount} hand=${handCount(v2, ais[1]!.playerId as string)} field=${fieldCount(v2, ais[1]!.playerId as string)}`,
    );
  }
  // Mirror runAutoMatch.pickActiveAi: step whichever AI holds an actionable prompt.
  const ordered = [...ais].sort((a, b) =>
    (a.playerId as string) === view.activePlayerId ? -1 : (b.playerId as string) === view.activePlayerId ? 1 : 0,
  );
  const active = ordered.find((ai) => {
    const status = engine.getPrompt(ai.playerId).status;
    return status === "action" || status === "choice";
  });
  if (!active) {
    console.log(`=== STALL: no actionable prompt (turn ${turn})`);
    break;
  }
  const result = active.step();
  if (result.kind === "acted") {
    const who = (active.playerId as string) === (ais[0]!.playerId as string) ? "P1" : "P2";
    console.log(`  t${turn} ${who} ${result.decision.move.padEnd(18)} ${pretty((result.decision.args ?? {}) as Record<string, unknown>)}`);
  } else if (result.kind === "stuck") {
    console.log(`  t${turn} ${(active.playerId as string) === (ais[0]!.playerId as string) ? "P1" : "P2"} ${result.kind}: ${result.reason}`);
  } else if (result.kind === "illegal") {
    console.log(`  t${turn} ${(active.playerId as string) === (ais[0]!.playerId as string) ? "P1" : "P2"} ${result.kind}: ${result.error}`);
  }
}
