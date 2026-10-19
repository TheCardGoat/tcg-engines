// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { ComponentProps } from "react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import CyberpunkComponentCatalog from "./ComponentCatalog";
import type Scene from "./Scene";

// Exercise the production catalog and its providers without requiring WebGL.
// The scene reads this set for every card when deciding whether to render it.
vi.mock("./Scene", () => ({
  default: ({ cards, movingIds }: ComponentProps<typeof Scene>) => (
    <output data-testid="catalog-scene">
      {cards.filter((card) => !movingIds.has(card.card.cardId)).length}
    </output>
  ),
}));
vi.mock("../../auth/AuthSessionBootstrap", () => ({ AuthSessionBootstrap: () => null }));

afterEach(cleanup);

test("the physical card catalog renders its stationary field cards", async () => {
  render(
    <MemoryRouter>
      <MantineProvider env="test">
        <CyberpunkComponentCatalog category="Cards" />
      </MantineProvider>
    </MemoryRouter>,
  );
  const scene = await screen.findByTestId("catalog-scene");
  expect(Number(scene.textContent)).toBeGreaterThan(0);
});
