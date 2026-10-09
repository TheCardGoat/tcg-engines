/**
 * Player half of the RRY vs BBG curve loop.
 *
 * Plays the shipped tactical chooser, scores turns 1–5, and appends a journal
 * row naming the largest miss. The coach then takes one lesson
 * (`curveSellCards` or `curveUnits`) and runs this again.
 *
 *   bun tools/ai-runner/src/curve-self-improve.ts --matches 20
 */
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  runAutoMatch,
  tacticalStrategy,
  type AIStrategy,
  type DecisionContext,
} from "@tcg/cyberpunk-engine";
import { bindStrategyToDeck } from "./bind-deck-strategy.ts";
import {
  createAuthoredBotLabDecks,
  createStructuredCatalog,
  deckListFromGenerated,
} from "./legal-decks.ts";
import { createTestPlayers } from "./test-catalog.ts";

const RRY_ID = "authored-rry-llorona-steel-dragon";
const BBG_ID = "authored-bbg-towerfall-control";

function argValue(name: string, fallback: string): string {
  const index = process.argv.indexOf(name);
  return index >= 0 ? (process.argv[index + 1] ?? fallback) : fallback;
}

const matches = Number(argValue("--matches", "20"));
const seedBase = argValue("--seed", "rry-bbg-curve");
const output = argValue(
  "--output",
  join(dirname(fileURLToPath(import.meta.url)), "../../../reports/curve-self-improve"),
);

type Card = {
  instanceId: string;
  cardName: string | null;
  cost: number | null;
  effectiveCost: number | null;
};

function nameOf(ctx: DecisionContext, id: string): string {
  for (const player of Object.values(ctx.view.players)) {
    for (const zone of Object.values(player.zones)) {
      if (!Array.isArray(zone)) continue;
      const card = (zone as Card[]).find((candidate) => candidate.instanceId === id);
      if (card?.cardName) return card.cardName;
    }
  }
  return id;
}

function playNames(ctx: DecisionContext): string[] {
  const move = ctx.prompt.availableMoves.find((candidate) => candidate.moveId === "playCard");
  if (!move || move.inputSpec.type !== "playCard") return [];
  return move.inputSpec.candidates
    .filter((candidate) => candidate.attachTargets == null)
    .map((candidate) => nameOf(ctx, candidate.cardId));
}

function sellNames(ctx: DecisionContext): string[] {
  const move = ctx.prompt.availableMoves.find((candidate) => candidate.moveId === "sellCard");
  if (!move || move.inputSpec.type !== "selectCard") return [];
  return move.inputSpec.candidates.map((id) => nameOf(ctx, id));
}

const counts = new Map<string, { checked: number; followed: number }>();
let hung = 0;

function bump(key: string, followed: boolean) {
  const row = counts.get(key) ?? { checked: 0, followed: 0 };
  row.checked += 1;
  if (followed) row.followed += 1;
  counts.set(key, row);
}

