// @vitest-environment jsdom
import {
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildInteractionSubmission, type InteractionAction } from "@tcg/protocol";
import { grandArchivePlayerId, grandArchiveObjectId } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import {
  GrandArchiveServerEngine,
  projectGrandArchiveSimulator,
} from "@tcg/grand-archive-server-adapter";
import { libraryWitch, savageSlash, spiritOfFire, spiritOfWind } from "@tcg/grand-archive-cards";
import { GrandArchiveSimulatorProviders } from "./App";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";
import { GrandArchiveTabletop } from "./GrandArchiveTabletop";
import { GrandArchiveHands } from "./GrandArchiveHands";
import { GrandArchiveInteractionLayer } from "./GrandArchiveInteractionLayer";
import { grandArchiveHarnessFixture, type GrandArchiveHarnessFixture } from "./fixtureProjection";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "opportunity")!;
const hand = fixture.table.zones.find(
  (zone) =>
    zone.role === "hand" &&
    zone.ownerId === fixture.table.seats.find((seat) => seat.perspective === "bottom")!.id,
)!;
const nativeView = fixture.interactionView!;
const declaration = nativeView.actions.find(
  (action) =>
    action.source && hand.entityIds.includes(action.source.instanceId) && action.inputs.length > 0,
)!;

function mount(current: GrandArchiveHarnessFixture = fixture) {
  const submit = vi.fn(() => true);
  const undo = vi.fn();
  const element = (value: GrandArchiveHarnessFixture) => (
    <GrandArchiveSimulatorProviders>
      <GrandArchiveInteractionLayer fixture={value} onSubmit={submit}>
        <GrandArchiveHands
          fixture={value}
          onSubmitProtocolInteraction={submit}
          canUndo
          onUndo={undo}
        />
      </GrandArchiveInteractionLayer>
    </GrandArchiveSimulatorProviders>
  );
  const rendered = render(element(current));
  return {
    submit,
    undo,
    update: (value: GrandArchiveHarnessFixture) => rendered.rerender(element(value)),
  };
}
function cardButton(id: string) {
  const region = screen.getByRole("region", { name: /Your hand/ });
  const button = region.querySelector<HTMLButtonElement>(`button[data-sim-entity-id="${id}"]`);
  if (!button) throw new Error(`Missing hand card ${id}`);
  return button;
}
function withAction(action: InteractionAction): GrandArchiveHarnessFixture {
  return {
    ...fixture,
    interactionView: { ...nativeView, actions: [action] },
    interactions: fixture.interactions.filter((entry) => entry.id === action.id),
  };
}

