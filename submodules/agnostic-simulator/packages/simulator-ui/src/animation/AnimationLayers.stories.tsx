import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useMemo, useState } from "react";

import type { SimulatorZone } from "@tcg/simulator-contract";
import { CardFace } from "../components/CardFace";
import {
  ZoneTransferAnimator,
  type ZoneTransferAnimationStep,
} from "../components/ZoneTransferAnimator";
import { StoryCase, StoryFrame, StoryGrid } from "../storybook/StoryFrame";
import { entities, entityMap, zones } from "../storybook/fixtures";
import {
  projectEntityForZoneViewer,
  redactEntityForHiddenZone,
  resolveAnimationCardFaceForViewer,
  type SimulatorAnimationEvent,
} from "./events";
import {
  isPrimitiveOverlayEvent,
  primitiveOverlayKind,
  resolvePrimitiveOverlayFaces,
} from "./primitiveEvent";
import { SimulatorAnimationLayer } from "./SimulatorAnimationLayer";
import { SimulatorPrimitiveAnimator } from "./SimulatorPrimitiveAnimator";
import { VisualAnimationLayer } from "./VisualAnimationLayer";
import {
  cardMoveRecordToSimulatorEvent,
  cardMoveRecordsToSimulatorEvents,
  type CardMoveAnimationRecord,
} from "./cardMoveEvents";
import { isZoneTransferEvent, toZoneTransferAnimationStep } from "./zoneTransferEvent";
import type { VisualAnimationEvent } from "./visualEvents";

const meta = {
  title: "Simulator UI/Animation",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const playerField = zones.find((zone) => zone.id === "player-field")!;
const opponentDeck = zones.find((zone) => zone.id === "opponent-deck")!;
const playerHand = zones.find((zone) => zone.id === "player-hand")!;
const discard = zones.find((zone) => zone.id === "discard")!;

function AnimationBoard({ children }: { children?: React.ReactNode }) {
  return (
    <div className="storybook-panel storybook-stage board-mat relative grid grid-cols-[1fr_1fr] gap-8 p-8">
      <section
        className="storybook-anchor-zone grid gap-3 rounded-lg border border-[var(--board-border)] p-4"
        data-zone-id="opponent-deck"
        data-zone-role="deck"
      >
        <h2 className="text-sm font-black text-[var(--board-text)]">Opponent Deck</h2>
        <div className="h-[156px] w-[118px] rounded-md border border-dashed border-[var(--board-border)]" />
      </section>
      <section
        className="storybook-anchor-zone grid gap-3 rounded-lg border border-[var(--board-border)] p-4"
        data-zone-id="player-field"
        data-zone-role="battlefield"
      >
        <h2 className="text-sm font-black text-[var(--board-text)]">Player Field</h2>
        <CardFace entity={entities[0]!} />
      </section>
      <section
        className="storybook-anchor-zone grid gap-3 rounded-lg border border-[var(--board-border)] p-4"
        data-zone-id="player-hand"
        data-zone-role="hand"
      >
        <h2 className="text-sm font-black text-[var(--board-text)]">Player Hand</h2>
        <CardFace entity={{ ...entities[3]!, id: "hidden-card" }} />
      </section>
      <section
        className="storybook-anchor-zone grid gap-3 rounded-lg border border-[var(--board-border)] p-4"
        data-zone-id="discard"
        data-zone-role="discard"
      >
        <h2 className="text-sm font-black text-[var(--board-text)]">Discard</h2>
        <CardFace entity={entities[2]!} />
      </section>
      <div
        className="absolute right-6 top-6 rounded-full border border-[var(--board-border)] px-3 py-1 text-xs font-black text-[var(--board-text)]"
        data-seat-id="player-1"
      >
        Player
      </div>
      {children}
    </div>
  );
}

function TimedEvents({ events }: { events: SimulatorAnimationEvent[] }) {
  const [activeEvents, setActiveEvents] = useState<SimulatorAnimationEvent[] | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setActiveEvents(events), 100);
    return () => window.clearTimeout(timer);
  }, [events]);
  return (
    <SimulatorAnimationLayer events={activeEvents}>
      <AnimationBoard />
    </SimulatorAnimationLayer>
  );
}

