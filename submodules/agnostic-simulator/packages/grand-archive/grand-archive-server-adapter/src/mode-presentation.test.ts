import { describe, expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import { grandArchiveCards } from "@tcg/grand-archive-cards";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveServerEngine } from "./server-engine.ts";
import { commandForGrandArchiveSubmission } from "./interaction.ts";

function card(slug: string) {
  const result = grandArchiveCards.find((candidate) => candidate.slug === slug);
  if (!result) throw new Error(`Missing native card ${slug}`);
  return result;
}

describe("Grand Archive mode labels", () => {
  it.each([
    {
      slug: "hidden-secrets",
      reserve: 2,
      field: "gray-wolf",
      text: "Draw a card into your memory",
      modeIds: ["mode-2"],
    },
    {
      slug: "viridescent-aetherstreak",
      reserve: 3,
      field: "salamanders-breath",
      text: "Load Viridescent Aetherstreak into an Aetherwing weapon you control.",
      modeIds: ["become-distant", "load"],
    },
  ])("uses native printed mode text for $slug without changing submitted IDs", (scenario) => {
    const source = card(scenario.slug);
    const fixture = GrandArchiveTestEngine.startFixture({
      playerOne: {
        id: "p1",
        champion: card("spirit-of-wind"),
        zones: {
          hand: [
            source,
            ...Array.from({ length: scenario.reserve }, () => card("woodland-squirrels")),
          ],
          field: [card(scenario.field)],
          "main-deck": [card("giant-tortoise")],
        },
      },
      playerTwo: { id: "p2", champion: card("spirit-of-wind") },
    });
    const server = new GrandArchiveServerEngine(
      fixture.program,
      new GrandArchiveMatchRuntime(fixture.program, fixture.state),
    );
    const view = server.getInteractionView("p1");
    const action = view.actions.find((entry) => entry.source?.definitionId === source.canonicalId);
    if (!action) throw new Error(`Missing native action for ${scenario.slug}`);
    const declaration = action.inputs.find((input) => input.id === "legal-declaration");
    if (declaration?.kind !== "option-selection")
      throw new Error("Expected correlated declaration");
    const opposingTarget = scenario.slug === "viridescent-aetherstreak";
    if (opposingTarget) {
      expect(
        declaration.options.some((option) =>
          option.text.key.includes("Target your Spirit of Wind"),
        ),
      ).toBe(true);
      expect(
        declaration.options.some((option) =>
          option.text.key.includes("Target opponent's Spirit of Wind"),
        ),
      ).toBe(true);
    }
    const chosen = declaration.options.find(
      (option) =>
        option.text.key.includes(scenario.text) &&
        (!opposingTarget || option.text.key.includes("Target opponent's Spirit of Wind")),
    );
    expect(chosen?.text.key).not.toMatch(/mode-[12]|become-distant|prevent-damage/);
    if (!chosen) throw new Error(`Missing printed mode: ${scenario.text}`);
    const submission = buildInteractionSubmission({
      view,
      action,
      values: { "legal-declaration": [chosen.id] },
    });
    const command = commandForGrandArchiveSubmission(server.runtime, "p1", submission)?.command;
    expect(command).toMatchObject({ move: "activate-card", modeIds: scenario.modeIds });
    if (opposingTarget) {
      const opponentChampion = Object.values(server.runtime.state.objects).find(
        (object) =>
          object.controllerId === "p2" &&
          object.definitionId === card("spirit-of-wind").canonicalId,
      )!;
      expect(command).toMatchObject({ targets: { "distant-unit": [opponentChampion.id] } });
    }
    expect(
      server.submitInteraction("p1", submission, {
        gameId: "mode-label-test",
        sourceAuthority: "server",
      }).success,
    ).toBe(true);
  });
});