describe("Grand Archive shared hands", () => {
  it("opens a field card's choices with the keyboard and begins only the chosen action", async () => {
    const field = fixture.table.zones.find((zone) => zone.id === `${hand.ownerId}:field`)!;
    const sourceId = field.entityIds[0]!;
    const source = fixture.entities.find((entity) => entity.id === sourceId)!;
    const original = fixture.interactions.find((entry) => entry.id === declaration.id)!;
    const choices = ["First ability", "Second ability"].map((label, index) => ({
      ...declaration,
      id: `field-ability-${index}`,
      source: { kind: "card" as const, instanceId: sourceId },
      text: { key: label },
    }));
    const { submit } = mount({
      ...fixture,
      interactionView: { ...nativeView, actions: choices },
      interactions: choices.map((action) => ({
        ...original,
        id: action.id,
        sourceEntityId: sourceId,
        label: `${action.text.key} · Draw a card.`,
        movePreview: { ...original.movePreview, command: "activate-ability" },
      })),
    });
    const card = within(screen.getByRole("region", { name: /Your field,/ })).getByRole("button", {
      name: new RegExp(`^${source.title}`),
    });
    expect(card.closest(".ga-role-card")?.textContent).toContain("Activate");
    card.focus();
    await userEvent.setup().keyboard("{Enter}");
    expect(await screen.findAllByRole("menuitem", { hidden: true })).toHaveLength(2);
    expect(screen.getAllByText("Draw a card.")).toHaveLength(2);
    expect(submit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Second ability"));
    expect(screen.getByTestId("interaction-resolution-prompt")).toBeTruthy();
    expect(document.querySelector(".ga-role-card[data-actionable]")).toBeNull();
    expect(submit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();
    expect(document.querySelector(".ga-role-card[data-actionable]")).not.toBeNull();
  });

  it("guides attack targeting on the field and clears the guide on cancel or state change", async () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "attack-targeting")!;
    const attack = current.interactions.find(
      (entry) => entry.movePreview.command === "declare-attack",
    )!;
    const action = current.interactionView!.actions.find((entry) => entry.id === attack.id)!;
    const { submit, update } = mount({
      ...current,
      interactions: [attack],
      interactionView: { ...current.interactionView!, actions: [action] },
    });
    const source = document.querySelector<HTMLButtonElement>(
      `.ga-seat-zone--field button[data-sim-entity-id="${attack.sourceEntityId}"]`,
    )!;
    fireEvent.click(source);
    expect(screen.getByText("Choose attack targets")).toBeTruthy();
    expect(source.closest(".ga-role-card")?.getAttribute("data-attack-role")).toBe("source");
    const input = action.inputs.find((input) => input.id === "attack-targets");
    if (!input || input.kind !== "entity-selection") throw new Error("Expected attack targets");
    for (const candidate of input.candidates.filter((candidate) => candidate.enabled !== false)) {
      const target = document.querySelector<HTMLButtonElement>(
        `.ga-seat-zone--field button[data-sim-entity-id="${candidate.entity.instanceId}"]`,
      )!;
      expect(target.closest(".ga-role-card")?.getAttribute("data-attack-role")).toBe("candidate");
    }
    const targetId = input.candidates.find((candidate) => candidate.enabled !== false)!.entity
      .instanceId;
    const target = document.querySelector<HTMLButtonElement>(
      `.ga-seat-zone--field button[data-sim-entity-id="${targetId}"]`,
    )!;
    fireEvent.mouseEnter(target);
    fireEvent.click(target);
    expect(target.closest(".ga-role-card")?.getAttribute("data-attack-role")).toBe("target");
    expect(screen.getByText("Choose the defending player")).toBeTruthy();
    expect(submit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Choose none" }));
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        actionId: action.id,
        values: expect.objectContaining({
          attacker: [attack.sourceEntityId],
          "attack-targets": [targetId],
          "delegated-player": [],
        }),
      }),
    );
    fireEvent.click(source);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(document.querySelector("[data-attack-role]")).toBeNull();
    fireEvent.click(source);
    update({
      ...current,
      table: {
        ...current.table,
        status: { ...current.table.status, stateVersion: current.table.status.stateVersion + 1 },
      },
    });
    expect(document.querySelector("[data-attack-role]")).toBeNull();
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("publishes board card interaction state through data-card-interaction", () => {
    const current = withAction(declaration);
    const { submit } = mount(current);
    const target = declaration.inputs[0];
    if (target?.kind !== "entity-selection") {
      throw new Error("Expected a structured GA target input");
    }
    const opponentFieldId = target.candidates.find((candidate) =>
      current.table.zones.some(
        (zone) => zone.id === "p2:field" && zone.entityIds.includes(candidate.entity.instanceId),
      ),
    )!.entity.instanceId;
    const boardCard = () =>
      document
        .querySelector<HTMLButtonElement>(
          `.ga-seat-zone--field button[data-sim-entity-id="${opponentFieldId}"]`,
        )!
        .closest<HTMLElement>(".ga-seat-zone__card");
    expect(boardCard()!.getAttribute("data-card-interaction")).toBe("idle");
    fireEvent.click(cardButton(declaration.source!.instanceId));
    expect(screen.getByTestId("interaction-resolution-prompt")).toBeTruthy();
    expect(boardCard()!.getAttribute("data-card-interaction")).toBe("targetable");
    expect(submit).not.toHaveBeenCalled();
  });

  it.each(["first-card", "second-card", "sidebar"] as const)(
    "preserves attacker choice from %s with multiple legal attackers",
    async (entry) => {
      const original = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
        (fixture) => fixture.id === "attack-targeting",
      )!;
      const interaction = original.interactions.find(
        (item) => item.movePreview.command === "declare-attack",
      )!;
      const action = original.interactionView!.actions.find((item) => item.id === interaction.id)!;
      const attacker = action.inputs.find((input) => input.id === "attacker");
      const targets = action.inputs.find((input) => input.id === "attack-targets");
      if (attacker?.kind !== "entity-selection" || targets?.kind !== "entity-selection")
        throw new Error("Missing attack choices");
      expect(attacker.candidates.length).toBeGreaterThan(1);
      const current = {
        ...original,
        interactions: [interaction],
        interactionView: { ...original.interactionView!, actions: [action] },
      };
      const submit = vi.fn(() => true);
      render(
        <GrandArchiveSimulatorProviders>
          <GrandArchiveTabletop fixture={current} onSubmitProtocolInteraction={submit} />
        </GrandArchiveSimulatorProviders>,
      );
      const card = (id: string) =>
        document.querySelector<HTMLButtonElement>(
          `.ga-seat-zone--field button[data-sim-entity-id="${id}"]`,
        )!;
      for (const candidate of attacker.candidates) {
        expect(card(candidate.entity.instanceId).closest(".ga-role-card")?.textContent).toContain(
          "Attack",
        );
      }
      const chosenId = attacker.candidates[entry === "first-card" ? 0 : 1]!.entity.instanceId;
      if (entry === "sidebar") {
        fireEvent.click(screen.getByRole("tab", { name: "Now" }));
        fireEvent.click(within(screen.getByLabelText("Legal actions")).getByRole("button"));
        expect(document.querySelector('[data-attack-role="source"]')).toBeNull();
        expect(screen.queryByText("Choose attack targets")).toBeNull();
      }
      fireEvent.click(card(chosenId));
      expect(screen.getByText("Choose attack targets")).toBeTruthy();
      expect(card(chosenId).closest(".ga-role-card")?.getAttribute("data-attack-role")).toBe(
        "source",
      );
      const targetId = targets.candidates[0]!.entity.instanceId;
      fireEvent.click(card(targetId));
      fireEvent.click(screen.getByRole("button", { name: "Choose none" }));
      expect(submit).toHaveBeenCalledWith(
        expect.objectContaining({
          actionId: action.id,
          values: expect.objectContaining({ attacker: [chosenId], "attack-targets": [targetId] }),
        }),
      );
    },
  );

  it("does not mark an attack intent source as the selected attacker", () => {
    const original = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (fixture) => fixture.id === "attack-targeting",
    )!;
    const interaction = original.interactions.find(
      (item) => item.movePreview.command === "declare-attack",
    )!;
    const action = original.interactionView!.actions.find((item) => item.id === interaction.id)!;
    const attacker = action.inputs.find((input) => input.id === "attacker")!;
    const decision = { ...action, inputs: [{ ...attacker, id: "attack" }] };
    const { submit } = mount({
      ...original,
      interactions: [interaction],
      interactionView: { ...original.interactionView!, actions: [decision] },
    });
    fireEvent.click(
      document.querySelector<HTMLButtonElement>(
        `.ga-seat-zone--field button[data-sim-entity-id="${interaction.sourceEntityId}"]`,
      )!,
    );
    expect(screen.getByTestId("interaction-resolution-prompt")).toBeTruthy();
    expect(document.querySelector('[data-attack-role="source"]')).toBeNull();
    expect(submit).not.toHaveBeenCalled();
  });

  it("keeps mobile counters, inspection, and hand actions in the viewport rails", async () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(390);
    const submit = vi.fn(() => true);
    const undo = vi.fn();
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop
          fixture={fixture}
          onSubmitProtocolInteraction={submit}
          canUndo
          onUndo={undo}
        />
      </GrandArchiveSimulatorProviders>,
    );
    const yours = await screen.findByRole("group", { name: "Your zone counts" });
    const opponent = screen.getByRole("group", { name: "Opponent zone counts" });
    expect(yours.closest("footer")).not.toBeNull();
    expect(opponent.closest("header")).not.toBeNull();
    for (const [group, owner] of [
      [yours, "Your"],
      [opponent, "Opponent"],
    ] as const) {
      expect(within(group).getAllByRole("button")).toHaveLength(5);
      for (const zone of ["Deck", "Material Deck", "Graveyard", "Banishment", "Memory"]) {
        expect(
          within(group).getByRole("button", { name: new RegExp(`^${owner} ${zone},`) }),
        ).toBeTruthy();
      }
    }
    const actions = screen.getByRole("group", { name: "Hand actions" });
    expect(actions.closest("footer")).toBe(yours.closest("footer"));
    expect(screen.getByRole("button", { name: "Actions & history" }).closest("footer")).toBe(
      actions.closest("footer"),
    );
    fireEvent.click(within(yours).getByRole("button", { name: /Your Memory,/ }));
    const dialog = await screen.findByRole("dialog", { name: /Your Memory/ });
    expect(within(dialog).getByRole("region", { name: /Your memory,/ })).toBeTruthy();
    fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    fireEvent.click(within(actions).getByRole("button", { name: "Undo" }));
    expect(undo).toHaveBeenCalledTimes(1);
    fireEvent.click(within(actions).getByRole("button", { name: /Pass/ }));
    const pass = nativeView.actions.find((action) => action.intent === "pass")!;
    expect(submit).toHaveBeenCalledExactlyOnceWith(
      buildInteractionSubmission({ view: nativeView, action: pass }),
    );
  });

  it.each(["hand", "player section"])(
    "lets vertical wheel input reveal the clipped %s before scrolling sideways",
    (target) => {
      mount();
      const handRegion = screen.getByRole("region", { name: /Your hand/ });
      const verticalRegion =
        target === "hand" ? handRegion : handRegion.closest<HTMLElement>(".ga-player-hand-section");
      if (!verticalRegion) throw new Error("Missing hand scroll region");
      verticalRegion.style.overflowY = "auto";
      Object.defineProperties(handRegion, {
        clientWidth: { configurable: true, value: 200 },
        scrollWidth: { configurable: true, value: 800 },
      });
      Object.defineProperties(verticalRegion, {
        clientHeight: { configurable: true, value: 80 },
        scrollHeight: { configurable: true, value: 160 },
      });
      const wheel = (deltaY: number) => {
        const event = createEvent.wheel(handRegion, { deltaY, cancelable: true });
        fireEvent(handRegion, event);
        return event;
      };
      expect(wheel(40).defaultPrevented).toBe(false);
      expect(handRegion.scrollLeft).toBe(0);
      verticalRegion.scrollTop = 80;
      expect(wheel(-40).defaultPrevented).toBe(false);
      expect(handRegion.scrollLeft).toBe(0);
      expect(wheel(40).defaultPrevented).toBe(true);
      expect(handRegion.scrollLeft).toBe(40);
      verticalRegion.scrollTop = 0;
      expect(wheel(-40).defaultPrevented).toBe(true);
      expect(handRegion.scrollLeft).toBe(0);
    },
  );

  it("picks up the material deck, lets the player inspect their hand, and restores it after the phase", () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (entry) => entry.id === "materialization-choice",
    )!;
    const { submit, update } = mount(current);
    const material = screen.getByRole("region", { name: /Your material deck/ });
    const self = current.table.seats.find((seat) => seat.perspective === "bottom")!;
    const zone = current.table.zones.find((zone) => zone.id === `${self.id}:material-deck`)!;
    expect(material.querySelectorAll("button[data-sim-entity-id]")).toHaveLength(
      zone.entityIds.length,
    );
    expect(screen.queryByRole("region", { name: /Your hand/ })).toBeNull();
    expect(screen.queryByRole("button", { name: "Board and material actions" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^Hand ·/ }));
    expect(screen.getByRole("region", { name: /Your hand/ })).toBeTruthy();
    expect(screen.queryByRole("region", { name: /Your material deck/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^Material deck ·/ }));
    expect(screen.getByRole("region", { name: /Your material deck/ })).toBeTruthy();
    expect(submit).not.toHaveBeenCalled();
    const skip = current.interactions.find(
      (entry) => entry.movePreview.command === "skip-materialization",
    )!;
    fireEvent.click(screen.getByRole("button", { name: "Skip materialization" }));
    expect(submit).toHaveBeenCalledExactlyOnceWith(
      buildInteractionSubmission({
        view: current.interactionView!,
        action: current.interactionView!.actions.find((action) => action.id === skip.id)!,
        values: {},
      }),
    );
    update(fixture);
    expect(screen.getByRole("region", { name: /Your hand/ })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /^Material deck ·/ })).toBeNull();
  });

  it("restores the real hand and locks the material toggle while selecting hand cards", () => {
    const base = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (entry) => entry.id === "materialization-hand",
    )!;
    const ownHand = base.table.zones.find((zone) => zone.id === "p1:hand")!;
    const materialize = base.interactionView!.actions.find(
      (action) => action.source && action.enabled,
    )!;
    const action: InteractionAction = {
      ...materialize,
      inputs: [
        {
          id: "reserve",
          kind: "entity-selection",
          text: { key: "Choose two reserve cards" },
          role: "cost",
          entityKinds: ["card"],
          min: 2,
          max: 2,
          ordered: false,
          candidates: ownHand.entityIds.map((id) => ({
            entity: { kind: "card", instanceId: id },
            enabled: true,
          })),
        },
      ],
    };
    const { submit } = mount({
      ...base,
      interactionView: { ...base.interactionView!, actions: [action] },
    });
    const material = screen.getByRole("region", { name: /Your material deck/ });
    fireEvent.click(
      material.querySelector<HTMLButtonElement>(
        `button[data-sim-entity-id="${action.source!.instanceId}"]`,
      )!,
    );
    expect(screen.getByRole("region", { name: /Your hand/ })).toBeTruthy();
    expect(screen.queryByRole("region", { name: /Your material deck/ })).toBeNull();
    expect(screen.getByRole("button", { name: /^Material deck ·/ }).hasAttribute("disabled")).toBe(
      true,
    );
    fireEvent.click(cardButton(ownHand.entityIds[0]!));
    expect(cardButton(ownHand.entityIds[0]!).getAttribute("aria-pressed")).toBe("true");
    expect(submit).not.toHaveBeenCalled();
  });

  it("materializes directly from a card in the temporary hand", () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (entry) => entry.id === "materialization-hand",
    )!;
    const interaction = current.interactions.find(
      (entry) => entry.movePreview.command === "materialize",
    )!;
    const action = current.interactionView!.actions.find((entry) => entry.id === interaction.id)!;
    const { submit } = mount(current);
    const material = screen.getByRole("region", { name: /Your material deck/ });
    const legalSources = new Set(
      current.interactions
        .filter((entry) => entry.movePreview.command === "materialize")
        .map((entry) => entry.sourceEntityId),
    );
    expect(material.querySelectorAll('[data-card-interaction="actionable"]')).toHaveLength(
      legalSources.size,
    );
    expect(material.querySelectorAll('[data-card-interaction="idle"]').length).toBeGreaterThan(0);
    fireEvent.click(
      material.querySelector<HTMLButtonElement>(
        `button[data-sim-entity-id="${interaction.sourceEntityId}"]`,
      )!,
    );
    if (action.inputs.length === 0) {
      expect(submit).toHaveBeenCalledExactlyOnceWith(
        buildInteractionSubmission({ view: current.interactionView!, action, values: {} }),
      );
    } else {
      expect(screen.getByTestId("interaction-resolution-prompt")).toBeTruthy();
      expect(submit).not.toHaveBeenCalled();
    }
  });

  it("uses Space to skip materialization through the same Pass action", () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (entry) => entry.id === "materialization-hand",
    )!;
    const { submit } = mount(current);
    const skip = current.interactions.find(
      (entry) => entry.movePreview.command === "skip-materialization",
    )!;
    fireEvent.keyDown(document.body, { code: "Space", key: " " });
    expect(submit).toHaveBeenCalledExactlyOnceWith(
      buildInteractionSubmission({
        view: current.interactionView!,
        action: current.interactionView!.actions.find((action) => action.id === skip.id)!,
        values: {},
      }),
    );
  });

  it("retains the normal hand's material-card context menu and detailed inspection", async () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (entry) => entry.id === "materialization-hand",
    )!;
    const { submit } = mount(current);
    const material = screen.getByRole("region", { name: /Your material deck/ });
    fireEvent.contextMenu(within(material).getByRole("button", { name: /Life Essence Amulet/ }), {
      button: 2,
    });
    expect(await screen.findByRole("menuitem", { name: /Materialize/, hidden: true })).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Switch to detailed card view"));
    fireEvent.click(screen.getByLabelText("Show Life Essence Amulet card image"));
    expect(screen.getByLabelText("Hide Life Essence Amulet card image")).toBeTruthy();
    expect(submit).not.toHaveBeenCalled();
  });

  it("also skips materialization from the sidebar Pass control without a duplicate skip action", () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (entry) => entry.id === "materialization-hand",
    )!;
    const submit = vi.fn(() => true);
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop fixture={current} onSubmitProtocolInteraction={submit} />
      </GrandArchiveSimulatorProviders>,
    );
    expect(screen.getAllByRole("button", { name: "Skip materialization" })).toHaveLength(2);
    fireEvent.click(
      within(screen.getByTestId("grand-archive-sidebar")).getByRole("button", {
        name: "Skip materialization",
      }),
    );
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("keeps the normal hand while the opponent is materializing", () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (entry) => entry.id === "materialization-choice",
    )!;
    const opponent = current.table.seats.find((seat) => seat.perspective === "top")!;
    mount({
      ...current,
      waitState: { kind: "materialization-choice", playerId: grandArchivePlayerId(opponent.id) },
    });
    expect(screen.queryByRole("region", { name: /Your material deck/ })).toBeNull();
    expect(screen.getByRole("region", { name: /Your hand/ })).toBeTruthy();
  });

  it("automatically completes empty pregame exactly once without a board button", () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "pregame-action")!;
    const action = current.interactionView!.actions.find((entry) =>
      current.interactions.some(
        (interaction) =>
          interaction.id === entry.id &&
          interaction.movePreview.command === "complete-pregame-actions",
      ),
    )!;
    const { submit, update } = mount(current);
    update(current);
    expect(screen.queryByRole("button", { name: /complete pre-game actions/i })).toBeNull();
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenCalledWith(
      buildInteractionSubmission({ view: current.interactionView!, action, values: {} }),
    );
  });

  it("keeps optional pregame actions in the shared prompt and waits for the player", () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "pregame-action")!;
    const completion = current.interactions.find(
      (entry) => entry.movePreview.command === "complete-pregame-actions",
    )!;
    const completionAction = current.interactionView!.actions.find(
      (entry) => entry.id === completion.id,
    )!;
    const startId = "grand-archive:test-starting-card";
    const choice = {
      ...completionAction,
      id: startId,
      text: { key: "Start an eligible card" },
    };
    const projected: GrandArchiveHarnessFixture = {
      ...current,
      interactions: [
        ...current.interactions,
        {
          ...completion,
          id: startId,
          label: "Start an eligible card",
          movePreview: { ...completion.movePreview, command: "start-pregame-card" },
        },
      ],
      interactionView: {
        ...current.interactionView!,
        actions: [...current.interactionView!.actions, choice],
      },
    };
    const { submit } = mount(projected);
    expect(submit).not.toHaveBeenCalled();
    const prompt = screen.getByTestId("interaction-resolution-prompt");
    expect(within(prompt).getByText("Before the game begins")).toBeTruthy();
    fireEvent.click(within(prompt).getByRole("button", { name: "Start an eligible card" }));
    expect(submit).toHaveBeenCalledExactlyOnceWith(
      buildInteractionSubmission({ view: projected.interactionView!, action: choice, values: {} }),
    );
  });

  it("keeps the board readable when the interaction projection is unavailable", () => {
    mount({ ...fixture, interactionView: undefined });
    expect(screen.getByRole("region", { name: /Your hand/ })).toBeTruthy();
    expect(screen.getByRole("region", { name: /Opponent hand/ })).toBeTruthy();
    expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();
  });

  it("shows the pending effect text immediately without opening prompt controls", async () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "effects-stack")!;
    mount(current);
    const stack = screen.getByRole("region", { name: /Effects Stack, \d+ layers?/ });
    expect(stack.querySelector('[data-top="true"]')).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Pass Opportunity" })).toBeNull();
    expect(screen.getAllByRole("button", { name: "Pass Space" })).toHaveLength(1);

    expect(screen.getByText(/Cardistry/)).toBeTruthy();
  });

  it.each(["card-activation", "materialization", "activated-ability", "triggered-ability"])(
    "explains a pending %s and passes through the fixed control",
    (kind) => {
      const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "effects-stack")!;
      const selfId = current.table.seats.find((seat) => seat.perspective === "bottom")!.id;
      const topId = current.table.zones
        .find((zone) => zone.id === "effects-stack")!
        .entityIds.at(-1);
      const projected = {
        ...current,
        entities: current.entities.map((entity) =>
          entity.id === topId
            ? {
                ...entity,
                ownerId: selfId,
                details: { rules: [] },
                dataAttributes: { ...entity.dataAttributes, "data-stack-item-kind": kind },
              }
            : entity,
        ),
      };
      const { submit } = mount(projected);
      const subject = kind.endsWith("ability") ? "ability" : "card";
      expect(
        screen.getByText(`You have Opportunity. Respond to your ${subject} or use Pass.`),
      ).toBeTruthy();
      expect(
        within(screen.getByTestId("interaction-resolution-prompt")).queryByRole("button", {
          name: /Pass/,
        }),
      ).toBeNull();
      fireEvent.click(screen.getByRole("button", { name: "Pass Space" }));
      const pass = projected.interactionView!.actions.find(
        (action) => action.intent === "pass" && action.enabled,
      )!;
      expect(submit).toHaveBeenCalledExactlyOnceWith(
        buildInteractionSubmission({ view: projected.interactionView!, action: pass, values: {} }),
      );
    },
  );

  it("responds to an opponent card with the existing Space shortcut", () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "effects-stack")!;
    const opponentId = current.table.seats.find((seat) => seat.perspective === "top")!.id;
    const topId = current.table.zones.find((zone) => zone.id === "effects-stack")!.entityIds.at(-1);
    const projected = {
      ...current,
      entities: current.entities.map((entity) =>
        entity.id === topId ? { ...entity, ownerId: opponentId, details: { rules: [] } } : entity,
      ),
    };
    const { submit } = mount(projected);
    expect(
      screen.getByText("You have Opportunity. Respond to your opponent’s card or use Pass."),
    ).toBeTruthy();
    fireEvent.keyDown(document.body, { code: "Space", key: " " });
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("renders GA combat roles in a dedicated workspace", () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (entry) => entry.id === "combat-declaration",
    )!;
    mount(current);
    const workspace = screen.getByRole("region", { name: "Combat workspace" });
    expect(within(workspace).getByRole("region", { name: "Attack" })).toBeTruthy();
    expect(within(workspace).getByRole("region", { name: "Defend" })).toBeTruthy();
    const field = screen.getByRole("region", { name: /Your field,/ });
    expect(within(field).getByRole("button", { name: /Combat role: attacker/ })).toBeTruthy();
    expect(within(workspace).getByRole("list", { name: "Combat step progress" })).toBeTruthy();
    expect(workspace.textContent).toContain("Awaiting choice");
    fireEvent.click(within(workspace).getByRole("button", { name: "Collapse combat" }));
    expect(within(workspace).queryByRole("region", { name: "Attack" })).toBeNull();
    expect(workspace.textContent).toContain("To defender");
    fireEvent.click(within(workspace).getByRole("button", { name: "Expand combat" }));
    expect(within(workspace).getByRole("region", { name: "Attack" })).toBeTruthy();
  });

  it("explains combat role icons on the board and in combat", async () => {
    mount(GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "combat-damage")!);
    const workspace = screen.getByRole("region", { name: "Combat workspace" });
    const badge = within(workspace).getByLabelText("Combat role: retaliator");
    expect(screen.getAllByLabelText("Combat role: retaliator").length).toBeGreaterThan(1);
    expect(badge.textContent).toBe("");
    fireEvent.focus(badge);
    await waitFor(() =>
      expect(screen.getByRole("tooltip").textContent).toContain(
        "Chosen to retaliate against the attacker",
      ),
    );
  });

  it("explains compact combat numbers on keyboard focus", async () => {
    mount(GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "combat-damage")!);
    const workspace = screen.getByRole("region", { name: "Combat workspace" });
    fireEvent.focus(within(workspace).getByLabelText("To defender: 1 projected damage"));
    await waitFor(() =>
      expect(screen.getByRole("tooltip").textContent).toContain("To defender: 1 projected damage"),
    );
  });

  it("removes the combat workspace when combat ends and shows the next combat", () => {
    const active = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "combat-damage")!;
    const completed = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "combat-result")!;
    const { update } = mount(active);
    expect(screen.getByRole("region", { name: "Combat workspace" })).toBeTruthy();

    update(completed);
    expect(screen.queryByRole("region", { name: "Combat workspace" })).toBeNull();

    update(active);
    expect(screen.getByRole("region", { name: "Combat workspace" })).toBeTruthy();
  });

  it.each([
    ["projected", 0],
    ["projected", 1],
    ["dealt", 0],
    ["dealt", 1],
  ] as const)(
    "classifies redirected %s retaliation with %s direct damage by source",
    (kind, directDamage) => {
      const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "combat-damage")!;
      const view = current.combatView!;
      const attackerId = view.combat.attackerId;
      const defenderId = view.combat.retaliatorIds[0]!;
      const allyId = grandArchiveObjectId("redirected-ally");
      const attacker = current.entities.find((entity) => entity.id === attackerId)!;
      mount({
        ...current,
        entities: [
          ...current.entities,
          { ...attacker, id: allyId, title: "Linked ally", decorations: [] },
        ],
        combatView: {
          ...view,
          active: true,
          damage: {
            kind,
            amounts: [
              { sourceId: attackerId, recipientId: defenderId, amount: 1 },
              { sourceId: defenderId, recipientId: attackerId, amount: directDamage },
              { sourceId: defenderId, recipientId: allyId, amount: 2 },
            ],
          },
        },
      });
      const workspace = screen.getByRole("region", { name: "Combat workspace" });
      expect(
        within(workspace).getByLabelText(
          `To defender: 1 ${kind === "dealt" ? "damage dealt" : "projected damage"}`,
        ),
      ).toBeTruthy();
      expect(
        within(workspace).getByLabelText(
          `To attacking side: ${directDamage + 2} ${kind === "dealt" ? "damage dealt" : "projected retaliation damage"}`,
        ),
      ).toBeTruthy();
      expect(
        within(workspace).getByLabelText(
          `Retaliates for ${directDamage + 2} ${kind === "dealt" ? "damage dealt" : "projected damage"}`,
        ),
      ).toBeTruthy();
      expect(within(workspace).getByRole("region", { name: "Defend" }).textContent).not.toContain(
        "Linked ally",
      );
      fireEvent.click(within(workspace).getByText("Damage breakdown"));
      expect(within(workspace).getByText(/Linked ally receives/).textContent).toBe(
        "Linked ally receives 2 from retaliation.",
      );
    },
  );

  it("keeps the combat step and forecast visible when participant entities leave", () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "combat-damage")!;
    mount({ ...current, entities: [] });
    const workspace = screen.getByRole("region", { name: "Combat workspace" });
    expect(workspace.textContent).toContain("Before damage");
    expect(workspace.textContent).toContain("Left combat");
    expect(within(workspace).getByRole("list", { name: "Combat step progress" })).toBeTruthy();
  });

  it("selects recollection cards through the focused Memory choice dialog", async () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "decision")!;
    const { submit } = mount(current);
    const dialog = await screen.findByRole("dialog", { name: "Choose cards" });
    const memoryCounter = screen.getByRole("button", { name: /Your Memory,/, hidden: true });
    expect(memoryCounter.hasAttribute("data-targetable")).toBe(false);
    fireEvent.click(
      within(dialog).getByRole("button", { name: /Evasive Maneuvers/, pressed: false }),
    );
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  });

  it("keeps explicitly revealed memory cards face up", async () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "decision")!;
    mount({
      ...current,
      interactionView: undefined,
      entities: current.entities.map((entity) => ({
        ...entity,
        dataAttributes: { ...entity.dataAttributes, "data-facing": "face-up" },
      })),
    });
    fireEvent.click(screen.getByRole("button", { name: /Your Memory,/ }));
    const memory = await screen.findByRole("region", { name: /Your memory,/ });
    const candidate = within(memory).getByRole("button", { name: /Evasive Maneuvers/ });
    expect(candidate.getAttribute("data-face")).toBe("public");
  });

  it.each(["right-click", "long-press"] as const)(
    "permits %s inspection of authorized face-down memory cards",
    async (gesture) => {
      const id = hand.entityIds[0]!;
      const entity = fixture.entities.find((entry) => entry.id === id)!;
      mount({
        ...fixture,
        table: {
          ...fixture.table,
          zones: fixture.table.zones.map((zone) =>
            zone.id === `${hand.ownerId}:memory`
              ? { ...zone, entityIds: [id], count: 1 }
              : { ...zone, entityIds: zone.entityIds.filter((entry) => entry !== id) },
          ),
        },
      });
      fireEvent.click(screen.getByRole("button", { name: /Your Memory,/ }));
      const memory = await screen.findByRole("region", { name: /Your memory,/ });
      const card = within(memory).getByRole("button", { name: entity.title });
      expect(card.getAttribute("data-face")).toBe("hidden");
      expect(card.getAttribute("data-sim-entity-id")).toBeNull();
      const anchor = card.closest<HTMLElement>("[data-sim-entity-id]");
      expect(anchor?.getAttribute("role")).toBe("group");
      expect(anchor?.tabIndex).toBe(-1);
      expect(card.tabIndex).toBe(0);
      if (gesture === "right-click") {
        fireEvent.contextMenu(card, { button: 2 });
      } else {
        const press = createEvent.pointerDown(card, { bubbles: true });
        Object.defineProperties(press, {
          pointerType: { value: "touch" },
          pointerId: { value: 1 },
          button: { value: 0 },
        });
        fireEvent(card, press);
      }
      expect(await screen.findByLabelText("Switch to detailed card view")).toBeTruthy();
      if (gesture === "long-press") {
        const release = createEvent.pointerUp(card, { bubbles: true });
        Object.defineProperty(release, "pointerId", { value: 1 });
        fireEvent(card, release);
        // The inspection menu must remain usable after the browser release click.
        fireEvent.click(card);
      }
      fireEvent.click(screen.getByLabelText("Switch to detailed card view"));
      expect(screen.getByLabelText(`Show ${entity.title} card image`)).toBeTruthy();
    },
  );

  it("shows observer-safe decision progress without private candidates", () => {
    const current = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (entry) => entry.id === "decision-observer",
    )!;
    mount(current);
    const prompt = screen.getByTestId("interaction-resolution-prompt");
    expect(prompt.textContent).toContain("Opponent is choosing…");
    expect(within(prompt).queryByRole("button", { name: /Recollect/ })).toBeNull();
  });

  it("renders the field and compact Memory counters in both player seats", () => {
    mount();
    const opponent = screen.getByRole("region", { name: "Opponent arena" });
    const self = screen.getByRole("region", { name: "Your arena" });
    expect(within(self).getByRole("region", { name: /Your field,/ })).toBeTruthy();
    expect(within(self).getByRole("button", { name: /Your Memory,/ })).toBeTruthy();
    expect(within(opponent).getByRole("region", { name: /Opponent field,/ })).toBeTruthy();
    expect(within(opponent).getByRole("button", { name: /Opponent Memory,/ })).toBeTruthy();
    expect(self.getAttribute("data-turn")).toBe("true");
    expect(self.getAttribute("data-agency")).toBe("true");
    expect(self.getAttribute("data-opportunity")).toBe("true");
    expect(within(self).getByRole("status", { name: "You have Opportunity" })).toBeTruthy();
    expect(opponent.getAttribute("data-agency")).toBeNull();
  });

  it("renders concealed memory from its count without borrowing identities from other zones", async () => {
    const opponent = fixture.table.seats.find((seat) => seat.perspective === "top")!;
    mount({
      ...fixture,
      table: {
        ...fixture.table,
        zones: fixture.table.zones.map((zone) =>
          zone.id === `${opponent.id}:memory`
            ? { ...zone, count: 3, entityIds: [], visibility: "private" }
            : zone,
        ),
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Opponent Memory, 3 cards" }));
    const memory = await screen.findByRole("region", { name: "Opponent memory, 3 cards" });
    expect(within(memory).getAllByTestId("card")).toHaveLength(3);
    expect(within(memory).queryAllByRole("button")).toHaveLength(0);
    expect(memory.querySelector("[data-sim-entity-id]")).toBeNull();
    fireEvent.contextMenu(within(memory).getAllByTestId("card")[0]!, { button: 2 });
    expect(screen.queryByRole("menu")).toBeNull();
    for (const card of within(memory).getAllByTestId("card")) {
      expect(card.getAttribute("data-face")).toBe("hidden");
      expect(card.getAttribute("data-card-id")).toBeNull();
      expect(card.getAttribute("data-definition-id")).toBeNull();
    }
  });

  it("uses private deck piles and permits inspecting only viewer-visible material cards", async () => {
    const self = fixture.table.seats.find((seat) => seat.perspective === "bottom")!;
    const knownId = hand.entityIds[0]!;
    const known = fixture.entities.find((entity) => entity.id === knownId)!;
    mount({
      ...fixture,
      table: {
        ...fixture.table,
        zones: fixture.table.zones.map((zone) =>
          zone.id === `${self.id}:material-deck`
            ? { ...zone, count: 1, entityIds: [knownId] }
            : zone,
        ),
      },
    });
    const arena = screen.getByRole("region", { name: "Your arena" });
    const deck = arena.querySelector<HTMLElement>('[data-zone="main-deck"]')!;
    expect(deck.querySelector("img")).toBeNull();
    expect(within(deck).getByRole("button", { name: /Your Deck,/ })).toBeTruthy();
    fireEvent.click(
      within(arena).getByRole("button", {
        name: "Your Material Deck, 1 card, 1 with available actions",
      }),
    );
    const dialog = await screen.findByRole("dialog", { name: "Material Deck · 1 card" });
    expect(within(dialog).getByRole("button", { name: new RegExp(known.title) })).toBeTruthy();
  });

  it("keeps turn ownership separate when the opponent must make a decision", () => {
    const opponentId = grandArchivePlayerId(
      fixture.table.seats.find((seat) => seat.perspective === "top")!.id,
    );
    mount({
      ...fixture,
      waitState: { kind: "decision", playerId: opponentId, decisionKind: "choose-cards" },
    });
    const opponent = screen.getByRole("region", { name: "Opponent arena" });
    const self = screen.getByRole("region", { name: "Your arena" });
    expect(self.getAttribute("data-turn")).toBe("true");
    expect(self.getAttribute("data-agency")).toBeNull();
    expect(opponent.getAttribute("data-turn")).toBeNull();
    expect(opponent.getAttribute("data-agency")).toBe("true");
    expect(opponent.getAttribute("data-agency-kind")).toBe("decision");
    expect(opponent.getAttribute("data-opportunity")).toBeNull();
    expect(within(opponent).getByRole("status", { name: "Opponent is deciding" })).toBeTruthy();
  });

  it("shows no player agency while automatic effects are resolving", () => {
    mount({ ...fixture, waitState: { kind: "resolving" } });
    expect(document.querySelector(".ga-agency-signal")).toBeNull();
    expect(screen.getByRole("region", { name: "Your arena" }).getAttribute("data-turn")).toBe(
      "true",
    );
  });

  it("renders both hands through HandZone without exposing opponent identities or actions", () => {
    const { submit } = mount();
    const opponent = screen.getByRole("region", { name: "Opponent hand, 7 cards" });
    expect(within(opponent).getByRole("list", { name: "Hand zone" })).toBeTruthy();
    expect(
      within(screen.getByRole("region", { name: /Your hand/ })).getByRole("list", {
        name: "Hand zone",
      }),
    ).toBeTruthy();
    const backs = within(opponent).getAllByRole("button", { name: /Hidden card/ });
    expect(backs).toHaveLength(7);
    expect(backs.every((back) => back.tabIndex === -1)).toBe(true);
    expect(opponent.querySelector("[data-definition-id]")).toBeNull();
    fireEvent.click(backs[0]!);
    fireEvent.contextMenu(backs[0]!, { button: 2 });
    expect(submit).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("submits an input-free action and retains shared card inspection", async () => {
    const action = { ...declaration, inputs: [] };
    const current = withAction(action);
    const { submit } = mount(current);
    fireEvent.click(cardButton(action.source!.instanceId));
    expect(submit).toHaveBeenCalledWith(
      buildInteractionSubmission({ view: current.interactionView!, action }),
    );
    fireEvent.contextMenu(cardButton(action.source!.instanceId), { button: 2 });
    expect(await screen.findByRole("menuitem", { name: /Activate/, hidden: true })).toBeTruthy();
    // Floating UI hides zero-geometry anchors in jsdom; the browser checks visibility.
    fireEvent.click(screen.getByLabelText("Switch to detailed card view"));
    const title = fixture.entities.find((entity) => entity.id === action.source!.instanceId)!.title;
    fireEvent.click(screen.getByLabelText(`Show ${title} card image`));
    expect(screen.getByLabelText(`Hide ${title} card image`)).toBeTruthy();
  });

  it.each(["hand", "sidebar", "field", "material-deck"] as const)(
    "submits all structured inputs from %s",
    async (entry) => {
      const original = withAction(declaration);
      const sourceId = declaration.source!.instanceId;
      const current =
        entry === "field" || entry === "material-deck"
          ? {
              ...original,
              table: {
                ...original.table,
                zones: original.table.zones.map((zone) => ({
                  ...zone,
                  entityIds:
                    zone.id === `${hand.ownerId}:${entry}`
                      ? [...zone.entityIds, sourceId]
                      : zone.entityIds.filter((id) => id !== sourceId),
                  count:
                    zone.id === `${hand.ownerId}:${entry}`
                      ? (zone.count ?? zone.entityIds.length) + 1
                      : zone.entityIds.includes(sourceId)
                        ? (zone.count ?? zone.entityIds.length) - 1
                        : zone.count,
                })),
              },
            }
          : original;
      const submit = vi.fn(() => true);
      render(
        <GrandArchiveSimulatorProviders>
          <GrandArchiveTabletop fixture={current} onSubmitProtocolInteraction={submit} />
        </GrandArchiveSimulatorProviders>,
      );
      if (entry === "sidebar") {
        fireEvent.click(screen.getByRole("tab", { name: "Now" }));
        fireEvent.click(within(screen.getByLabelText("Legal actions")).getByRole("button"));
      } else if (entry === "material-deck") {
        fireEvent.click(screen.getByRole("button", { name: /Your Material Deck,/ }));
        const dialog = await screen.findByRole("dialog");
        fireEvent.click(
          dialog.querySelector<HTMLButtonElement>(`button[data-sim-entity-id="${sourceId}"]`)!,
        );
      } else if (entry === "field") {
        expect(screen.queryByRole("button", { name: "Board and material actions" })).toBeNull();
        const source = document.querySelector<HTMLButtonElement>(
          `.ga-seat-zone--field button[data-sim-entity-id="${sourceId}"]`,
        )!;
        expect(source.closest(".ga-role-card")?.getAttribute("data-actionable")).toBe("true");
        expect(
          source.closest(".ga-role-card")?.querySelector(".ga-role-card__actions")?.textContent,
        ).toBeTruthy();
        fireEvent.click(
          document.querySelector<HTMLButtonElement>(
            `.ga-seat-zone--field button[data-sim-entity-id="${sourceId}"]`,
          )!,
        );
      } else fireEvent.click(cardButton(sourceId));
      const prompt = screen.getByTestId("interaction-resolution-prompt");
      expect(document.querySelector(".ga-role-card[data-actionable] ")).toBeNull();
      expect(prompt.textContent).not.toMatch(/object-\d/);
      const targetInput = declaration.inputs[0]!;
      if (targetInput.kind !== "entity-selection") {
        throw new Error("Expected a structured GA target input");
      }
      const targetId = targetInput.candidates[0]!.entity.instanceId;
      const target = document.querySelector<HTMLButtonElement>(
        `.ga-seat-zone button[data-sim-entity-id="${targetId}"]`,
      );
      if (!target) throw new Error("Expected the target candidate in the choice drawer");
      fireEvent.click(target);
      const nextInput = declaration.inputs[1];
      const values: Record<string, string[]> = { [targetInput.id]: [targetId] };
      if (nextInput?.kind === "option-selection") {
        const option = nextInput.options[0]!;
        values[nextInput.id] = [option.id];
        fireEvent.click(within(prompt).getAllByRole("button", { pressed: false })[0]!);
      } else if (nextInput?.kind === "entity-selection") {
        const paymentId = nextInput.candidates[0]!.entity.instanceId;
        values[nextInput.id] = [paymentId];
        expect(nextInput).toMatchObject({ min: 1, max: 1, ordered: false });
        fireEvent.click(cardButton(paymentId));
        // A singleton payment commits on selection through the shared picker.
        expect(submit).toHaveBeenCalledTimes(1);
      }
      await waitFor(() =>
        expect(submit).toHaveBeenCalledWith(
          buildInteractionSubmission({
            view: current.interactionView!,
            action: declaration,
            values,
          }),
        ),
      );
    },
  );

  it("bounds hand selections and preserves multiple native inputs through confirmation", async () => {
    const ids = hand.entityIds.filter((id) => id !== declaration.source!.instanceId).slice(0, 3);
    const action: InteractionAction = {
      ...declaration,
      inputs: [
        {
          id: "reserve",
          kind: "entity-selection",
          text: { key: "Choose two reserve cards" },
          role: "cost",
          entityKinds: ["card"],
          min: 2,
          max: 2,
          ordered: false,
          candidates: ids.map((id) => ({
            entity: { kind: "card", instanceId: id },
            enabled: true,
          })),
        },
        {
          id: "mode",
          kind: "option-selection",
          text: { key: "Choose a mode" },
          min: 1,
          max: 1,
          options: [
            { id: "first", text: { key: "First mode" }, enabled: true },
            { id: "second", text: { key: "Second mode" }, enabled: true },
          ],
        },
      ],
    };
    const current = withAction(action);
    const { submit } = mount(current);
    fireEvent.click(cardButton(action.source!.instanceId));
    expect(screen.getByRole("button", { name: "Confirm" }).hasAttribute("disabled")).toBe(true);
    ids.forEach((id) => fireEvent.click(cardButton(id)));
    expect(cardButton(ids[0]!).getAttribute("aria-pressed")).toBe("true");
    expect(cardButton(ids[1]!).getAttribute("aria-pressed")).toBe("true");
    expect(cardButton(ids[2]!).getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(submit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("radio", { name: "Second mode" }));
    await waitFor(() =>
      expect(submit).toHaveBeenCalledWith(
        buildInteractionSubmission({
          view: current.interactionView!,
          action,
          values: { reserve: ids.slice(0, 2), mode: ["second"] },
        }),
      ),
    );
  });

  it("cancels drafts and discards them after an authoritative state change", () => {
    const current = withAction(declaration);
    const { submit, update } = mount(current);
    fireEvent.click(cardButton(declaration.source!.instanceId));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();
    fireEvent.click(cardButton(declaration.source!.instanceId));
    update({
      ...current,
      table: {
        ...current.table,
        status: { ...current.table.status, stateVersion: current.table.status.stateVersion + 1 },
      },
    });
    expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();
    expect(submit).not.toHaveBeenCalled();
  });

  it("supports hand controls and shortcuts without stealing typed spaces", () => {
    const { submit, undo } = mount();
    fireEvent.click(
      within(screen.getByRole("group", { name: "Hand actions" })).getByRole("button", {
        name: /Pass/,
      }),
    );
    fireEvent.keyDown(document.body, { code: "Space", key: " " });
    expect(submit).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document.body, { key: "z", ctrlKey: true });
    expect(undo).toHaveBeenCalledTimes(1);
    const input = document.createElement("input");
    document.body.append(input);
    fireEvent.keyDown(input, { code: "Space", key: " " });
    expect(submit).toHaveBeenCalledTimes(1);
    input.remove();
  });
});

describe("Grand Archive resolved-attack decision recovery", () => {
  const dispatchContext = { gameId: "ga-hands-decision", sourceAuthority: "client" as const };
  const ENGINE_DECISION_TIMEOUT = 30_000;

  function submitInputFreeIntent(
    server: GrandArchiveServerEngine,
    actorId: string,
    intent: string,
  ): boolean {
    const view = server.getInteractionView(actorId);
    const action = view.actions.find(
      (candidate) =>
        candidate.enabled && candidate.inputs.length === 0 && candidate.intent === intent,
    );
    if (!action) return false;
    return server.submitInteraction(
      actorId,
      {
        protocolVersion: view.protocolVersion,
        stateVersion: view.stateVersion,
        requestId: action.requestId,
        actionId: action.id,
        values: {},
      },
      dispatchContext,
    ).success;
  }

  /** Activating Savage Slash resolves into a declare-resolved-attack decision for p1. */
  function attackDecisionServer(): GrandArchiveServerEngine {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        id: "p1",
        name: "You",
        champion: spiritOfFire,
        zones: { hand: [savageSlash, libraryWitch, libraryWitch] },
      },
      playerTwo: {
        id: "p2",
        name: "Opponent",
        champion: spiritOfWind,
        zones: { field: [libraryWitch] },
      },
      firstPlayer: "playerOne",
    });
    const server = new GrandArchiveServerEngine(
      game.program,
      new GrandArchiveMatchRuntime(game.program, game.state),
    );
    if (!submitInputFreeIntent(server, "p1", "play-card")) {
      throw new Error("Could not activate Savage Slash");
    }
    for (let count = 0; count < 12 && !server.runtime.state.decision; count++) {
      const wait = server.runtime.waitState();
      if (wait.kind !== "opportunity") break;
      if (!submitInputFreeIntent(server, wait.playerId, "pass")) break;
    }
    return server;
  }

  function decisionFixture(
    server: GrandArchiveServerEngine,
    id: string,
  ): GrandArchiveHarnessFixture {
    const projection = projectGrandArchiveSimulator(
      server.program,
      server.runtime.state,
      grandArchivePlayerId("p1"),
    );
    return grandArchiveHarnessFixture(
      id,
      "Standard practice match",
      "Decision recovery",
      projection,
    );
  }

  function decisionActionOf(current: GrandArchiveHarnessFixture) {
    return current.interactionView!.actions.find((action) =>
      action.id.startsWith("grand-archive:decision:"),
    )!;
  }

  function targetableButtons(): HTMLButtonElement[] {
    return [
      ...document.querySelectorAll<HTMLElement>('[data-card-interaction="targetable"]'),
    ].flatMap((element) => {
      const button = element.querySelector<HTMLButtonElement>("button[data-sim-entity-id]");
      return button ? [button] : [];
    });
  }

  function promptButton(pattern: RegExp): HTMLButtonElement | undefined {
    return [...document.querySelectorAll<HTMLButtonElement>("button")].find(
      (button) => pattern.test(button.textContent ?? "") && !button.hasAttribute("disabled"),
    );
  }

  /** Clicks attacker then target and finishes the decision through its prompt controls. */
  async function answerAttackDecision(
    current: GrandArchiveHarnessFixture,
    submit: ReturnType<typeof vi.fn>,
  ) {
    const action = decisionActionOf(current);
    const attacker = action.inputs.find((input) => input.id === "attackerId");
    if (attacker?.kind !== "entity-selection") throw new Error("Expected the attacker choice");
    const targets = action.inputs.find((input) => input.id === "targetIds");
    if (targets?.kind !== "entity-selection") throw new Error("Expected the target choice");
    const attackerId = attacker.candidates.find((c) => c.enabled !== false)!.entity.instanceId;
    const targetId = targets.candidates.find((c) => c.enabled !== false)!.entity.instanceId;

    fireEvent.click(
      targetableButtons().find((button) => button.dataset.simEntityId === attackerId)!,
    );
    await waitFor(() => {
      if (!targetableButtons().some((button) => button.dataset.simEntityId === targetId)) {
        throw new Error("Attack target was not projected");
      }
    });
    fireEvent.click(targetableButtons().find((button) => button.dataset.simEntityId === targetId)!);
    // The decision advances attacker -> target(s) (Confirm) -> defending player.
    const finishControl = () =>
      promptButton(/^confirm$/i) ?? promptButton(/choose none/i) ?? promptButton(/^select /i);
    for (let step = 0; step < 6 && submit.mock.calls.length === 0; step++) {
      const control = finishControl();
      if (!control) break;
      fireEvent.click(control);
    }
    await waitFor(() => expect(submit).toHaveBeenCalled());
    expect(submit.mock.calls[0]![0]).toMatchObject({
      actionId: action.id,
      values: expect.objectContaining({
        attackerId: [attackerId],
        targetIds: expect.arrayContaining([targetId]),
      }),
    });
  }

  it(
    "auto-begins the declare-resolved-attack decision and submits the chosen attack",
    async () => {
      const server = attackDecisionServer();
      expect(server.runtime.state.decision?.kind).toBe("declare-resolved-attack");
      const current = decisionFixture(server, "ga-decision-direct");
      const { submit } = mount(current);
      await waitFor(() => expect(targetableButtons().length).toBeGreaterThan(0));
      await answerAttackDecision(current, submit);
    },
    ENGINE_DECISION_TIMEOUT,
  );

  it(
    "publishes the defending-player seat as a targetable control with guiding copy",
    async () => {
      const server = attackDecisionServer();
      const current = decisionFixture(server, "ga-decision-seat");
      const { submit } = mount(current);
      await waitFor(() => expect(targetableButtons().length).toBeGreaterThan(0));
      const action = decisionActionOf(current);
      const attackerInput = action.inputs.find((input) => input.id === "attackerId");
      if (attackerInput?.kind !== "entity-selection") throw new Error("Expected attacker choice");
      const targetsInput = action.inputs.find((input) => input.id === "targetIds");
      if (targetsInput?.kind !== "entity-selection") throw new Error("Expected target choice");
      const attackerId = attackerInput.candidates.find((c) => c.enabled !== false)!.entity
        .instanceId;
      const targetId = targetsInput.candidates.find((c) => c.enabled !== false)!.entity.instanceId;
      fireEvent.click(
        targetableButtons().find((button) => button.dataset.simEntityId === attackerId)!,
      );
      await waitFor(() => {
        if (!targetableButtons().some((button) => button.dataset.simEntityId === targetId)) {
          throw new Error("Attack target was not projected");
        }
      });
      fireEvent.click(
        targetableButtons().find((button) => button.dataset.simEntityId === targetId)!,
      );
      // targetIds is 1..2 in this fixture: confirm the single target to advance.
      const confirmTarget = promptButton(/^confirm$/i);
      if (confirmTarget) fireEvent.click(confirmTarget);
      // Terminal step: the defending player is a seat button, not a card — it
      // must carry the shared interaction attribute and name itself in the copy.
      await waitFor(() => {
        const seat = document.querySelector<HTMLButtonElement>(".ga-player-target");
        if (!seat || seat.getAttribute("data-card-interaction") !== "targetable") {
          throw new Error("Defending-player seat is not published as targetable");
        }
      });
      expect(screen.getByText("Select a highlighted player.")).toBeTruthy();
      fireEvent.click(document.querySelector<HTMLButtonElement>(".ga-player-target")!);
      await waitFor(() => expect(submit).toHaveBeenCalled());
      expect(submit).toHaveBeenCalledWith(
        expect.objectContaining({
          actionId: action.id,
          values: expect.objectContaining({
            attackerId: [attackerId],
            targetIds: expect.arrayContaining([targetId]),
          }),
        }),
      );
    },
    ENGINE_DECISION_TIMEOUT,
  );

  it(
    "keeps the decision answerable when the stale-draft invalidation wipes the auto-begun draft",
    async () => {
      const server = attackDecisionServer();
      const before = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
        (entry) => entry.id === "attack-targeting",
      )!;
      const interaction = before.interactions.find(
        (entry) => entry.movePreview.command === "declare-attack",
      )!;
      const action = before.interactionView!.actions.find((entry) => entry.id === interaction.id)!;
      const { submit, update } = mount({
        ...before,
        id: "ga-decision-race",
        interactions: [interaction],
        interactionView: { ...before.interactionView!, actions: [action] },
      });
      // Leave a stale draft open, then flip the same workspace into the decision
      // view: the child auto-begin and the provider's stale-draft invalidation
      // race inside one commit.
      fireEvent.click(
        document.querySelector<HTMLButtonElement>(
          `.ga-seat-zone--field button[data-sim-entity-id="${interaction.sourceEntityId}"]`,
        )!,
      );
      expect(screen.getByText("Choose attack targets")).toBeTruthy();
      const current = decisionFixture(server, "ga-decision-race");
      update(current);
      await waitFor(() => expect(targetableButtons().length).toBeGreaterThan(0));
      await answerAttackDecision(current, submit);
    },
    ENGINE_DECISION_TIMEOUT,
  );
});
