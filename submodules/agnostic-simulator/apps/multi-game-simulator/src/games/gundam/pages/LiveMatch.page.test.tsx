// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vite-plus/test";

import { loadMainPhaseDemo } from "../src/game/fixtures/main-phase-demo.ts";
import "../src/test/renderSimulator.tsx";
import { LiveSimulatorShell } from "./LiveMatch.page.tsx";

describe("LiveSimulatorShell", () => {
  it("mounts the shared Gundam animation surface for live matches", () => {
    const dev = loadMainPhaseDemo();
    const { container } = render(
      <MemoryRouter>
        <LiveSimulatorShell
          runtime={dev.runtime}
          staticResources={dev.staticResources}
          viewerId={dev.p1Id}
          remoteSubmit={() => {}}
          getInteractionView={() => undefined}
          getAnimationPackets={() => []}
          ended={null}
        />
      </MemoryRouter>,
    );

    expect(container.querySelector(".motion-animation-stage")).toBeTruthy();
  });
});
