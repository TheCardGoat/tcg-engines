import { useEffect, useState } from "react";
import { MantineProvider } from "@mantine/core";
import { MatchSessionSchema } from "@tcg/game-page-contract";
import { cards as cyberpunkCards, getCardBySlug } from "@tcg/cyberpunk-cards";
import {
  CyberpunkPreparationDialog,
  poolSchema,
  selectionSchema,
} from "../games/cyberpunk/pages/CyberpunkPreparation.page";
import { BoardSharedPage } from "../games/cyberpunk/pages/BoardShared.page";
import boardStyles from "../games/cyberpunk/pages/Practice.module.css";
import { UserConfigProvider } from "../games/cyberpunk/engine";

const legendIds = [
  "v-corporate-exile",
  "jackie-welles-pour-one-out-for-me",
  "viktor-vektor-sit-down-and-relax",
];
const rivalLegendIds = [
  "goro-takemura-hands-unclean",
  "saburo-arasaka-stubborn-patriarch",
  "yorinobu-arasaka-embracing-destruction",
];
const mainCards: readonly [string, number][] = [
  ["armored-minotaur", 3],
  ["corpo-security", 2],
  ["delamain-cab", 3],
  ["mt0d12-flathead", 3],
  ["ruthless-lowlife", 3],
  ["secondhand-bombus", 3],
  ["corporate-surveillance", 3],
  ["industrial-assembly", 3],
  ["dying-night-v-s-pistol", 3],
  ["kiroshi-optics", 3],
  ["mandibular-upgrade", 2],
  ["sandevistan", 2],
  ["satori-sword-of-saburo", 2],
  ["reboot-optics", 2],
  ["t-bug-amateur-philosopher", 2],
  ["mantis-blades", 1],
];
const sideCards: readonly [string, number][] = [
  ["mantis-blades", 2],
  ["swordwise-huscle", 2],
  ["goro-takemura-losing-his-way", 2],
  ["corpo-security", 1],
];

function previewCard(cardId: string, quantity: number) {
  const definition =
    getCardBySlug(cardId) ?? cyberpunkCards.find((candidate) => candidate.slug === cardId);
  return {
    cardId,
    quantity,
    card: {
      name: definition?.subname
        ? `${definition.name}: ${definition.subname}`
        : (definition?.name ?? cardId),
      type: definition?.type ?? "other",
    },
  };
}

/** Browser fixture for the hosted Cyberpunk preparation flow. */
export default function CyberpunkPreparationPreview() {
  const [stage, setStage] = useState<"game-one" | "between-games">("between-games");
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedSelection, setConfirmedSelection] = useState<ReturnType<
    typeof selectionSchema.parse
  > | null>(null);
  const [starting, setStarting] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const [clock, setClock] = useState(() => ({
    serverTime: new Date().toISOString(),
    deadlineAt: new Date(Date.now() + 120_000).toISOString(),
  }));
  useEffect(() => {
    setClientReady(true);
    if (new URLSearchParams(window.location.search).get("game") === "1") {
      setStage("game-one");
      setLocked(true);
      setClock({
        serverTime: new Date().toISOString(),
        deadlineAt: new Date(Date.now() + 15_000).toISOString(),
      });
    }
  }, []);
  if (!import.meta.env.DEV) return null;
  const session = MatchSessionSchema.parse({
    schemaVersion: 2,
    revision: 1,
    phase: "preparation",
    gameId: stage === "game-one" ? "g1" : "g2",
    match: {
      matchId: "preview",
      gameType: "cyberpunk",
      format: "best_of_3",
      matchType: "casual",
      status: "waiting",
      participants: [],
      gameIds: stage === "game-one" ? [] : ["g1", "g2"],
      scores: stage === "game-one" ? { p1: 0, p2: 0 } : { p1: 0, p2: 1 },
    },
    viewer: {
      role: "player",
      userId: "preview",
      actorId: "p1",
      seat: 1,
      permissions: {
        act: true,
        chat: true,
        propose: false,
        useManualControls: false,
        concede: true,
        spectate: false,
        viewReplay: true,
        downloadReplay: false,
        forkReplay: false,
      },
    },
    preparation: {
      object: "game_pregame",
      phase: locked ? "choosing-first-player" : "selecting",
      phaseToken: locked ? "choice-phase" : "selection-phase",
      serverTime: clock.serverTime,
      selectionOutcome: stage === "game-one" ? "fixed" : locked ? "confirmed" : "pending",
      kind: "cyberpunk",
      matchId: "preview",
      gameId: stage === "game-one" ? "g1" : "g2",
      status: "waiting",
      playerId: "p1",
      deadlineAt: clock.deadlineAt,
      turnOrder: { stage: "choosing", chooserId: "p1" },
      pool: {
        stage,
        legends: legendIds.map((id) => previewCard(id, 1)),
        main: mainCards.map(([id, quantity]) => previewCard(id, quantity)),
        sideboard: sideCards.map(([id, quantity]) => previewCard(id, quantity)),
      },
      selection: confirmedSelection ?? {
        legends: legendIds.map((cardId) => ({ cardId, quantity: 1 })),
        main: mainCards.map(([cardId, quantity]) => ({ cardId, quantity })),
        sideboard: sideCards.map(([cardId, quantity]) => ({ cardId, quantity })),
      },
      locked,
      opponentReady: locked,
      player: { playerId: "p1", label: "NightRunner", mmr: 1438, subscriptionTier: "tier4" },
      opponent: {
        playerId: "p2",
        label: "ChromeJack",
        mmr: 1512,
        subscriptionTier: "tier2",
        legends: rivalLegendIds.map((id) => previewCard(id, 1)),
      },
    },
  });
  if (session.phase !== "preparation") return null;
  return (
    <MantineProvider defaultColorScheme="dark">
      {clientReady && (
        <UserConfigProvider>
          <div inert aria-hidden="true" className={boardStyles.preparationBoard}>
            <BoardSharedPage
              scenarioId="gameStart"
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
              initialHumanSide="player"
            />
          </div>
        </UserConfigProvider>
      )}
      {!starting && (
        <CyberpunkPreparationDialog
          key={stage}
          session={session}
          pool={poolSchema.parse(session.preparation.pool)}
          initial={selectionSchema.parse(session.preparation.selection)}
          busy={false}
          error={error}
          showRecovery={false}
          onSubmit={async (suffix, body) => {
            if (new URLSearchParams(window.location.search).get("submission") === "error") {
              setError("Could not send your deck. Check your connection and try again.");
              return;
            }
            if (suffix === "/first-player") setStarting(true);
            else {
              if ("selection" in body) setConfirmedSelection(body.selection);
              setLocked(true);
              setClock({
                serverTime: new Date().toISOString(),
                deadlineAt: new Date(Date.now() + 15_000).toISOString(),
              });
            }
          }}
        />
      )}
    </MantineProvider>
  );
}
