import {
  fleshAndBloodCardsByCanonicalId,
  fleshAndBloodStructuredCardsByCanonicalId,
} from "@tcg/flesh-and-blood-cards";
import { InteractionResolutionPrompt } from "@tcg/simulator-ui";
import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type InteractionAction,
  type InteractionSubmission,
  type InteractionSubmissionValue,
} from "@tcg/protocol";
import { IconEye, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

import { buildMountedHref } from "../routes/router-paths.ts";
import type { PromptFixtureId } from "./simulator-ui-fixture-manifest";

type PromptFixtureSelectionId = PromptFixtureId | "all";

interface PromptFixture {
  readonly id: PromptFixtureId;
  readonly label: string;
  readonly description: string;
  readonly view: EngineInteractionView;
  readonly visibleEntityIds?: ReadonlySet<string>;
  readonly initialValues?: Readonly<Record<string, InteractionSubmissionValue>>;
  readonly actionId?: string;
  readonly actionPresentation?: {
    readonly title: string;
    readonly body?: string;
    readonly details?: string;
    readonly footerInstruction?: string;
    readonly submitLabel?: string;
  };
  readonly defaultDetailsExpanded?: boolean;
  readonly sourceCard?: SourceCard;
}

interface SourceCard {
  readonly name: string;
  readonly typeText: string;
  readonly rulesText: string;
}

const tunicCard = fleshAndBloodCardsByCanonicalId.get("RP6pJj9WtwbTT79qdHPkz");
if (!tunicCard) throw new Error("The cataloged Fyendal's Spring Tunic card is unavailable.");
const tunicSourceCard: SourceCard = {
  name: tunicCard.name,
  typeText: tunicCard.typeText,
  rulesText: tunicCard.functionalTextPlain ?? "",
};

const authoredCardCandidate = (canonicalId: string, authoredName: string) => {
  const definition = fleshAndBloodStructuredCardsByCanonicalId.get(canonicalId);
  if (!definition) throw new Error(`Authored fixture card ${canonicalId} is unavailable.`);
  return {
    entity: { kind: "card" as const, instanceId: canonicalId },
    text: { key: authoredName },
    enabled: true,
  };
};

const resolution = (id: string, title: string, step = title, pendingCount = 1) => ({
  actingPlayerId: "player",
  pendingCount,
  currentEffect: { id, text: { key: title } },
  currentStep: { index: 1, count: 1, text: { key: step } },
});

const view = (
  action: InteractionAction,
  title: string,
  pendingCount = 1,
  step = title,
): EngineInteractionView => ({
  protocolVersion: INTERACTION_PROTOCOL_VERSION,
  gameSlug: "flesh-and-blood",
  actorId: "player",
  stateVersion: 1,
  status: "choosing",
  resolution: resolution(action.id, title, step, pendingCount),
  actions: [action],
});

const targetCards = [
  authoredCardCandidate("RP6pJj9WtwbTT79qdHPkz", "Fyendal's Spring Tunic"),
  authoredCardCandidate("HDKn8nJQDRBKdgdTcjqh9", "Phantasmal Footsteps"),
  authoredCardCandidate("NRHdp6LTtCDKbJngJPCmN", "Crown of Providence"),
];

const drawerTargetView = view(
  {
    id: "choose-card",
    requestId: "choose-card:1",
    intent: "choose-targets",
    text: { key: "Choose a card from your graveyard" },
    enabled: true,
    inputs: [
      {
        kind: "entity-selection",
        id: "card",
        text: { key: "Choose a card from your graveyard" },
        required: true,
        role: "target",
        entityKinds: ["card"],
        min: 1,
        max: 2,
        ordered: false,
        candidates: targetCards,
      },
    ],
  },
  "Graveyard selection",
  1,
  "Choose one or two cards from your graveyard, then confirm your selection.",
);

const directOrderView = view(
  {
    id: "order-deck-cards",
    requestId: "order-deck-cards:1",
    intent: "choose-option",
    text: { key: "Order cards on the bottom of your deck" },
    enabled: true,
    inputs: [
      {
        kind: "entity-partition",
        id: "deck-order",
        text: { key: "Order cards on the bottom of your deck" },
        entityKind: "card",
        candidateSetText: { key: "Cards being ordered" },
        candidates: targetCards,
        assignment: "exhaustive",
        routes: [
          {
            id: "bottom",
            text: { key: "Bottom of deck" },
            kind: "destination",
            ordered: true,
            orderDirection: "bottom-first",
            min: 0,
            max: targetCards.length,
          },
        ],
      },
    ],
  },
  "Deck ordering",
  1,
  "Order cards on the bottom of your deck",
);

const FIXTURES: readonly PromptFixture[] = [
  {
    id: "ready-action",
    label: "Ready action",
    description: "An inputless action drafted before resolution starts.",
    view: {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "player",
      stateVersion: 1,
      status: "ready",
      actions: [
        {
          id: "pass-priority",
          requestId: "pass-priority:1",
          intent: "pass",
          text: { key: "Pass priority" },
          enabled: true,
          inputs: [],
        },
      ],
    },
    actionId: "pass-priority",
    actionPresentation: {
      title: "Priority: You",
      body: "The combat chain is waiting for your response.",
      footerInstruction: "Respond to the current layer or pass priority.",
      submitLabel: "Pass priority",
    },
  },
  {
    id: "source-inspection",
    label: "Source inspection",
    description: "Inspect the real authored source card before committing its action.",
    view: {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "player",
      stateVersion: 1,
      status: "ready",
      actions: [
        {
          id: "activate-tunic",
          requestId: "activate-tunic:1",
          intent: "activate",
          text: { key: tunicSourceCard.name },
          enabled: true,
          inputs: [],
        },
      ],
    },
    actionId: "activate-tunic",
    actionPresentation: {
      title: tunicSourceCard.name,
      body: "Remove 3 energy counters to gain 1 resource.",
      details: tunicSourceCard.rulesText,
      footerInstruction: "Inspect the source card or activate its instant ability.",
      submitLabel: "Activate",
    },
    sourceCard: tunicSourceCard,
  },
  {
    id: "expanded-details",
    label: "Expanded details",
    description: "The compact rail grown vertically to reveal secondary card and effect text.",
    view: {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "player",
      stateVersion: 1,
      status: "ready",
      actions: [
        {
          id: "activate-tunic-expanded",
          requestId: "activate-tunic-expanded:1",
          intent: "activate",
          text: { key: tunicSourceCard.name },
          enabled: true,
          inputs: [],
        },
      ],
    },
    actionId: "activate-tunic-expanded",
    actionPresentation: {
      title: tunicSourceCard.name,
      body: "Remove 3 energy counters to gain 1 resource.",
      details: tunicSourceCard.rulesText,
      footerInstruction: "Inspect the source card or activate its instant ability.",
      submitLabel: "Activate",
    },
    defaultDetailsExpanded: true,
    sourceCard: tunicSourceCard,
  },
  {
    id: "binary",
    label: "Yes / no",
    description: "A required binary decision with two direct actions.",
    view: view(
      {
        id: "resolve-maybe",
        requestId: "resolve-maybe:1",
        intent: "choose-option",
        text: { key: "Choose whether to redraw your hand" },
        enabled: true,
        inputs: [
          {
            kind: "boolean",
            id: "redraw",
            text: { key: "Keep your hand or redraw it?" },
            required: true,
            trueText: { key: "Redraw" },
            falseText: { key: "Keep hand" },
          },
        ],
      },
      "Mulligan",
      1,
      "Keep your hand or redraw it?",
    ),
  },
  {
    id: "options",
    label: "Multiple options",
    description: "Select one or more named modes, then confirm.",
    view: view(
      {
        id: "choose-modes",
        requestId: "choose-modes:1",
        intent: "choose-option",
        text: { key: "Choose modes" },
        enabled: true,
        inputs: [
          {
            kind: "option-selection",
            id: "modes",
            text: { key: "Choose one or both modes" },
            required: true,
            min: 1,
            max: 2,
            options: [
              { id: "draw", text: { key: "Draw a card" }, enabled: true },
              { id: "create", text: { key: "Create a Runechant token" }, enabled: true },
              { id: "unavailable", text: { key: "Unavailable mode" }, enabled: false },
            ],
          },
        ],
      },
      "Mode selection",
      1,
      "Choose one or both modes",
    ),
  },
  {
    id: "amount",
    label: "Numeric amount",
    description: "A bounded numeric decision, including zero.",
    view: view(
      {
        id: "choose-amount",
        requestId: "choose-amount:1",
        intent: "choose-option",
        text: { key: "Choose how much to pay" },
        enabled: true,
        inputs: [
          {
            kind: "number",
            id: "amount",
            text: { key: "Choose how much to pay" },
            required: true,
            min: 0,
            max: 3,
            step: 1,
          },
        ],
      },
      "Resource payment",
      1,
      "Choose how much to pay",
    ),
  },
  {
    id: "spatial-target",
    label: "Direct board target",
    description: "Exactly one public target; the board owns the highlighted candidates.",
    view: view(
      {
        id: "choose-target",
        requestId: "choose-target:1",
        intent: "choose-targets",
        text: { key: "Choose a target" },
        enabled: true,
        inputs: [
          {
            kind: "entity-selection",
            id: "target",
            text: { key: "Choose an opposing equipment" },
            required: true,
            role: "target",
            entityKinds: ["card"],
            min: 1,
            max: 1,
            ordered: false,
            candidates: targetCards,
          },
        ],
      },
      "Targeting effect",
      1,
      "Choose an opposing equipment",
    ),
    visibleEntityIds: new Set(targetCards.map(({ entity }) => entity.instanceId)),
  },
  {
    id: "drawer-target",
    label: "Drawer target",
    description: "Pick one from a private or dense zone through the shared drawer.",
    view: drawerTargetView,
  },
  {
    id: "selected-target",
    label: "Selected target",
    description: "A staged target with removal, count, and change-selection controls.",
    view: drawerTargetView,
    initialValues: { card: [targetCards[0]!.entity.instanceId] },
  },
  {
    id: "ordering",
    label: "Ordering",
    description: "Choose an ordered sequence from a hidden or dense set.",
    view: view(
      {
        id: "order-cards",
        requestId: "order-cards:1",
        intent: "choose-option",
        text: { key: "Put cards back in any order" },
        enabled: true,
        inputs: [
          {
            kind: "ordering",
            id: "ordered-cards",
            text: { key: "Put these cards on the bottom in any order" },
            required: true,
            entityKind: "card",
            min: 3,
            max: 3,
            candidates: targetCards,
          },
        ],
      },
      "Deck ordering",
      1,
      "Put these cards on the bottom in any order",
    ),
  },
  {
    id: "partition",
    label: "Card destinations",
    description: "Assign visible cards across multiple effect destinations.",
    view: view(
      {
        id: "partition-cards",
        requestId: "partition-cards:1",
        intent: "choose-option",
        text: { key: "Resolve the cards you looked at" },
        enabled: true,
        inputs: [
          {
            kind: "entity-partition",
            id: "destinations",
            text: { key: "Resolve the cards you looked at" },
            entityKind: "card",
            candidateSetText: { key: "Cards from the top of your deck" },
            candidates: targetCards,
            assignment: "exhaustive",
            routes: [
              {
                id: "hand",
                text: { key: "Put into hand" },
                kind: "extract",
                ordered: false,
                min: 1,
                max: 1,
              },
              {
                id: "bottom",
                text: { key: "Put on the bottom" },
                kind: "destination",
                ordered: true,
                orderDirection: "bottom-first",
                min: 2,
                max: 2,
              },
            ],
          },
        ],
      },
      "Deck inspection",
      1,
      "Resolve the cards you looked at",
    ),
  },
  {
    id: "direct-order",
    label: "Direct ordering",
    description: "Reorder visible cards with drag, arrow controls, or keyboard input.",
    view: directOrderView,
  },
  {
    id: "optional-amount",
    label: "Optional decision",
    description: "A dependent choice that can be skipped without resolving it.",
    view: view(
      {
        id: "optional-amount",
        requestId: "optional-amount:1",
        intent: "choose-option",
        text: { key: "Choose how much to pay for the optional effect" },
        enabled: true,
        inputs: [
          {
            kind: "boolean",
            id: "optional",
            text: { key: "Use the optional effect?" },
            required: true,
            trueText: { key: "Use effect" },
            falseText: { key: "Skip effect" },
          },
          {
            kind: "number",
            id: "amount",
            text: { key: "Choose how much to pay" },
            required: false,
            requiredWhen: [{ all: [{ inputId: "optional", value: true }] }],
            min: 0,
            max: 3,
            step: 1,
          },
        ],
      },
      "Optional effect",
    ),
  },
  {
    id: "opponent",
    label: "Opponent progress",
    description: "Non-acting state with a queued resolution still in progress.",
    view: {
      ...view(
        {
          id: "opponent-choice",
          requestId: "opponent-choice:1",
          intent: "choose-option",
          text: { key: "Opponent chooses a mode" },
          enabled: true,
          inputs: [],
        },
        "Opponent is resolving an effect",
        3,
      ),
      actorId: "opponent",
      resolution: {
        ...resolution("opponent-choice", "Opponent is resolving an effect", undefined, 3),
        actingPlayerId: "opponent",
        currentStep: { index: 2, count: 3, text: { key: "Opponent chooses a mode" } },
      },
    },
  },
];

export default function InteractionPromptFixturesPage() {
  const location = useLocation();
  const selectedId = readFixtureId(location.search);
  const fixture =
    selectedId === "all" ? undefined : FIXTURES.find((candidate) => candidate.id === selectedId);
  const title = fixture ? fixture.label : "All states";

  useEffect(() => {
    document.title = `Interactive prompt fixtures · ${title}`;
  }, [title]);

  return (
    <main
      className="min-h-svh bg-[#080d18] px-4 py-5 text-[#e7edf8] sm:px-6 lg:px-8"
      data-fixture-state={selectedId}
    >
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-4 border-b border-[#2a3a53] pb-4 sm:mb-6 sm:pb-6">
          <a
            className="inline-flex min-h-10 items-center rounded-md border border-[#33445e] px-3 text-sm font-semibold text-[#c9d6e8] transition hover:border-[#65c8ff] hover:text-white"
            href={buildMountedHref("/simulator-ui-fixtures")}
          >
            Shared UI fixtures
          </a>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] sm:mt-5 sm:text-5xl">
            Interactive prompt states
          </h1>
          <p className="mt-3 max-w-[72ch] text-sm leading-6 text-[#a9b8ce] sm:text-base">
            A linkable visual lab for every prompt presentation family. Use the controls inside each
            fixture to inspect selection, placement, minimization, and confirmation states.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
          <nav
            aria-label="Interactive prompt state"
            className="flex snap-x gap-1.5 overflow-x-auto rounded-xl border border-[#2a3a53] bg-[#0d1421] p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:sticky lg:top-6 lg:grid lg:max-h-[calc(100svh-3rem)] lg:content-start lg:overflow-y-auto"
          >
            <a
              href={`${buildMountedHref("/simulator-ui-fixtures/interaction-prompt")}?state=all`}
              aria-current={selectedId === "all" ? "page" : undefined}
              className={`min-w-max snap-start rounded-lg px-3 py-2.5 transition lg:min-w-0 lg:py-3 ${
                selectedId === "all"
                  ? "bg-[#173452] text-white"
                  : "text-[#b9c7d9] hover:bg-[#152237] hover:text-white"
              }`}
            >
              <span className="block text-sm font-bold">All states</span>
              <span className="mt-1 hidden text-xs leading-5 text-[#8ea1ba] lg:block">
                Compare every prompt family in one vertical pass.
              </span>
            </a>
            {FIXTURES.map((candidate) => {
              const selected = candidate.id === selectedId;
              return (
                <a
                  key={candidate.id}
                  href={`${buildMountedHref("/simulator-ui-fixtures/interaction-prompt")}?state=${candidate.id}`}
                  aria-current={selected ? "page" : undefined}
                  className={`min-w-max snap-start rounded-lg px-3 py-2.5 transition lg:min-w-0 lg:py-3 ${
                    selected
                      ? "bg-[#173452] text-white"
                      : "text-[#b9c7d9] hover:bg-[#152237] hover:text-white"
                  }`}
                >
                  <span className="block text-sm font-bold">{candidate.label}</span>
                  <span className="mt-1 hidden text-xs leading-5 text-[#8ea1ba] lg:block">
                    {candidate.description}
                  </span>
                </a>
              );
            })}
          </nav>

          {fixture ? <FixturePanel fixture={fixture} /> : <AllFixturePanels />}
        </div>
      </div>
    </main>
  );
}

function FixturePanel({ fixture }: { readonly fixture: PromptFixture }) {
  const focused = isFocusedFixture(fixture);
  const expanded = fixture.id === "selected-target" || fixture.id === "expanded-details";
  return (
    <section
      aria-label={`${fixture.label} interactive prompt fixture`}
      className={`${focused ? "min-h-[520px]" : expanded ? "min-h-[420px]" : "min-h-[240px]"} overflow-hidden rounded-xl border border-[#2a3a53] bg-[#101827] shadow-[0_24px_80px_rgb(0_0_0_/_0.35)]`}
    >
      <div className="border-b border-[#2a3a53] bg-[#0d1421] px-4 py-3 sm:px-5">
        <h2 className="text-lg font-black">{fixture.label}</h2>
        <p className="mt-1 text-sm text-[#9aa9c0]">{fixture.description}</p>
      </div>
      <PromptFixture fixture={fixture} />
    </section>
  );
}

function AllFixturePanels() {
  return (
    <section aria-label="All interactive prompt fixtures" className="grid gap-4 sm:gap-6">
      {FIXTURES.map((fixture) => (
        <FixturePanel key={fixture.id} fixture={fixture} />
      ))}
    </section>
  );
}

function PromptFixture({ fixture }: { readonly fixture: PromptFixture }) {
  const focused = isFocusedFixture(fixture);
  const expanded = fixture.id === "selected-target" || fixture.id === "expanded-details";
  const [values, setValues] = useState<Record<string, InteractionSubmissionValue>>(() => ({
    ...fixture.initialValues,
  }));
  const [submission, setSubmission] = useState<InteractionSubmission>();
  const [previewedEntityId, setPreviewedEntityId] = useState<string>();
  const [sourceCardOpen, setSourceCardOpen] = useState(false);
  const sourceCardTriggerRef = useRef<HTMLButtonElement>(null);
  const sourceCardCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setValues({ ...fixture.initialValues });
    setSubmission(undefined);
    setPreviewedEntityId(undefined);
    setSourceCardOpen(false);
  }, [fixture.id, fixture.initialValues]);

  useEffect(() => {
    if (sourceCardOpen) sourceCardCloseRef.current?.focus();
  }, [sourceCardOpen]);

  const closeSourceCard = () => {
    setSourceCardOpen(false);
    sourceCardTriggerRef.current?.focus();
  };

  const previewedLabel = previewedEntityId
    ? targetCards.find(({ entity }) => entity.instanceId === previewedEntityId)?.text.key
    : undefined;

  return (
    <div
      className={`relative py-4 sm:p-6 ${focused ? "min-h-[440px]" : expanded ? "min-h-[350px]" : "min-h-[170px]"}`}
    >
      <div className="absolute inset-x-0 top-1/2 h-px bg-[#29435f]" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-[#29435f]" />
      <div
        className={`relative mx-auto flex max-w-[1080px] items-center justify-center ${
          focused ? "min-h-[400px]" : expanded ? "min-h-[300px]" : "min-h-[120px]"
        }`}
      >
        {fixture.sourceCard && sourceCardOpen ? (
          <aside
            aria-label={`${fixture.sourceCard.name} card preview`}
            onKeyDown={(event) => {
              if (event.key !== "Escape") return;
              event.preventDefault();
              event.stopPropagation();
              closeSourceCard();
            }}
            className="absolute right-0 top-0 z-[500] w-[min(15rem,calc(100%-1rem))] rounded-xl border border-[#45617f] bg-[#0a111d] p-3 shadow-[0_20px_60px_rgb(0_0_0_/_0.6)]"
          >
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-black text-white">{fixture.sourceCard.name}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-[#8eacc9]">
                    {fixture.sourceCard.typeText}
                  </p>
                </div>
                <button
                  ref={sourceCardCloseRef}
                  type="button"
                  aria-label="Close card preview"
                  onClick={closeSourceCard}
                  className="grid size-11 shrink-0 place-items-center rounded-md text-[#a9b8ce] transition hover:bg-[#1a2b40] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66c7ff] sm:size-8"
                >
                  <IconX size={16} aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 line-clamp-4 text-[11px] leading-4 text-[#c3d0df]">
                {fixture.sourceCard.rulesText}
              </p>
            </div>
          </aside>
        ) : null}
        <InteractionResolutionPrompt
          view={fixture.view}
          viewerId="player"
          values={values}
          visibleEntityIds={fixture.visibleEntityIds}
          actionId={fixture.actionId}
          actionPresentation={fixture.actionPresentation}
          defaultDetailsExpanded={fixture.defaultDetailsExpanded}
          renderEffectTitle={
            fixture.sourceCard
              ? (title) => (
                  <button
                    ref={sourceCardTriggerRef}
                    type="button"
                    aria-label={`Inspect ${title}`}
                    aria-expanded={sourceCardOpen}
                    onClick={() => (sourceCardOpen ? closeSourceCard() : setSourceCardOpen(true))}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-left text-inherit underline decoration-[#52708f] decoration-dotted underline-offset-4 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66c7ff] sm:min-h-8"
                  >
                    <IconEye size={14} stroke={2.2} aria-hidden="true" />
                    <span>{title}</span>
                  </button>
                )
              : undefined
          }
          onChange={(inputId, value) => setValues((current) => ({ ...current, [inputId]: value }))}
          onClearInput={(inputId) =>
            setValues((current) =>
              Object.fromEntries(Object.entries(current).filter(([id]) => id !== inputId)),
            )
          }
          onClear={() => setValues({})}
          onSubmit={setSubmission}
          onOrderedCandidatePreview={(_input, entityId) => setPreviewedEntityId(entityId)}
          onOrderedCandidatePreviewEnd={() => setPreviewedEntityId(undefined)}
        />
      </div>
      <p className="relative mt-4 text-center text-xs text-[#8ea1ba]" role="status">
        {submission
          ? `Submitted ${submission.actionId}`
          : sourceCardOpen && fixture.sourceCard
            ? `Inspecting ${fixture.sourceCard.name}`
            : previewedLabel
              ? `Inspecting ${previewedLabel}`
              : "Interactive fixture — submissions remain local."}
      </p>
    </div>
  );
}

function isFocusedFixture(fixture: PromptFixture): boolean {
  return fixture.view.actions.some((action) =>
    action.inputs.some((input) => input.kind === "entity-partition"),
  );
}

function readFixtureId(search: string): PromptFixtureSelectionId {
  const requested = new URLSearchParams(search).get("state");
  if (requested === "all") return "all";
  return FIXTURES.some((fixture) => fixture.id === requested)
    ? (requested as PromptFixtureId)
    : "ready-action";
}
