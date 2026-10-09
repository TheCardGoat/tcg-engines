import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import ComponentCatalogPage from "./ComponentCatalogPage";
import { GAMES } from "../simulator/games";
vi.mock("../games/cyberpunk/components/BoardV2/ComponentCatalog", () => ({
  default: ({ category }: { category: string }) => (
    <div data-testid="cyberpunk-catalog">Cyberpunk {category}</div>
  ),
}));
vi.mock("./component-catalog/GameCatalog", () => ({
  default: ({ game, category }: { game: string; category: string }) => (
    <div data-testid="game-catalog">
      {game} {category}
    </div>
  ),
}));
afterEach(cleanup);
describe("component catalog routing", () => {
  test("loads a linked game and passes category changes", async () => {
    window.history.replaceState({}, "", "/component-catalog?game=cyberpunk");
    render(<ComponentCatalogPage />);
    expect((await screen.findByTestId("cyberpunk-catalog")).textContent).toBe(
      "Cyberpunk All components",
    );
    fireEvent.change(screen.getByLabelText("Component family"), { target: { value: "Dice" } });
    expect(screen.getByTestId("cyberpunk-catalog").textContent).toBe("Cyberpunk Dice");
  });
  test("excludes Lorcana and loads production catalogs in compare mode", async () => {
    window.history.replaceState({}, "", "/component-catalog?game=gundam");
    render(<ComponentCatalogPage />);
    expect((await screen.findByTestId("game-catalog")).textContent).toBe("gundam All components");
    expect(screen.queryByRole("option", { name: "Lorcana" })).toBeNull();
    expect(screen.queryByRole("option", { name: "Mobile board" })).toBeNull();
    expect(screen.queryByRole("option", { name: "Tabletop controls" })).toBeNull();
    expect(screen.getByRole("option", { name: "Production board" })).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Game"), { target: { value: "all" } });
    for (const game of GAMES.filter((g) => g.slug !== "lorcana"))
      expect(screen.getByRole("region", { name: `${game.name} components` })).toBeTruthy();
    expect(screen.queryByRole("region", { name: "Lorcana components" })).toBeNull();
    expect(new URLSearchParams(window.location.search).get("game")).toBe("all");
  });
  test("an excluded game link falls back to Cyberpunk", async () => {
    window.history.replaceState({}, "", "/component-catalog?game=lorcana");
    render(<ComponentCatalogPage />);
    expect(await screen.findByTestId("cyberpunk-catalog")).toBeTruthy();
  });
});