function watch(inner: AIStrategy, deck: "rry" | "bbg"): AIStrategy {
  const sell = new Set(
    deck === "rry"
      ? [
          "All is Lost",
          "Industrial Assembly",
          "The Heist",
          "Bonnie and Clyde",
          "Over the Edge",
          "Carnage at the Colosseum",
        ]
      : [
          "Floor It",
          "Three Mouths, One Desire",
          "Nocturne OP55 N1",
          "Pyramid Song",
          "Les Élémens",
          "Towerfall",
        ],
  );
  const curve =
    deck === "rry"
      ? ["La Llorona", "Dexter DeShawn", "6th Street Recruits", "Meredith Stout"]
      : ["Jacked-In Voodoo Boy", "Pepe Najarro", "Lizzy Wizzy"];
  const open = new Map<
    string,
    { spare: boolean; sold: boolean; cheap: number; tookCheap: boolean; closed: boolean }
  >();
  return {
    ...inner,
    decideAction(ctx) {
      const decision = inner.decideAction(ctx);
      const turn = ctx.view.turnNumber;
      const player = ctx.view.players[ctx.playerId as string];
      // Game turn 1 is on the play (2 €$ after the sell). Game turn 2 is
      // on the draw (4 €$ after the sell). Later own turns are 5, 6, 7, 8.
      const onPlay = turn % 2 === 1;
      const ownTurn = onPlay ? (turn + 1) / 2 : turn / 2;
      if (
        ctx.view.gamePhase !== "main" ||
        ctx.prompt.status !== "action" ||
        !player ||
        ownTurn < 1 ||
        ownTurn > 5
      ) {
        return decision;
      }
      const seat = onPlay ? "play" : "draw";
      const key = `${ctx.playerId as string}|${seat}|${ownTurn}`;
      const row = open.get(key) ?? {
        spare: false,
        sold: false,
        cheap: 0,
        tookCheap: false,
        closed: false,
      };
      const spareLegal = sellNames(ctx).filter((name) => sell.has(name));
      if (spareLegal.length > 0) row.spare = true;
      if (
        decision.kind === "command" &&
        decision.move === "sellCard" &&
        sell.has(nameOf(ctx, String(decision.args?.cardId ?? "")))
      ) {
        row.sold = true;
      }
      const hand = ctx.view.players[ctx.playerId as string]?.zones.hand;
      const costOf = (cardName: string) => {
        if (!Array.isArray(hand)) return null;
        const card = (hand as Card[]).find((candidate) => candidate.cardName === cardName);
        return card?.effectiveCost ?? card?.cost ?? null;
      };
      const legalCurve = playNames(ctx).filter((name) => curve.includes(name));
      const costs = legalCurve.map(costOf).filter((cost): cost is number => cost != null);
      if (costs.length > 1 && new Set(costs).size > 1 && row.cheap === 0) {
        row.cheap = Math.min(...costs);
      }
      if (decision.kind === "command" && decision.move === "playCard" && row.cheap > 0) {
        const played = nameOf(ctx, String(decision.args?.cardId ?? ""));
        if (curve.includes(played) && costOf(played) === row.cheap) row.tookCheap = true;
      }
      if (decision.kind === "command" && decision.move === "passPhase" && !row.closed) {
        row.closed = true;
        if (row.spare) bump(`${deck} ${seat} T${ownTurn} sell`, row.sold);
        if (row.cheap > 0) bump(`${deck} ${seat} T${ownTurn} cheaper-curve-unit`, row.tookCheap);
      }
      open.set(key, row);
      return decision;
    },
  };
}

mkdirSync(output, { recursive: true });
const decks = createAuthoredBotLabDecks();
const rry = decks.find((deck) => deck.id === RRY_ID)!;
const bbg = decks.find((deck) => deck.id === BBG_ID)!;
const catalog = createStructuredCatalog();
const players = createTestPlayers();

for (let match = 0; match < matches; match += 1) {
  const seed = `${seedBase}/${RRY_ID}-vs-${BBG_ID}/match-${match}`;
  const result = runAutoMatch({
    players,
    decks: [deckListFromGenerated(rry, "p1"), deckListFromGenerated(bbg, "p2")],
    strategies: [
      watch(bindStrategyToDeck(tacticalStrategy, rry), "rry"),
      watch(bindStrategyToDeck(tacticalStrategy, bbg), "bbg"),
    ],
    catalog,
    seed,
  });
  if (result.reason === "repeatedState" || result.reason === "stuck" || result.reason === "illegal")
    hung += 1;
}

const ranked = [...counts.entries()]
  .map(([key, row]) => ({ key, ...row, missed: row.checked - row.followed }))
  .sort((a, b) => b.missed - a.missed);
const top = ranked[0];
const lesson =
  !top || top.missed === 0
    ? "none"
    : top.key.endsWith("sell")
      ? "curveSellCards: do not pass while a spare program can be sold"
      : "curveUnits: play the cheaper curve unit before the expensive one";
const row = {
  at: new Date().toISOString(),
  matches,
  seedBase,
  hung,
  lesson,
  scores: ranked,
};
appendFileSync(join(output, "journal.jsonl"), `${JSON.stringify(row)}\n`);
console.log(JSON.stringify(row, null, 2));
if (hung > 0) process.exit(2);
