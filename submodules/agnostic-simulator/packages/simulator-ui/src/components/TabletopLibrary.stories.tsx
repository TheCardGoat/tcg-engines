import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { CardRow } from "./CardRow";
import { TabletopCounterBadge } from "./TabletopCounterBadge";
import { TabletopDie, TabletopDieButton } from "./TabletopDie";
import { StoryCase, StoryFrame, StoryGrid } from "../storybook/StoryFrame";
import { entities } from "../storybook/fixtures";

const meta = {
  title: "Simulator UI/Tabletop Library",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function SelectionExample() {
  const [selected, setSelected] = useState<string>();
  return (
    <>
      <div role="group" aria-label="Choose a die" className="flex flex-wrap gap-3">
        {[4, 6, 8, 10, 12, 20].map((sides) => (
          <TabletopDieButton
            key={sides}
            actionLabel={`Select d${sides} showing ${sides - 1}`}
            selected={selected === `d${sides}`}
            onClick={() => setSelected(`d${sides}`)}
          >
            <TabletopDie label={`d${sides}`} value={sides - 1} />
          </TabletopDieButton>
        ))}
        <TabletopDieButton actionLabel="d6 unavailable" disabled>
          <TabletopDie label="d6" value={2} />
        </TabletopDieButton>
      </div>
      <p role="status" className="text-[var(--board-text)]">
        {selected ? `Selected ${selected}` : "Choose a die with click, Enter, or Space."}
      </p>
    </>
  );
}

export const Dice: Story = {
  render: () => (
    <StoryFrame title="Dice · presentation and input">
      <StoryGrid>
        <StoryCase title="Numeric, symbolic, and unresolved">
          <div className="flex flex-wrap gap-3">
            <TabletopDie label="d20" value={17} />
            <TabletopDie label="Hit" value="★" />
            <TabletopDie label="d6" />
            <TabletopDie label="d10" value={0} />
          </div>
        </StoryCase>
        <StoryCase title="Game-owned face">
          <TabletopDie label="Shield die" value="block" appearance="bare">
            <span className="grid h-14 w-14 place-items-center rounded-full border-2 text-2xl">
              ◆
            </span>
          </TabletopDie>
        </StoryCase>
        <StoryCase title="Controlled selection">
          <SelectionExample />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

function TabletopExample({ game }: { game: "cyberpunk" | "gundam" }) {
  const [selectedCard, setSelectedCard] = useState<string>();
  return (
    <StoryFrame title={`Shared blocks · ${game} theme`} game={game}>
      <div className="flex flex-wrap gap-3" role="group" aria-label="Player counters">
        <TabletopCounterBadge label="Score" value={12} />
        <TabletopCounterBadge label="Resources" value="3 / 5" mono />
        <TabletopCounterBadge label="Deck" value={28} />
      </div>
      <CardRow
        entities={entities.slice(0, 3)}
        selectedId={selectedCard}
        ariaLabel="Select a card"
        onSelect={(entity) => setSelectedCard(entity.id)}
      />
      <SelectionExample />
    </StoryFrame>
  );
}

export const SharedComposition: Story = {
  render: () => (
    <div className="grid gap-4 lg:grid-cols-2">
      <TabletopExample game="cyberpunk" />
      <TabletopExample game="gundam" />
    </div>
  ),
};
