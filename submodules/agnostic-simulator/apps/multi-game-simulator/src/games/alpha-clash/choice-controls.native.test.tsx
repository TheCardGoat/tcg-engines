// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, test, vi } from "vite-plus/test";
import { useState } from "react";
import {
  InteractionWorkspace,
  useInteractionDraft,
  useInteractionSurface,
} from "@tcg/simulator-ui";
import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type InteractionSubmission,
} from "@tcg/protocol";
import type { ProjectedState } from "@tcg/alpha-clash-engine";
import { SharedInteractionPrompt } from "../../components/SharedInteractionPrompt";
import {
  AlphaClashInteractionPanel,
  deferAlphaClashOptionalCosts,
} from "./components/AlphaClashInteractions";
import { createAlphaClashPromptFixture } from "./prompt-fixtures";
import { playFixtureCardFromHand } from "./prompt-fixture-play";

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
afterEach(cleanup);
type Engine = ReturnType<typeof createAlphaClashPromptFixture>;
function submit(engine: Engine, values: InteractionSubmission["values"], actor = "human") {
  const view = engine.getInteractionView("human");
  const action = view.actions.find((a) => a.intent === "choose-option")!;
  return engine.submitInteraction(
    actor,
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      actionId: action.id,
      requestId: action.requestId,
      values,
    },
    { gameId: "native-choice-controls", sourceAuthority: "server" },
  );
}
function Surface({ view, cue }: { view: EngineInteractionView; cue: () => void }) {
  const surface = useInteractionSurface(view);
  return (
    <SharedInteractionPrompt
      surface={surface}
      view={view}
      viewerId="human"
      cards={new Map()}
      onChoose={cue}
      reducedMotion
    />
  );
}
function Fixture({
  engine,
  rejectFirst = false,
  cue = () => {},
}: {
  engine: Engine;
  rejectFirst?: boolean;
  cue?: () => void;
}) {
  const [version, setVersion] = useState(0);
  const [rejected, setRejected] = useState(false);
  const view = engine.getInteractionView("human");
  return (
    <MantineProvider>
      <InteractionWorkspace
        view={view}
        viewerId="human"
        onSubmit={(answer) => {
          if (rejectFirst && !rejected) {
            setRejected(true);
            return false;
          }
          const result = engine.submitInteraction("human", answer, {
            gameId: "native-choice-controls",
            sourceAuthority: "server",
          });
          setVersion(version + 1);
          return result.success;
        }}
      >
        <Surface view={view} cue={cue} />
      </InteractionWorkspace>
    </MantineProvider>
  );
}
test("Haven rejects invalid and wrong-actor answers without changing state, then accepts health", () => {
  const engine = createAlphaClashPromptFixture("prompt-modes");
  playFixtureCardFromHand(engine, "ac-ac1-051");
  const before = JSON.stringify(engine.state);
  expect(submit(engine, { selection: ["invalid"] }).success).toBe(false);
  expect(JSON.stringify(engine.state)).toBe(before);
  const choice = engine.state.pendingChoices[0];
  if (choice.kind !== "modal") throw new Error("Expected Haven mode");
  const health = choice.options.find((o) => o.label.includes("health"))!.id;
  expect(submit(engine, { selection: [health] }, "bot").success).toBe(false);
  expect(JSON.stringify(engine.state)).toBe(before);
  expect(submit(engine, { selection: [health] }).success).toBe(true);
  expect(engine.state.players["player-one"].health).toBe(28);
});
test("Haven UI retries a rejected submission once and resolves a native draw", () => {
  const engine = createAlphaClashPromptFixture("prompt-modes");
  playFixtureCardFromHand(engine, "ac-ac1-051");
  const before = engine.state.deckOrder["player-one"].length;
  const cue = vi.fn();
  render(<Fixture engine={engine} rejectFirst cue={cue} />);
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
  expect(screen.getByLabelText("Current game prompt").getAttribute("data-reduced-motion")).toBe(
    "true",
  );
  fireEvent.click(screen.getByRole("button", { name: /^Draw one card\.?$/ }));
  expect(engine.state.deckOrder["player-one"]).toHaveLength(before);
  fireEvent.click(screen.getByRole("button", { name: "Retry choice" }));
  expect(engine.state.deckOrder["player-one"]).toHaveLength(before - 1);
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(cue).toHaveBeenCalledOnce();
});
test.each([false, true])("Denver native optional choice resolves %s", (accept) => {
  const engine = createAlphaClashPromptFixture("prompt-optional");
  playFixtureCardFromHand(engine, "ac-ac1-001");
  const before = engine.state.deckOrder["player-one"].length;
  render(<Fixture engine={engine} />);
  fireEvent.click(screen.getByRole("button", { name: accept ? "Use" : "Decline" }));
  expect(engine.state.deckOrder["player-one"]).toHaveLength(before - (accept ? 2 : 0));
  if (accept) expect(engine.state.pendingChoices[0].kind).toBe("target");
  else expect(engine.state.pendingChoices).toHaveLength(0);
});
test("opponent projections hide hand identities and cannot answer the pending choice", () => {
  for (const [id, definitionId] of [
    ["prompt-modes", "ac-ac1-051"],
    ["prompt-optional", "ac-ac1-001"],
  ] as const) {
    const engine = createAlphaClashPromptFixture(id);
    playFixtureCardFromHand(engine, definitionId);
    const opponent = engine.getViewerState({ role: "player", actorId: "bot" }) as ProjectedState;
    for (const card of opponent.cards.filter(
      (c) => c.controller === "player-one" && c.zone === "hand",
    )) {
      expect(card.name).toBeNull();
      expect(card.definitionId).toBeNull();
    }
    expect(engine.getInteractionView("bot").actions.some((a) => a.intent === "choose-option")).toBe(
      false,
    );
  }
});

