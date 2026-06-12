import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Card } from "./Card";
import { CardFace } from "./CardFace";
import { CardFan } from "./CardFan";
import { CardGrid } from "./CardGrid";
import { CardImage } from "./CardImage";
import { CardInspector } from "./CardInspector";
import { CardRow } from "./CardRow";
import { CardZone } from "./CardZone";
import { EmptyZone } from "./EmptyZone";
import { HandZone } from "./HandZone";
import { PriorityRing } from "./PriorityRing";
import { TokenRow } from "./TokenRow";
import { StoryCase, StoryFrame, StoryGrid } from "../storybook/StoryFrame";
import { entities, zones } from "../storybook/fixtures";

const meta = {
  title: "Simulator UI/Components/Card Primitives",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const cardImageSrc =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700"><rect width="500" height="700" fill="#10131b"/><rect x="26" y="26" width="448" height="648" rx="24" fill="#f5e642"/><rect x="52" y="82" width="396" height="300" rx="18" fill="#4ad9ff"/><text x="250" y="458" text-anchor="middle" font-family="Arial" font-size="44" font-weight="800" fill="#10131b">SIGNAL</text><text x="250" y="514" text-anchor="middle" font-family="Arial" font-size="34" fill="#10131b">RUNNER</text></svg>',
  );

