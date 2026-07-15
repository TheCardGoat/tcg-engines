import type { Meta, StoryObj } from "@storybook/react-vite";

import { Board } from "./Board";
import { BoardBlock } from "./BoardBlock";
import { BoardLayout } from "./BoardLayout";
import { CoreComponentMap } from "./CoreComponentMap";
import { SeatSummary } from "./SeatSummary";
import { StatusBar } from "./StatusBar";
import { TurnIndicator } from "./TurnIndicator";
import { ZoneFrame } from "./ZoneFrame";
import { StoryCase, StoryFrame, StoryGrid } from "../storybook/StoryFrame";
import { boardBlocks, entities, entityMap, fixture, table, zones } from "../storybook/fixtures";

const meta = {
  title: "Simulator UI/Components/Board Layout",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BoardLayoutFull: Story = {
  render: () => (
    <StoryFrame title="BoardLayout">
      <BoardLayout fixture={fixture} />
    </StoryFrame>
  ),
};

export const BoardVariants: Story = {
  render: () => (
    <StoryFrame title="Board variants">
      <div className="grid gap-4">
        {(["lanes", "opposed", "theater", "dashboard"] as const).map((variant) => (
          <StoryCase key={variant} title={variant}>
            <Board
              table={table}
              entities={entities}
              layout={{
                ...fixture.boardLayout,
                appearance: { ...fixture.boardLayout.appearance, variant },
              }}
              label={`${variant} board`}
            />
          </StoryCase>
        ))}
      </div>
    </StoryFrame>
  ),
};

export const BoardBlockKinds: Story = {
  render: () => (
    <StoryFrame title="BoardBlock kinds">
      <StoryGrid>
        {boardBlocks.map((block) => (
          <StoryCase key={block.id} title={block.kind}>
            <BoardBlock table={table} block={block} entityMap={entityMap} />
          </StoryCase>
        ))}
      </StoryGrid>
    </StoryFrame>
  ),
};

export const ZoneFrameStates: Story = {
  render: () => (
    <StoryFrame title="ZoneFrame states">
      <div className="grid gap-4">
        <StoryCase title="public with cards">
          <ZoneFrame
            block={boardBlocks[1]!}
            zone={zones[0]}
            entities={entities.slice(0, 2)}
            entityCount={2}
            note="Ready units can act."
          />
        </StoryCase>
        <StoryCase title="secret stack">
          <ZoneFrame
            block={boardBlocks[2]!}
            zone={zones[3]}
            entities={[]}
            entityCount={32}
            note="Hidden from both players."
          />
        </StoryCase>
        <StoryCase title="missing zone fallback">
          <ZoneFrame
            block={{ ...boardBlocks[1]!, label: "Adapter missing zone" }}
            zone={undefined}
            entities={[]}
            entityCount={0}
          />
        </StoryCase>
      </div>
    </StoryFrame>
  ),
};

export const SeatSummaryStates: Story = {
  render: () => (
    <StoryFrame title="SeatSummary states">
      <StoryGrid>
        <StoryCase title="full online">
          <SeatSummary table={table} seat={table.seats[0]!} />
        </StoryCase>
        <StoryCase title="compact thinking expired">
          <SeatSummary table={table} seat={table.seats[1]!} compact />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const StatusAndTurnStates: Story = {
  render: () => (
    <StoryFrame title="StatusBar and TurnIndicator">
      <StoryGrid>
        <StoryCase title="status bar">
          <StatusBar fixture={fixture} />
        </StoryCase>
        <StoryCase title="turn indicator">
          <TurnIndicator turn={table.status.turn} phase={table.status.phase} />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const CoreComponentMapStates: Story = {
  render: () => (
    <StoryFrame title="CoreComponentMap">
      <CoreComponentMap fixture={fixture} />
    </StoryFrame>
  ),
};