export const SimulatorAnimationLayerStates: Story = {
  render: () => {
    const events = useMemo<SimulatorAnimationEvent[]>(
      () => [
        {
          id: "draw-event",
          primitive: "draw",
          entity: entities[3]!,
          fromZone: opponentDeck,
          toZone: playerHand,
          viewer: { viewerSeatId: "player-1" },
          durationMs: 700,
        },
        {
          id: "flip-event",
          primitive: "flipReveal",
          entity: entities[0]!,
          zone: playerField,
          viewer: { viewerSeatId: "player-1" },
          delayMs: 180,
        },
        {
          id: "target-event",
          primitive: "effectTarget",
          sourceEntity: entities[0]!,
          sourceZone: playerField,
          targets: [{ kind: "entity", entityId: "guard", zone: playerField, label: "Guard" }],
          viewer: { viewerSeatId: "player-1" },
          delayMs: 240,
        },
      ],
      [],
    );
    return (
      <StoryFrame title="SimulatorAnimationLayer states">
        <TimedEvents events={events} />
      </StoryFrame>
    );
  },
};

export const ZoneTransferAnimatorStates: Story = {
  render: () => {
    const [steps, setSteps] = useState<ZoneTransferAnimationStep[] | null>(null);
    useEffect(() => {
      const timer = window.setTimeout(
        () =>
          setSteps([
            {
              id: "zone-transfer-step",
              kind: "draw",
              entity: entities[3]!,
              fromZone: opponentDeck,
              toZone: playerHand,
              viewerSeatId: "player-1",
              durationMs: 700,
            },
          ]),
        100,
      );
      return () => window.clearTimeout(timer);
    }, []);
    return (
      <StoryFrame title="ZoneTransferAnimator states">
        <ZoneTransferAnimator steps={steps}>
          <AnimationBoard />
        </ZoneTransferAnimator>
      </StoryFrame>
    );
  },
};

export const SimulatorPrimitiveAnimatorStates: Story = {
  render: () => {
    const [events, setEvents] = useState<SimulatorAnimationEvent[] | null>(null);
    useEffect(() => {
      const timer = window.setTimeout(
        () =>
          setEvents([
            {
              id: "zone-enter",
              primitive: "zoneEnter",
              entity: entities[0]!,
              toZone: playerField,
              viewer: { viewerSeatId: "player-1" },
            },
            {
              id: "zone-exit",
              primitive: "zoneExit",
              entity: entities[2]!,
              fromZone: discard,
              viewer: { viewerSeatId: "player-1" },
              delayMs: 120,
            },
            {
              id: "attach",
              primitive: "attach",
              entity: entities[2]!,
              fromZone: discard,
              toZone: playerField,
              targetEntityId: "runner",
              viewer: { viewerSeatId: "player-1" },
              delayMs: 240,
            },
            {
              id: "layout-shift",
              primitive: "layoutShift",
              entityIds: ["runner", "resource-a"],
              viewer: { viewerSeatId: "player-1" },
              delayMs: 360,
            },
          ]),
        100,
      );
      return () => window.clearTimeout(timer);
    }, []);
    return (
      <StoryFrame title="SimulatorPrimitiveAnimator states">
        <SimulatorPrimitiveAnimator events={events}>
          <AnimationBoard />
        </SimulatorPrimitiveAnimator>
      </StoryFrame>
    );
  },
};

export const VisualAnimationLayerStates: Story = {
  render: () => {
    const [events, setEvents] = useState<VisualAnimationEvent[] | null>(null);
    useEffect(() => {
      const timer = window.setTimeout(
        () =>
          setEvents([
            {
              id: "combat-visual",
              primitive: "combat",
              sourceEntityId: "runner",
              targetEntityId: "guard",
              reason: "declared",
            },
            {
              id: "phase-visual",
              primitive: "phaseChange",
              from: "main",
              to: "combat",
              delayMs: 180,
            },
            {
              id: "resource-visual",
              primitive: "resourceFloat",
              playerId: "player-1",
              delta: 2,
              label: "+2",
              delayMs: 320,
            },
          ]),
        100,
      );
      return () => window.clearTimeout(timer);
    }, []);
    return (
      <StoryFrame title="VisualAnimationLayer states">
        <VisualAnimationLayer events={events}>
          <AnimationBoard>
            <CardFace entity={{ ...entities[1]!, id: "guard" }} />
          </AnimationBoard>
        </VisualAnimationLayer>
      </StoryFrame>
    );
  },
};

