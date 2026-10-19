// @vitest-environment jsdom
import { useState } from "react";
import { woodlandSquirrels } from "@tcg/grand-archive-cards";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { projectGrandArchiveViewerSimulator } from "@tcg/grand-archive-server-adapter";
import { GrandArchiveSimulatorProviders } from "./App";
import { GrandArchiveTabletop } from "./GrandArchiveTabletop";
import { grandArchiveHarnessFixture } from "./fixtureProjection";
import { findGrandArchiveNativeFixture } from "./native-fixtures";
afterEach(cleanup);

it("lets the player restart an impossible dependent declaration without submitting it", async () => {
  const { server, submissions } = renderNativeFixture("native-dependent-trigger");
  const version = server.getStateID();
  fireEvent.change(await screen.findByRole("spinbutton", { name: "Amount" }), {
    target: { value: "40" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Confirm amount" }));
  fireEvent.click(
    await screen.findByRole("button", {
      name: "Choose allies, then target one of those allies again.",
    }),
  );
  fireEvent.click(await screen.findByRole("button", { name: "Choose amount 40" }));
  await screen.findByText(/too few legal candidates/);
  expect(submissions).toHaveLength(0);
  expect(server.getStateID()).toBe(version);
  fireEvent.click(screen.getByRole("button", { name: "Restart choices" }));
  await screen.findByText("Choose X.");
  expect(screen.queryByText(/too few legal candidates/)).toBeNull();
  expect(submissions).toHaveLength(0);
});

it("previews dependent trigger choices and submits the final native declaration", async () => {
  const { server, submissions } = renderNativeFixture("native-dependent-trigger");
  const originalVersion = server.getStateID();
  fireEvent.change(await screen.findByRole("spinbutton", { name: "Amount" }), {
    target: { value: "32" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Confirm amount" }));
  fireEvent.click(
    await screen.findByRole("button", {
      name: "Choose allies, then target one of those allies again.",
    }),
  );
  await screen.findByText("Choose Y.");
  expect(screen.getByRole("button", { name: "Choose amount 32" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Choose amount 34" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Choose amount 33" }));
  await screen.findByRole("status", { name: "Selection progress — 0 of 2 selected." });
  const allies = Object.values(server.runtime.state.objects).filter(
    (card) => card.controllerId === "p2" && card.definitionId === woodlandSquirrels.canonicalId,
  );
  const select = (id: string) =>
    fireEvent.click(
      document.querySelector<HTMLButtonElement>(`button[data-sim-entity-id="${id}"]`)!,
    );
  select(allies[1]!.id);
  select(allies[2]!.id);
  await screen.findByRole("img", { name: "Required — choose exactly 1 target." });
  expect(submissions).toHaveLength(0);
  expect(server.getStateID()).toBe(originalVersion);
  select(allies[2]!.id);
  await waitFor(() => expect(submissions).toHaveLength(1));
  expect(server.runtime.state.decision).toBeNull();
  expect(server.runtime.state.stack.at(-1)).toMatchObject({
    variables: { X: 32, Y: 33 },
    targets: [
      { binding: "first", targetIds: [allies[1]!.id, allies[2]!.id] },
      { binding: "second", targetIds: [allies[2]!.id] },
    ],
  });
  for (let step = 0; step < 4 && server.runtime.state.stack.length; step++) {
    const version = server.getStateID();
    fireEvent.click(await screen.findByRole("button", { name: "Pass Opportunity" }));
    await waitFor(() => expect(server.getStateID()).toBeGreaterThan(version));
  }
  expect(server.runtime.state.objects[allies[2]!.id]!.counters["named:preview"]).toBe(33);
});

it("offers an ally's ability alongside attack and completes native payment choices", async () => {
  const { server, submissions } = renderNativeFixture("native-ability-payment");
  const version = server.getStateID();
  const action = server
    .getInteractionView("p1")
    .actions.find((entry) => entry.id.startsWith("grand-archive:ability:"));
  if (!action?.source) throw new Error("Expected native ability source");
  const select = (id: string) =>
    fireEvent.click(
      document.querySelector<HTMLButtonElement>(`button[data-sim-entity-id="${id}"]`)!,
    );
  const hand = Object.values(server.runtime.state.objects).filter(
    (card) => card.zone === "hand" && card.ownerId === "p1",
  );
  const champion = Object.values(server.runtime.state.objects).find(
    (card) => card.zone === "field" && card.ownerId === "p2",
  )!;
  select(action.source.instanceId);
  expect(await screen.findByRole("button", { name: "Attack with Payment fixture" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /Activate Payment fixture/ }));
  fireEvent.change(await screen.findByRole("spinbutton", { name: "Amount" }), {
    target: { value: "32" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Confirm amount" }));
  await screen.findByRole("img", { name: "Required — choose exactly 1 target." });
  select(champion.id);
  fireEvent.click(
    await screen.findByRole("button", { name: "Select 1. Move from hand to graveyard" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Select 2. Pay 1 reserve" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm order" }));
  await screen.findByRole("img", { name: "Required — choose exactly 1 card." });
  select(hand[0]!.id);
  expect(await screen.findByRole("button", { name: "Choose Giant Tortoise" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Choose Woodland Squirrels" })).toBeNull();
  expect(submissions).toHaveLength(0);
  expect(server.getStateID()).toBe(version);
  fireEvent.click(screen.getByRole("button", { name: "Choose Giant Tortoise" }));
  await waitFor(() => expect(submissions).toHaveLength(1));
  expect(server.runtime.state.objects[hand[0]!.id]!.zone).toBe("graveyard");
  expect(server.runtime.state.objects[hand[2]!.id]!.zone).toBe("memory");
  for (let step = 0; step < 4 && server.runtime.state.stack.length; step++) {
    const before = server.getStateID();
    fireEvent.click(await screen.findByRole("button", { name: "Pass Opportunity" }));
    await waitFor(() => expect(server.getStateID()).toBeGreaterThan(before));
  }
  expect(server.runtime.state.objects[champion.id]!.counters["named:paid"]).toBe(32);
});

function renderNativeFixture(id: string) {
  const server = findGrandArchiveNativeFixture(id)!.createServer();
  const submissions: unknown[] = [];
  function NativeTable() {
    const [, update] = useState(0);
    const wait = server.runtime.waitState();
    const actor = "playerId" in wait ? wait.playerId : "p1";
    const interactionView = server.getInteractionView(actor);
    const resources = server.getViewerResources({ role: "player", actorId: actor });
    const fixture = grandArchiveHarnessFixture(
      id,
      "Glimpse",
      "Native Scry",
      projectGrandArchiveViewerSimulator(
        server.getViewerState({ role: "player", actorId: actor }),
        { ...resources, interactionView },
      ),
    );
    return (
      <GrandArchiveTabletop
        fixture={fixture}
        onPreviewProtocolInteraction={async (request) => server.previewInteraction(actor, request)}
        onSubmitProtocolInteraction={(submission) => {
          const result = server.submitInteraction(actor, submission, {
            gameId: "native-choice-ui",
            sourceAuthority: "client",
          });
          submissions.push(submission);
          if (result.success) update((version) => version + 1);
          return result.success;
        }}
      />
    );
  }
  render(
    <GrandArchiveSimulatorProviders>
      <NativeTable />
    </GrandArchiveSimulatorProviders>,
  );
  return { server, submissions };
}

it("submits a native Scry order directly from the serialized viewer UI", async () => {
  const { server, submissions } = renderNativeFixture("native-glimpse");
  const scryAction = server
    .getInteractionView("p1")
    .actions.find((action) => action.text.key.includes("Activate Scry"))!;
  const scryCard = document.querySelector<HTMLButtonElement>(
    `button[data-sim-entity-id="${scryAction.source!.instanceId}"]`,
  );
  if (!scryCard) throw new Error("Missing native Scry card control");
  fireEvent.click(scryCard);
  fireEvent.click(await screen.findByRole("button", { name: /Activate Scry/ }));
  for (let step = 0; step < 8 && !server.runtime.state.decision; step++) {
    const version = server.runtime.state.stateVersion;
    fireEvent.click(await screen.findByRole("button", { name: "Pass Opportunity" }));
    await waitFor(() => expect(server.runtime.state.stateVersion).toBeGreaterThan(version));
  }
  expect(server.runtime.state.decision?.kind).toBe("resolve-glimpse");
  const dialog = await screen.findByRole("dialog", { name: "Arrange your deck" });
  const pool = within(dialog).getByRole("region", { name: "Unplaced cards" });
  expect(pool.querySelectorAll("img")).toHaveLength(2);
  fireEvent.click(
    within(dialog).getByRole("button", { name: "Place Gray Wolf in Bottom of deck" }),
  );
  fireEvent.click(
    within(dialog).getByRole("button", { name: "Place Favorable Winds in Top of deck" }),
  );
  const calls = submissions.length;
  fireEvent.click(within(dialog).getByRole("button", { name: "Confirm order" }));
  await waitFor(() => expect(submissions).toHaveLength(calls + 1));
  expect(server.runtime.state.decision).toBeNull();
  expect(submissions.at(-1)).toMatchObject({ values: { "glimpse-action": ["reorder"] } });
  expect(screen.queryByRole("button", { name: "Return cards to deck" })).toBeNull();
});

it("Starcalls a free card through every native UI step without an irrelevant payment", async () => {
  const { server, submissions } = renderNativeFixture("native-starcall");
  const starcalledCard = Object.values(server.runtime.state.objects).find(
    (card) => card.definitionId === woodlandSquirrels.canonicalId && card.zone === "main-deck",
  )!;
  const scry = server
    .getInteractionView("p1")
    .actions.find((action) => action.text.key.includes("Activate Scry"))!;
  fireEvent.click(
    document.querySelector<HTMLButtonElement>(
      `button[data-sim-entity-id="${scry.source!.instanceId}"]`,
    )!,
  );
  fireEvent.click(await screen.findByRole("button", { name: /Activate Scry/ }));
  for (let step = 0; step < 8 && !server.runtime.state.decision; step++) {
    const version = server.runtime.state.stateVersion;
    fireEvent.click(await screen.findByRole("button", { name: "Pass Opportunity" }));
    await waitFor(() => expect(server.runtime.state.stateVersion).toBeGreaterThan(version));
  }
  expect(server.runtime.state.decision?.kind).toBe("resolve-glimpse");
  fireEvent.click(await screen.findByRole("button", { name: "Starcall" }));
  fireEvent.click(await screen.findByRole("button", { name: "Select Woodland Squirrels" }));
  const dialog = await screen.findByRole("dialog", { name: "Arrange your deck" });
  expect(screen.queryByRole("button", { name: "Skip payment" })).toBeNull();
  expect(within(dialog).queryByRole("button", { name: /in Top of deck/ })).toBeNull();
  expect(
    within(dialog)
      .getByRole("button", { name: "Place Woodland Squirrels in Bottom of deck" })
      .hasAttribute("disabled"),
  ).toBe(true);
  expect(
    within(dialog)
      .getByRole("button", { name: "Place Gray Wolf in Starcall" })
      .hasAttribute("disabled"),
  ).toBe(true);
  fireEvent.click(
    within(dialog).getByRole("button", { name: "Place Woodland Squirrels in Starcall" }),
  );
  fireEvent.click(
    within(dialog).getByRole("button", { name: "Place Favorable Winds in Bottom of deck" }),
  );
  fireEvent.click(
    within(dialog).getByRole("button", { name: "Place Gray Wolf in Bottom of deck" }),
  );
  const calls = submissions.length;
  fireEvent.click(within(dialog).getByRole("button", { name: "Confirm order" }));
  await waitFor(() => expect(submissions).toHaveLength(calls + 1));
  expect(server.runtime.state.decision).toBeNull();
  expect(submissions.at(-1)).toMatchObject({ values: { "glimpse-action": ["starcall"] } });
  expect(submissions.at(-1)).not.toHaveProperty("values.reservePayment");
  for (let step = 0; step < 12 && server.runtime.state.stack.length > 0; step++) {
    expect(server.runtime.state.decision).toBeNull();
    const version = server.runtime.state.stateVersion;
    fireEvent.click(await screen.findByRole("button", { name: "Pass Opportunity" }));
    await waitFor(() => expect(server.runtime.state.stateVersion).toBeGreaterThan(version));
  }
  expect(server.runtime.state.stack).toHaveLength(0);
  expect(server.runtime.state.decision).toBeNull();
  expect(server.runtime.state.objects[starcalledCard.id]?.zone).toBe("field");
});

it("reorders Starcall-eligible cards without exposing the Starcall destination", async () => {
  const { server, submissions } = renderNativeFixture("native-starcall");
  const scry = server
    .getInteractionView("p1")
    .actions.find((action) => action.text.key.includes("Activate Scry"))!;
  const card = document.querySelector<HTMLButtonElement>(
    `button[data-sim-entity-id="${scry.source!.instanceId}"]`,
  );
  if (!card) throw new Error("Missing native Scry card control");
  fireEvent.click(card);
  fireEvent.click(await screen.findByRole("button", { name: /Activate Scry/ }));
  for (let step = 0; step < 8 && !server.runtime.state.decision; step++) {
    const version = server.runtime.state.stateVersion;
    fireEvent.click(await screen.findByRole("button", { name: "Pass Opportunity" }));
    await waitFor(() => expect(server.runtime.state.stateVersion).toBeGreaterThan(version));
  }
  expect(server.runtime.state.decision?.kind).toBe("resolve-glimpse");
  fireEvent.click(await screen.findByRole("button", { name: "Return cards to deck" }));
  const dialog = await screen.findByRole("dialog", { name: "Arrange your deck" });
  expect(within(dialog).queryByRole("heading", { name: "Starcall" })).toBeNull();
  expect(within(dialog).queryByRole("button", { name: /in Starcall/ })).toBeNull();
  for (const [name, destination] of [
    ["Woodland Squirrels", "Top of deck"],
    ["Gray Wolf", "Bottom of deck"],
    ["Favorable Winds", "Bottom of deck"],
  ]) {
    fireEvent.click(
      within(dialog).getByRole("button", { name: `Place ${name} in ${destination}` }),
    );
  }
  const calls = submissions.length;
  fireEvent.click(within(dialog).getByRole("button", { name: "Confirm order" }));
  await waitFor(() => expect(submissions).toHaveLength(calls + 1));
  expect(server.runtime.state.decision).toBeNull();
  expect(submissions.at(-1)).toMatchObject({ values: { "glimpse-action": ["reorder"] } });
});
