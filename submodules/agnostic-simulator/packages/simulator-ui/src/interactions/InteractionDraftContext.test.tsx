// @vitest-environment jsdom
import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type InteractionSubmission,
} from "@tcg/protocol";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { InteractionDraftProvider, useInteractionDraft } from "./InteractionDraftContext";
import {
  actionableInputs,
  currentActionableInput,
  implicitSubmissionValues,
} from "./interaction-presentation";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

const view: EngineInteractionView = {
  protocolVersion: INTERACTION_PROTOCOL_VERSION,
  gameSlug: "gundam",
  stateVersion: 7,
  actorId: "p1",
  status: "ready",
  actions: [
    {
      id: "activateAbility",
      requestId: "request-7",
      intent: "activate",
      text: { key: "Activate effect" },
      enabled: true,
      inputs: [
        {
          kind: "option-selection",
          id: "effectIndex",
          text: { key: "Choose effect" },
          required: true,
          min: 1,
          max: 1,
          options: [{ id: "0", text: { key: "Effect zero" }, enabled: true }],
        },
        {
          kind: "entity-selection",
          id: "targets",
          text: { key: "Pay cost" },
          required: true,
          role: "cost",
          entityKinds: ["card"],
          min: 2,
          max: 2,
          ordered: false,
          candidates: ["command-1", "command-2"].map((instanceId) => ({
            entity: { kind: "card" as const, instanceId },
            enabled: true,
          })),
          requiredWhen: [{ all: [{ inputId: "effectIndex", value: "0" }] }],
        },
      ],
    },
  ],
};

const partitionView: EngineInteractionView = {
  ...view,
  actions: [
    {
      id: "discard",
      requestId: "request-partition",
      intent: "choose-targets",
      text: { key: "Discard a card" },
      enabled: true,
      inputs: [
        {
          kind: "entity-partition",
          id: "partition",
          text: { key: "Choose destinations" },
          required: true,
          entityKind: "card",
          candidates: ["card-a"].map((instanceId) => ({
            entity: { kind: "card" as const, instanceId },
            enabled: true,
          })),
          routes: [
            {
              id: "discard",
              text: { key: "Discard" },
              kind: "destination",
              ordered: false,
              min: 1,
              max: 1,
              candidateIds: ["card-a"],
            },
            {
              id: "keep",
              text: { key: "Keep" },
              kind: "destination",
              ordered: false,
              min: 0,
              max: 1,
              candidateIds: [],
            },
          ],
          assignment: "exhaustive",
        },
      ],
    },
  ],
};

const immediateActionView: EngineInteractionView = {
  ...view,
  actions: [
    {
      id: "deployUnit",
      requestId: "request-deploy",
      intent: "play-card",
      text: { key: "Deploy Unit" },
      enabled: true,
      inputs: [
        {
          kind: "entity-selection",
          id: "cardId",
          text: { key: "Choose a Unit" },
          required: true,
          role: "source",
          entityKinds: ["card"],
          min: 1,
          max: 1,
          ordered: false,
          candidates: [{ entity: { kind: "card", instanceId: "unit-1" }, enabled: true }],
        },
      ],
    },
  ],
};

const automaticDeckLookView: EngineInteractionView = {
  ...view,
  actions: [
    {
      id: "resolveEffect",
      requestId: "request-empty-deck-look",
      intent: "order-cards",
      text: { key: "Resolve deck look" },
      enabled: true,
      inputs: [
        {
          kind: "entity-partition",
          id: "deckLookAnswers.0",
          text: { key: "Look at cards" },
          required: true,
          entityKind: "card",
          candidates: [{ entity: { kind: "card", instanceId: "revealed-card" }, enabled: true }],
          routes: [
            {
              id: "tutorCardId",
              text: { key: "Add to Hand" },
              kind: "extract",
              ordered: false,
              min: 0,
              max: 1,
              candidateIds: [],
            },
          ],
          assignment: "remainder-automatic",
          remainderText: { key: "Return cards to deck" },
        },
      ],
    },
  ],
};

