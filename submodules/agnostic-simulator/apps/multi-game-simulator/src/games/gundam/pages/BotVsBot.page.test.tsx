// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vite-plus/test";

import { loadMainPhaseDemo } from "../src/game/fixtures/main-phase-demo.ts";
import { loadSetupDefault } from "../src/game/fixtures/setup-default.ts";
import "../src/test/renderSimulator.tsx";
import { BotVsBotShell } from "./BotVsBot.page.tsx";

describe("BotVsBotShell", () => {
  it("mounts the shared Gundam animation surface for spectator matches", () => {
    const dev = loadMainPhaseDemo();
    const { container } = render(
      <MemoryRouter>
        <BotVsBotShell
          runtime={dev.runtime}
          staticResources={dev.staticResources}
          viewerId={dev.p1Id}
        />
      </MemoryRouter>,
    );

    expect(container.querySelector(".motion-animation-stage")).toBeTruthy();
  });

  it("does not mount player-only setup prompts for spectators", () => {
    const dev = loadSetupDefault();
    const { container } = render(
      <MemoryRouter>
        <BotVsBotShell
          runtime={dev.runtime}
          staticResources={dev.staticResources}
          viewerId={dev.p1Id}
        />
      </MemoryRouter>,
    );

    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(container.textContent).not.toContain("Who goes first");
    expect(container.textContent).not.toContain("I go first");
  });
});