export const AnimationEventUtilityStates: Story = {
  render: () => {
    const drawEvent: SimulatorAnimationEvent = {
      id: "draw-utility",
      primitive: "draw",
      entity: entities[0]!,
      fromZone: opponentDeck,
      toZone: playerHand,
      viewer: { viewerSeatId: "player-1" },
    };
    const flipEvent: SimulatorAnimationEvent = {
      id: "flip-utility",
      primitive: "flipReveal",
      entity: entities[0]!,
      zone: playerField,
      viewer: { viewerSeatId: "player-1" },
    };
    const records: CardMoveAnimationRecord[] = [
      {
        id: "move-1",
        cardId: "runner",
        ownerId: "player-1",
        fromZoneId: "deck",
        toZoneId: "hand",
        reason: "draw",
      },
      { id: "move-2", cardId: "resource-a", ownerId: "player-1", toZoneId: "discard" },
    ];
    const zoneById = (zoneId: string, ownerId: string): SimulatorZone | undefined => {
      const zone = zones.find((candidate) => candidate.id === zoneId || candidate.role === zoneId);
      return zone ? { ...zone, ownerId } : undefined;
    };
    const moveEvents = cardMoveRecordsToSimulatorEvents(records, {
      viewerSeatId: "player-1",
      resolveEntity: (cardId) => entityMap.get(cardId),
      zoneDescriptor: zoneById,
    });
    const summary = {
      publicFace: resolveAnimationCardFaceForViewer({
        entity: entities[0]!,
        zone: playerField,
        viewer: { viewerSeatId: "player-1" },
      }),
      hiddenFace: resolveAnimationCardFaceForViewer({
        entity: entities[3]!,
        zone: opponentDeck,
        viewer: { viewerSeatId: "player-1" },
      }),
      redactedEntity: redactEntityForHiddenZone(entities[0]!).title,
      projectedOwnerHand: projectEntityForZoneViewer(entities[3]!, playerHand, {
        viewerSeatId: "player-1",
      }).face,
      isZoneTransfer: isZoneTransferEvent(drawEvent),
      zoneTransferStep: toZoneTransferAnimationStep(drawEvent),
      primitiveOverlay: isPrimitiveOverlayEvent(flipEvent),
      primitiveKind: primitiveOverlayKind(flipEvent),
      primitiveFacePlan: resolvePrimitiveOverlayFaces(flipEvent),
      singleMoveEvent: cardMoveRecordToSimulatorEvent(records[0]!, {
        viewerSeatId: "player-1",
        resolveEntity: (cardId) => entityMap.get(cardId),
        zoneDescriptor: zoneById,
      })?.primitive,
      moveEventPrimitives: moveEvents.map((event) => event.primitive),
    };
    return (
      <StoryFrame title="Animation utility states">
        <StoryGrid>
          <StoryCase title="event projection outputs">
            <pre className="overflow-auto rounded-lg bg-black/40 p-4 text-xs leading-relaxed text-[var(--board-text)]">
              {JSON.stringify(summary, null, 2)}
            </pre>
          </StoryCase>
          <StoryCase title="visual event model">
            <pre className="overflow-auto rounded-lg bg-black/40 p-4 text-xs leading-relaxed text-[var(--board-text)]">
              {JSON.stringify(
                [
                  {
                    id: "combat",
                    primitive: "combat",
                    sourceEntityId: "runner",
                    targetEntityId: "guard",
                    reason: "resolved",
                  },
                  { id: "phase", primitive: "phaseChange", from: "draw", to: "main" },
                  {
                    id: "resource",
                    primitive: "resourceFloat",
                    playerId: "player-1",
                    delta: -1,
                    label: "-1",
                  },
                ],
                null,
                2,
              )}
            </pre>
          </StoryCase>
        </StoryGrid>
      </StoryFrame>
    );
  },
};