function Harness() {
  const draft = useInteractionDraft();
  const action = view.actions[0]!;
  const input = currentActionableInput(action, draft.values, draft.confirmedInputIds);
  return (
    <>
      <button type="button" onClick={() => draft.begin("activateAbility")}>
        Begin
      </button>
      <button type="button" onClick={() => draft.change("effectIndex", ["0"])}>
        Choose effect
      </button>
      <button type="button" onClick={() => draft.toggleEntity("targets", "command-1")}>
        First
      </button>
      <button type="button" onClick={() => draft.toggleEntity("targets", "command-2")}>
        Second
      </button>
      <button type="button" onClick={draft.confirmCurrent}>
        Confirm
      </button>
      <output data-testid="current-input">{input?.id ?? "complete"}</output>
    </>
  );
}

function PartitionHarness() {
  const draft = useInteractionDraft();
  return (
    <>
      <button type="button" onClick={() => draft.begin("discard")}>
        Begin partition
      </button>
      <button type="button" onClick={() => draft.toggleEntity("partition", "card-a")}>
        Discard card
      </button>
      <button type="button" onClick={draft.confirmCurrent}>
        Confirm partition
      </button>
    </>
  );
}

function ImmediateActionHarness() {
  const draft = useInteractionDraft();
  return (
    <>
      <button type="button" onClick={() => draft.begin("deployUnit", { cardId: ["unit-1"] })}>
        Deploy Unit
      </button>
      <output data-testid="draft-state">{draft.active ? "active" : "idle"}</output>
    </>
  );
}