export const CardFaceStates: Story = {
  render: () => (
    <StoryFrame title="CardFace states">
      <StoryGrid>
        <StoryCase title="public">
          <CardFace entity={entities[0]!} />
        </StoryCase>
        <StoryCase title="hidden">
          <CardFace entity={entities[3]!} />
        </StoryCase>
        <StoryCase title="selected / highlighted / targetable">
          <div className="flex flex-wrap gap-3">
            <CardFace entity={entities[0]!} selected />
            <CardFace entity={entities[0]!} highlighted />
            <CardFace entity={entities[0]!} targetable />
          </div>
        </StoryCase>
        <StoryCase title="illegal / dimmed / draggable">
          <div className="flex flex-wrap gap-3">
            <CardFace entity={entities[1]!} illegal />
            <CardFace entity={entities[1]!} dimmed />
            <CardFace entity={entities[1]!} draggable />
          </div>
        </StoryCase>
        <StoryCase title="densities">
          <div className="flex flex-wrap items-end gap-3">
            <CardFace entity={entities[0]!} density="mini" />
            <CardFace entity={entities[0]!} density="compact" />
            <CardFace entity={entities[0]!} density="normal" />
            <CardFace entity={entities[0]!} density="large" />
            <CardFace entity={entities[0]!} density="full" />
          </div>
        </StoryCase>
        <StoryCase title="full card image">
          <CardFace entity={{ ...entities[0]!, imageUrl: cardImageSrc }} density="full" />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const CardWrapper: Story = {
  render: () => (
    <StoryFrame title="Card wrapper densities">
      <div className="flex flex-wrap items-end gap-4">
        <Card entity={entities[0]!} density="compact" />
        <Card entity={entities[0]!} selected />
        <Card entity={entities[0]!} density="large" />
      </div>
    </StoryFrame>
  ),
};

export const CardImageStates: Story = {
  render: () => (
    <StoryFrame title="CardImage states">
      <StoryGrid>
        <StoryCase title="cover">
          <CardImage src={cardImageSrc} alt="Signal Runner cover art" fit="cover" />
        </StoryCase>
        <StoryCase title="contain">
          <CardImage src={cardImageSrc} alt="Signal Runner contained art" fit="contain" />
        </StoryCase>
        <StoryCase title="custom aspect ratio">
          <CardImage src={cardImageSrc} alt="Wide card art" aspectRatio={16 / 9} />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const CardGridStates: Story = {
  render: () => (
    <StoryFrame title="CardGrid states">
      <StoryGrid>
        <StoryCase title="compact">
          <CardGrid entities={entities.slice(0, 3)} density="compact" />
        </StoryCase>
        <StoryCase title="normal">
          <CardGrid entities={entities.slice(0, 4)} />
        </StoryCase>
        <StoryCase title="large">
          <CardGrid entities={entities.slice(0, 2)} density="large" />
        </StoryCase>
        <StoryCase title="empty with count">
          <CardGrid entities={[]} emptyLabel="No cards revealed" countLabel="32" />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const CardRowStates: Story = {
  render: () => (
    <StoryFrame title="CardRow states">
      <StoryGrid>
        <StoryCase title="wrapped">
          <CardRow entities={entities} />
        </StoryCase>
        <StoryCase title="scrolling">
          <CardRow
            entities={[
              ...entities,
              ...entities.map((entity) => ({ ...entity, id: `${entity.id}-copy` })),
            ]}
            wrap={false}
          />
        </StoryCase>
        <StoryCase title="empty">
          <CardRow entities={[]} emptyLabel="No discard cards" />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const CardFanStates: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState("runner");
    return (
      <StoryFrame title="CardFan states">
        <StoryGrid>
          <StoryCase title="portrait compact">
            <CardFan
              entities={entities.slice(0, 4)}
              selectedId={selectedId}
              onSelect={(entity) => setSelectedId(entity.id)}
            />
          </StoryCase>
          <StoryCase title="landscape normal">
            <CardFan
              entities={entities.slice(0, 4)}
              density="normal"
              orientation="landscape"
              selectedId="guard"
            />
          </StoryCase>
          <StoryCase title="empty">
            <CardFan entities={[]} />
          </StoryCase>
        </StoryGrid>
      </StoryFrame>
    );
  },
};

export const HandZoneStates: Story = {
  render: () => (
    <StoryFrame title="HandZone states">
      <StoryGrid>
        <StoryCase title="portrait">
          <HandZone entities={entities.slice(0, 4)} selectedId="runner" />
        </StoryCase>
        <StoryCase title="landscape">
          <HandZone entities={entities.slice(0, 4)} orientation="landscape" />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const CardZoneStates: Story = {
  render: () => (
    <StoryFrame title="CardZone states">
      <StoryGrid>
        <StoryCase title="grid zone">
          <CardZone zone={zones[0]} entities={entities.slice(0, 2)} entityCount={2} />
        </StoryCase>
        <StoryCase title="fan zone">
          <CardZone zone={zones[2]} entities={entities.slice(0, 3)} entityCount={5} />
        </StoryCase>
        <StoryCase title="empty stack zone">
          <CardZone zone={zones[3]} entities={[]} entityCount={32} emptyLabel="Deck hidden" />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const EmptyZoneStates: Story = {
  render: () => (
    <StoryFrame title="EmptyZone states">
      <StoryGrid>
        <StoryCase title="label only">
          <EmptyZone label="No cards" />
        </StoryCase>
        <StoryCase title="with count">
          <EmptyZone label="Deck" count="32" />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const CardInspectorStates: Story = {
  render: () => (
    <StoryFrame title="CardInspector states">
      <div className="storybook-panel p-6">
        <CardInspector entity={entities[0]!}>
          <CardFace entity={entities[0]!} />
        </CardInspector>
      </div>
    </StoryFrame>
  ),
};

export const PriorityRingStates: Story = {
  render: () => (
    <StoryFrame title="PriorityRing states">
      <div className="storybook-panel flex items-center gap-6 p-6">
        <PriorityRing active={false} />
        <PriorityRing active />
        <PriorityRing active size={72} />
      </div>
    </StoryFrame>
  ),
};

export const TokenRowStates: Story = {
  render: () => (
    <StoryFrame title="TokenRow states">
      <StoryGrid>
        <StoryCase title="mixed states">
          <TokenRow
            tokens={[
              { label: "Ready", value: "2", state: "ready" },
              { label: "Rested", value: "1", state: "rested" },
              { label: "Hidden", value: "?", state: "hidden" },
              { label: "Active", value: "3", state: "active" },
            ]}
          />
        </StoryCase>
        <StoryCase title="empty">
          <TokenRow tokens={[]} />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};