test("required native choices cannot be cancelled from the Match panel", () => {
  const engine = createAlphaClashPromptFixture("prompt-modes");
  playFixtureCardFromHand(engine, "ac-ac1-051");
  const view = engine.getInteractionView("human");
  const onSubmit = vi.fn(() => true);
  render(
    <MantineProvider>
      <InteractionWorkspace view={view} viewerId="human" onSubmit={onSubmit}>
        <AlphaClashInteractionPanel view={view} viewerId="human" onSubmit={onSubmit} />
      </InteractionWorkspace>
    </MantineProvider>,
  );
  expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
  expect(onSubmit).not.toHaveBeenCalled();
});

test("deferred alternative costs keep the play open until the player chooses", () => {
  const engine = createAlphaClashPromptFixture("prompt-alternate-cost");
  const caoLing = Object.values(engine.state.cards).find(
    (card) =>
      card.controller === "player-one" &&
      card.zone === "hand" &&
      card.definitionId === "ac-ac3-063",
  )!;
  const view = engine.getInteractionView("human");
  const play = view.actions.find((action) => action.id === `playCard:${caoLing.instanceId}`)!;
  const submit = vi.fn(() => true);
  function Begin() {
    const draft = useInteractionDraft();
    return (
      <button type="button" onClick={() => draft.begin(play.id)}>
        Begin play
      </button>
    );
  }
  render(
    <MantineProvider>
      <InteractionWorkspace
        view={view}
        viewerId="human"
        onSubmit={submit}
        deferInitialSubmission={deferAlphaClashOptionalCosts}
      >
        <Begin />
        <AlphaClashInteractionPanel view={view} viewerId="human" onSubmit={submit} />
      </InteractionWorkspace>
    </MantineProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Begin play" }));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("radio", { name: "Normal resource cost" }));
  expect(screen.getByRole("button", { name: "Normal" }).getAttribute("aria-pressed")).toBe("true");
  // The selected route still needs its explicit resource payment.
  expect(submit).not.toHaveBeenCalled();
});