describe("InteractionDraftProvider", () => {
  it("submits a fully specified action without opening a draft", () => {
    const onSubmit = vi.fn((_submission: InteractionSubmission) => true);
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() => {
      root?.render(
        <InteractionDraftProvider view={immediateActionView} onSubmit={onSubmit}>
          <ImmediateActionHarness />
        </InteractionDraftProvider>,
      );
    });

    act(() => {
      [...container!.querySelectorAll("button")]
        .find((candidate) => candidate.textContent === "Deploy Unit")!
        .click();
    });

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ actionId: "deployUnit", values: { cardId: ["unit-1"] } }),
    );
    expect(container.querySelector('[data-testid="draft-state"]')?.textContent).toBe("idle");
  });

  it("auto-seeds only option inputs explicitly marked as implicit", () => {
    const explicitInput = view.actions[0]!.inputs[0]!;
    if (explicitInput.kind !== "option-selection") throw new Error("Expected option input");
    const action = {
      ...view.actions[0]!,
      inputs: [
        { ...explicitInput, id: "visibleChoice" },
        { ...explicitInput, id: "engineToken", implicit: true },
      ],
    };

    expect(actionableInputs(action).map((input) => input.id)).toEqual(["visibleChoice"]);
    expect(implicitSubmissionValues(action)).toEqual({ engineToken: ["0"] });
  });

  it("advances immediate choices but waits for confirmation of a complete multi-card cost", () => {
    const onSubmit = vi.fn((_submission: InteractionSubmission) => true);
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() => {
      root?.render(
        <InteractionDraftProvider view={view} onSubmit={onSubmit}>
          <Harness />
        </InteractionDraftProvider>,
      );
    });

    const button = (name: string) =>
      [...container!.querySelectorAll("button")].find(
        (candidate) => candidate.textContent === name,
      )!;
    const currentInput = () =>
      container!.querySelector('[data-testid="current-input"]')!.textContent;

    act(() => button("Begin").click());
    expect(currentInput()).toBe("effectIndex");
    act(() => button("Choose effect").click());
    expect(currentInput()).toBe("targets");
    act(() => button("First").click());
    act(() => button("Second").click());
    expect(onSubmit).not.toHaveBeenCalled();
    expect(currentInput()).toBe("targets");

    act(() => button("Confirm").click());
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit.mock.calls[0]![0].values).toMatchObject({
      effectIndex: ["0"],
      targets: ["command-1", "command-2"],
    });
  });

  it("reopens a rejected confirmation and retries the same submission", () => {
    const onSubmit = vi.fn((_submission: InteractionSubmission) => false);
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() => {
      root?.render(
        <InteractionDraftProvider view={view} onSubmit={onSubmit}>
          <Harness />
        </InteractionDraftProvider>,
      );
    });

    const button = (name: string) =>
      [...container!.querySelectorAll("button")].find(
        (candidate) => candidate.textContent === name,
      )!;
    const currentInput = () =>
      container!.querySelector('[data-testid="current-input"]')!.textContent;

    act(() => button("Begin").click());
    act(() => button("Choose effect").click());
    act(() => button("First").click());
    act(() => button("Second").click());
    act(() => button("Confirm").click());

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(currentInput()).toBe("targets");

    act(() => button("Confirm").click());
    expect(onSubmit).toHaveBeenCalledTimes(2);
    expect(onSubmit.mock.calls[1]![0].values).toEqual(onSubmit.mock.calls[0]![0].values);
  });

  it("initializes every partition route when selecting a direct board candidate", () => {
    const onSubmit = vi.fn((_submission: InteractionSubmission) => true);
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() => {
      root?.render(
        <InteractionDraftProvider view={partitionView} onSubmit={onSubmit}>
          <PartitionHarness />
        </InteractionDraftProvider>,
      );
    });

    const button = (name: string) =>
      [...container!.querySelectorAll("button")].find(
        (candidate) => candidate.textContent === name,
      )!;
    act(() => button("Begin partition").click());
    act(() => button("Discard card").click());
    act(() => button("Confirm partition").click());

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: { partition: { discard: ["card-a"], keep: [] } },
      }),
    );
  });

  it("submits an empty automatic partition after confirmation", () => {
    const onSubmit = vi.fn((_submission: InteractionSubmission) => true);
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    function EmptyPartitionHarness() {
      const draft = useInteractionDraft();
      return (
        <>
          <button type="button" onClick={() => draft.begin("resolveEffect")}>
            Begin empty partition
          </button>
          <button type="button" onClick={draft.confirmCurrent}>
            Confirm empty partition
          </button>
        </>
      );
    }
    act(() => {
      root?.render(
        <InteractionDraftProvider view={automaticDeckLookView} onSubmit={onSubmit}>
          <EmptyPartitionHarness />
        </InteractionDraftProvider>,
      );
    });

    act(() => {
      [...container!.querySelectorAll("button")]
        .find((candidate) => candidate.textContent === "Begin empty partition")!
        .click();
    });
    act(() => {
      [...container!.querySelectorAll("button")]
        .find((candidate) => candidate.textContent === "Confirm empty partition")!
        .click();
    });

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ values: { "deckLookAnswers.0": { tutorCardId: [] } } }),
    );
  });

  it("does not confirm an empty partition that violates a conditional route minimum", () => {
    const onSubmit = vi.fn((_submission: InteractionSubmission) => true);
    const invalidView: EngineInteractionView = {
      ...automaticDeckLookView,
      actions: [
        {
          ...automaticDeckLookView.actions[0]!,
          inputs: automaticDeckLookView.actions[0]!.inputs.map((input) =>
            input.kind === "entity-partition"
              ? {
                  ...input,
                  routes: input.routes.map((route) => ({
                    ...route,
                    minWhenRemainingAtLeast: { count: 1, min: 1 },
                  })),
                }
              : input,
          ),
        },
      ],
    };
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    function InvalidPartitionHarness() {
      const draft = useInteractionDraft();
      return (
        <>
          <button type="button" onClick={() => draft.begin("resolveEffect")}>
            Begin invalid partition
          </button>
          <button type="button" onClick={draft.confirmCurrent}>
            Confirm invalid partition
          </button>
        </>
      );
    }
    act(() => {
      root?.render(
        <InteractionDraftProvider view={invalidView} onSubmit={onSubmit}>
          <InvalidPartitionHarness />
        </InteractionDraftProvider>,
      );
    });

    act(() => {
      [...container!.querySelectorAll("button")]
        .find((candidate) => candidate.textContent === "Begin invalid partition")!
        .click();
    });
    act(() => {
      [...container!.querySelectorAll("button")]
        .find((candidate) => candidate.textContent === "Confirm invalid partition")!
        .click();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
