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
