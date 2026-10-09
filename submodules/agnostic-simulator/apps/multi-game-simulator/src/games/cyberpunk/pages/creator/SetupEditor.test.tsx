import { useState } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { afterEach, expect, it } from "vite-plus/test";
import { P1 } from "@tcg/cyberpunk-engine";
import { SetupEditor } from "./SetupEditor";
import { buildCreatorEngine, creatorCards, emptySetup, type CreatorSetup } from "./setup";

afterEach(cleanup);
it("places a Legend, attaches gear by clicking, then detaches it through the inspector", () => {
  let draft: CreatorSetup = emptySetup();
  const legend = creatorCards.find((card) => card.type === "legend")!;
  const gear = creatorCards.find((card) => card.type === "gear")!;
  function Editor() {
    const [setup, setSetup] = useState(draft);
    return (
      <MantineProvider>
        <SetupEditor
          setup={setup}
          onChange={(next) => {
            draft = next;
            setSetup(next);
          }}
          onStart={() => {}}
          error={null}
        />
      </MantineProvider>
    );
  }
  render(<Editor />);
  fireEvent.change(screen.getByLabelText("Find cards"), { target: { value: legend.displayName } });
  fireEvent.click(screen.getByRole("button", { name: `Select ${legend.displayName}` }));
  fireEvent.click(screen.getByRole("button", { name: "Add card to Player 1 Legends" }));
  fireEvent.change(screen.getByLabelText("Find cards"), { target: { value: gear.displayName } });
  fireEvent.click(screen.getByRole("button", { name: `Select ${gear.displayName}` }));
  fireEvent.click(
    within(screen.getByRole("region", { name: "Player 1 board" })).getByRole("button", {
      name: `Edit ${legend.displayName}`,
    }),
  );
  expect(screen.getByAltText(`Attached ${gear.displayName}`)).toBeTruthy();
  const engine = buildCreatorEngine(draft);
  expect(
    engine.getCardsInZone("legendArea", P1).find((card) => card.definitionId === legend.id)?.meta
      .attachedGearIds,
  ).toHaveLength(1);
  fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));
  fireEvent.click(screen.getByRole("button", { name: `Edit ${legend.displayName}` }));
  fireEvent.click(screen.getByRole("button", { name: "Detach 1" }));
  expect(screen.queryByAltText(`Attached ${gear.displayName}`)).toBeNull();
  expect(draft.player.legendArea[0].gearIds).toEqual([]);
});
