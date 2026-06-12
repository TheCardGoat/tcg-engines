import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { CardDetailSheet } from "./CardDetailSheet";
import { CardFace } from "./CardFace";
import { ChoiceChips } from "./ChoiceChips";
import { ChoiceModal } from "./ChoiceModal";
import { ChoiceResolutionOverlay } from "./ChoiceResolutionOverlay";
import { EventLogPanel } from "./EventLogPanel";
import { FixtureNavigation } from "./FixtureNavigation";
import { InteractionPanel } from "./InteractionPanel";
import { MobileShell } from "./MobileShell";
import { PromptBanner } from "./PromptBanner";
import { RunbookPanel } from "./RunbookPanel";
import { TargetingArrow } from "./TargetingArrow";
import { TargetingOverlay } from "./TargetingOverlay";
import { TargetingPreviewBadge } from "./TargetingPreviewBadge";
import { TargetingSpotlight } from "./TargetingSpotlight";
import { StoryCase, StoryFrame, StoryGrid } from "../storybook/StoryFrame";
import { entities, eventLog, fixture, targetingIntents } from "../storybook/fixtures";

const meta = {
  title: "Simulator UI/Components/Panels And Overlays",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractionPanelStates: Story = {
  render: () => (
    <StoryFrame title="InteractionPanel states" width="1120px">
      <StoryGrid>
        <StoryCase title="all interaction input kinds">
          <InteractionPanel fixture={fixture} />
        </StoryCase>
        <StoryCase title="empty prompts">
          <InteractionPanel fixture={{ ...fixture, interactions: [] }} />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const EventLogPanelStates: Story = {
  render: () => (
    <StoryFrame title="EventLogPanel states">
      <StoryGrid>
        <StoryCase title="entries and highlighted entities">
          <div className="h-[420px]">
            <EventLogPanel entries={eventLog} highlightedEntityIds={["runner"]} />
          </div>
        </StoryCase>
        <StoryCase title="empty">
          <div className="h-[260px]">
            <EventLogPanel entries={[]} />
          </div>
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const PromptBannerStates: Story = {
  render: () => (
    <StoryFrame title="PromptBanner states">
      <StoryGrid>
        <StoryCase title="with timer and actions">
          <PromptBanner
            promptText="Choose a target for Signal Runner."
            timerMs={45000}
            onCancel={() => undefined}
            onConfirm={() => undefined}
          />
        </StoryCase>
        <StoryCase title="urgent">
          <PromptBanner
            promptText="Resolve the pending ability now."
            timerMs={9000}
            onConfirm={() => undefined}
          />
        </StoryCase>
        <StoryCase title="text only">
          <PromptBanner promptText="Waiting for opponent." />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const ChoiceChipsStates: Story = {
  render: () => {
    const [single, setSingle] = useState(["draw"]);
    const [multi, setMulti] = useState(["draw", "buff"]);
    const options = [
      { id: "draw", label: "Draw" },
      { id: "buff", label: "Buff" },
      { id: "damage", label: "Damage" },
    ];
    return (
      <StoryFrame title="ChoiceChips states">
        <StoryGrid>
          <StoryCase title="single select">
            <ChoiceChips options={options} selectedIds={single} onSelect={setSingle} />
          </StoryCase>
          <StoryCase title="multi select">
            <ChoiceChips options={options} selectedIds={multi} multi onSelect={setMulti} />
          </StoryCase>
          <StoryCase title="none selected">
            <ChoiceChips options={options} selectedIds={[]} multi />
          </StoryCase>
        </StoryGrid>
      </StoryFrame>
    );
  },
};

export const ChoiceModalStates: Story = {
  render: () => (
    <StoryFrame title="ChoiceModal states">
      <div className="storybook-panel min-h-[420px] p-6">
        <p className="text-sm text-[var(--board-muted)]">Open, timer, and closed modal states.</p>
        <ChoiceModal
          open
          title="Choose a mode"
          timerMs={20000}
          options={[
            { id: "draw", label: "Draw a card" },
            { id: "ready", label: "Ready a unit" },
          ]}
        />
        <ChoiceModal
          open={false}
          title="Closed choice"
          options={[{ id: "closed", label: "Closed option" }]}
        />
      </div>
    </StoryFrame>
  ),
};

export const ChoiceResolutionOverlayStates: Story = {
  render: () => (
    <StoryFrame title="ChoiceResolutionOverlay states">
      <StoryGrid>
        <StoryCase title="ordered open">
          <div className="relative min-h-[420px]">
            <ChoiceResolutionOverlay
              open
              title="Resolve order"
              entities={entities.slice(0, 4)}
              selectedIds={["runner", "guard"]}
              ordered
            />
          </div>
        </StoryCase>
        <StoryCase title="unordered open">
          <div className="relative min-h-[420px]">
            <ChoiceResolutionOverlay
              open
              title="Resolve targets"
              entities={entities.slice(0, 4)}
              selectedIds={["runner"]}
            />
          </div>
        </StoryCase>
        <StoryCase title="closed">
          <div className="relative min-h-[160px]">
            <ChoiceResolutionOverlay
              open={false}
              title="Closed choice"
              entities={entities.slice(0, 2)}
              selectedIds={[]}
            />
          </div>
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const CardDetailSheetStates: Story = {
  render: () => (
    <StoryFrame title="CardDetailSheet states">
      <StoryGrid>
        <StoryCase title="open">
          <div className="min-h-[520px]">
            <CardDetailSheet entity={entities[0]!} open>
              <CardFace entity={entities[0]!} />
            </CardDetailSheet>
          </div>
        </StoryCase>
        <StoryCase title="closed trigger">
          <CardDetailSheet entity={entities[1]!} open={false}>
            <CardFace entity={entities[1]!} />
          </CardDetailSheet>
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const FixtureNavigationAndRunbook: Story = {
  render: () => (
    <StoryFrame title="FixtureNavigation and RunbookPanel">
      <StoryGrid>
        <StoryCase title="fixture navigation">
          <FixtureNavigation
            fixtures={[fixture, { ...fixture, id: "second", name: "Second Fixture" }]}
            activeFixture={fixture}
            onSelectFixture={() => undefined}
          />
        </StoryCase>
        <StoryCase title="runbook">
          <RunbookPanel fixture={fixture} />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const MobileShellStates: Story = {
  render: () => (
    <StoryFrame title="MobileShell states" width="900px">
      <StoryGrid>
        <StoryCase title="with log tab">
          <MobileShell
            hasLog
            sidebar={<RunbookPanel fixture={fixture} />}
            board={
              <div className="storybook-panel min-h-[360px] p-4 text-[var(--board-text)]">
                Board content
              </div>
            }
            interactions={<InteractionPanel fixture={fixture} />}
            log={<EventLogPanel entries={eventLog} />}
          />
        </StoryCase>
        <StoryCase title="without log tab">
          <MobileShell
            sidebar={<RunbookPanel fixture={fixture} />}
            board={
              <div className="storybook-panel min-h-[260px] p-4 text-[var(--board-text)]">
                Board content
              </div>
            }
            interactions={<InteractionPanel fixture={{ ...fixture, interactions: [] }} />}
          />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const TargetingPrimitives: Story = {
  render: () => (
    <StoryFrame title="Targeting primitives">
      <StoryGrid>
        <StoryCase title="arrow curved and straight">
          <svg width="360" height="180" viewBox="0 0 360 180">
            <TargetingArrow x1={36} y1={130} x2={300} y2={46} />
            <TargetingArrow
              x1={36}
              y1={40}
              x2={300}
              y2={130}
              curved={false}
              animated={false}
              color="#ff3d8a"
            />
          </svg>
        </StoryCase>
        <StoryCase title="preview badges">
          <div className="relative h-[180px]">
            <TargetingPreviewBadge x={80} y={80} damage={3} />
            <TargetingPreviewBadge x={190} y={130} banish />
            <TargetingPreviewBadge x={290} y={90} label="Select" />
          </div>
        </StoryCase>
        <StoryCase title="spotlight">
          <div className="relative h-[220px] overflow-hidden rounded-lg bg-black/50">
            <TargetingSpotlight
              sourceX={90}
              sourceY={120}
              targetX={270}
              targetY={80}
              width={360}
              height={220}
            />
          </div>
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const TargetingOverlayStates: Story = {
  render: () => (
    <StoryFrame title="TargetingOverlay states">
      <div className="board-mat storybook-panel relative min-h-[420px] p-8">
        <div className="grid grid-cols-2 gap-16">
          <CardFace entity={entities[0]!} />
          <CardFace entity={entities[1]!} />
          <div
            data-zone-id="discard"
            className="rounded-lg border border-[var(--board-border)] p-8 text-[var(--board-text)]"
          >
            Discard zone
          </div>
        </div>
        <TargetingOverlay targetingIntents={targetingIntents} />
      </div>
    </StoryFrame>
  ),
};
