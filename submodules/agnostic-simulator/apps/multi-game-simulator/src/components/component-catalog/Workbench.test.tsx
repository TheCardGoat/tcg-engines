import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { CardFace } from "@tcg/simulator-ui";
import Workbench, { variantEntity } from "./Workbench";
import type { SimulatorEntity } from "@tcg/simulator-contract";
afterEach(cleanup);
const card: SimulatorEntity = {
  id: "public",
  title: "Public unit",
  subtitle: "Unit",
  kind: "unit",
  ownerId: "p1",
  face: "public",
  states: ["ready"],
  stats: [],
  traits: [],
  imageUrl: "/card.webp",
  backImageUrl: "/back.webp",
};
describe("live card controls", () => {
  test("changes live face, rotation, targeting and selection; reset restores the card", () => {
    render(
      <Workbench
        game="sample"
        category="Cards"
        source="test renderer"
        boardHref="/sample"
        renderCard={(entity, knobs) => (
          <CardFace
            entity={variantEntity(entity, knobs)}
            density="full"
            selected={knobs.selected}
            targetable={knobs.targetable}
            highlighted={knobs.highlighted}
          />
        )}
        entities={[card]}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Rested / spent" }));

    fireEvent.click(screen.getByRole("checkbox", { name: /^Selected$/ }));
    expect(document.querySelector('[data-sim-entity-id="public"]')?.className).toContain(
      "is-selected",
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Face down" }));
    expect(screen.queryByRole("button", { name: /Public unit/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Reset card states" }));
    expect(screen.getByRole("button", { name: /Public unit/ })).toBeTruthy();
  });
  test("limits controls to states the renderer supports", () => {
    render(
      <Workbench
        game="sample"
        category="Cards"
        source="test"
        boardHref="/sample"
        renderCard={(entity, knobs) => (
          <CardFace
            entity={variantEntity(entity, knobs)}
            density="full"
            selected={knobs.selected}
            targetable={knobs.targetable}
            highlighted={knobs.highlighted}
          />
        )}
        entities={[card]}
        supported={["hidden"]}
      />,
    );
    expect(screen.getByRole("checkbox", { name: "Face down" })).toBeTruthy();
    expect(screen.queryByRole("checkbox", { name: "Rested / spent" })).toBeNull();
  });
});
