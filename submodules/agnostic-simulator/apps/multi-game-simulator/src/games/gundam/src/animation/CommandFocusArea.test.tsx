// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vite-plus/test";

import type { SimulatorEntity } from "@tcg/simulator-contract";

import { CardHoverPreview } from "../components/ui/card/CardHoverPreview.tsx";
import { CardInspectProvider } from "../components/ui/card/card-inspect-context.tsx";
import type { GameCardData } from "../components/ui/types.ts";
import {
  burstDecisionFocusLabel,
  CommandFocusArea,
  effectDecisionFocusLabel,
} from "./CommandFocusArea.tsx";

const command: SimulatorEntity = {
  id: "command-1",
  title: "Command Test",
  subtitle: "command",
  kind: "card",
  ownerId: "player_one",
  face: "public",
  states: [],
  stats: [],
  traits: [],
  imageUrl: "https://example.test/command.webp",
};

const previewCard: GameCardData = {
  id: "command-1",
  name: "Command Test",
  cardType: "command",
  color: "blue",
  cost: 1,
  level: 3,
  effect: "[Main] Choose 1 Unit. It recovers 2 HP.",
  img: "https://example.test/command.webp",
};

describe("CommandFocusArea", () => {
  afterEach(cleanup);

  it("keeps a stable animation anchor while idle", () => {
    const markup = renderToStaticMarkup(<CommandFocusArea entity={null} active={false} />);

    expect(markup).toContain('data-sim-anchor-id="gundam-command-focus"');
    expect(markup).toContain('data-active="false"');
    expect(markup).not.toContain("Command Test");
  });

  it("renders the resolving command through the shared card face", () => {
    const markup = renderToStaticMarkup(<CommandFocusArea entity={command} active />);

    expect(markup).toContain('data-active="true"');
    expect(markup).toContain("Command resolving");
    expect(markup).toContain("absolute right-4 top-1/2");
    expect(markup).not.toContain("left-1/2");
    expect(markup).toContain('data-sim-entity-id="command-1"');
    expect(markup).toContain('aria-label="Command Test, card, player_one"');
  });

  it.each(["Burst — your decision", "Burst — opponent deciding"])(
    "keeps a revealed Burst staged with the %s label",
    (label) => {
      const markup = renderToStaticMarkup(
        <CommandFocusArea entity={command} active label={label} />,
      );

      expect(markup).toContain(label);
      expect(markup).toContain('data-sim-entity-id="command-1"');
      expect(markup).toContain(`aria-label="${label}: Command Test"`);
    },
  );

  it("uses controller-only wording without hiding the staged card from other viewers", () => {
    expect(burstDecisionFocusLabel("player_one", "player_one")).toBe("Burst — your decision");
    expect(burstDecisionFocusLabel("player_one", "player_two")).toBe("Burst — opponent deciding");
    expect(burstDecisionFocusLabel("player_one", null)).toBe("Burst — opponent deciding");
  });

  it("labels a resolving effect for both the deciding player and other viewers", () => {
    expect(effectDecisionFocusLabel("player_one", "player_one")).toBe("Effect — your decision");
    expect(effectDecisionFocusLabel("player_one", "player_two")).toBe("Effect — opponent deciding");
    expect(effectDecisionFocusLabel("player_one", null)).toBe("Effect — opponent deciding");
  });

  it("shows the existing readable card preview while hovering the resolving card", () => {
    const { getByTestId, queryByTestId } = render(
      <CardInspectProvider>
        <CommandFocusArea entity={command} previewCard={previewCard} active />
        <CardHoverPreview />
      </CardInspectProvider>,
    );
    const handle = getByTestId("gundam-command-focus-preview-handle");

    expect(handle.getAttribute("data-preview-enabled")).toBe("true");
    expect(queryByTestId("card-hover-preview")).toBeNull();

    fireEvent.pointerEnter(handle, { pointerType: "mouse" });
    expect(getByTestId("card-hover-preview").getAttribute("data-card-id")).toBe("command-1");
    expect(getByTestId("card-preview-fallback").textContent).toContain(
      "[Main] Choose 1 Unit. It recovers 2 HP.",
    );

    fireEvent.pointerLeave(handle);
    expect(queryByTestId("card-hover-preview")).toBeNull();
  });
});
