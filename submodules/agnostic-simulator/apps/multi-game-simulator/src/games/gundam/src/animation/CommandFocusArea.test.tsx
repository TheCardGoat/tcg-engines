import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

import type { SimulatorEntity } from "@tcg/simulator-contract";

import { CommandFocusArea } from "./CommandFocusArea.tsx";

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

describe("CommandFocusArea", () => {
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
    expect(markup).toContain('data-sim-entity-id="command-1"');
    expect(markup).toContain('aria-label="Command Test, card, player_one"');
  });
});
