import type { Meta, StoryObj } from "@storybook/react-vite";

import { AccessibilityAnnouncer } from "./AccessibilityAnnouncer";
import { CardFace } from "./CardFace";
import { ChessClock } from "./ChessClock";
import { Draggable } from "./Draggable";
import { Droppable } from "./Droppable";
import { KeyboardNavigator } from "./KeyboardNavigator";
import { DndContext, useDndProvider } from "../hooks/useDnd";
import { StoryCase, StoryFrame, StoryGrid } from "../storybook/StoryFrame";
import { entities } from "../storybook/fixtures";

const meta = {
  title: "Simulator UI/Components/Interaction And Accessibility",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChessClockStates: Story = {
  render: () => (
    <StoryFrame title="ChessClock states">
      <StoryGrid>
        <StoryCase title="running">
          <ChessClock timerMs={92000} />
        </StoryCase>
        <StoryCase title="paused">
          <ChessClock timerMs={24000} timerState="paused" />
        </StoryCase>
        <StoryCase title="expired">
          <ChessClock timerMs={0} timerState="expired" />
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const KeyboardNavigatorStates: Story = {
  render: () => (
    <StoryFrame title="KeyboardNavigator states">
      <StoryGrid>
        <StoryCase title="horizontal loop">
          <KeyboardNavigator loop onActivate={() => undefined}>
            <div className="flex gap-3">
              {entities.slice(0, 3).map((entity) => (
                <CardFace key={entity.id} entity={entity} tabIndex={0} />
              ))}
            </div>
          </KeyboardNavigator>
        </StoryCase>
        <StoryCase title="grid">
          <KeyboardNavigator orientation="grid" loop>
            <div className="grid grid-cols-2 gap-3">
              {entities.slice(0, 4).map((entity) => (
                <CardFace key={entity.id} entity={entity} tabIndex={0} />
              ))}
            </div>
          </KeyboardNavigator>
        </StoryCase>
      </StoryGrid>
    </StoryFrame>
  ),
};

export const DragAndDropStates: Story = {
  render: () => {
    const dnd = useDndProvider();
    return (
      <StoryFrame title="Draggable and Droppable states">
        <DndContext.Provider value={dnd}>
          <StoryGrid>
            <StoryCase title="enabled draggable">
              <Draggable
                dragData={{ entityId: "runner", zoneId: "player-field", entityKind: "unit" }}
              >
                <CardFace entity={entities[0]!} />
              </Draggable>
            </StoryCase>
            <StoryCase title="disabled draggable">
              <Draggable
                disabled
                dragData={{ entityId: "guard", zoneId: "opponent-field", entityKind: "unit" }}
              >
                <CardFace entity={entities[1]!} dimmed />
              </Draggable>
            </StoryCase>
            <StoryCase title="droppable battlefield">
              <Droppable
                zoneId="player-field"
                zoneRole="battlefield"
                allowedDropRoles={["battlefield"]}
              >
                <div className="min-h-[180px] rounded-lg border border-dashed border-[var(--board-border)] p-4 text-[var(--board-text)]">
                  Drop battlefield cards here.
                </div>
              </Droppable>
            </StoryCase>
          </StoryGrid>
        </DndContext.Provider>
      </StoryFrame>
    );
  },
};

export const AccessibilityAnnouncerStates: Story = {
  render: () => (
    <StoryFrame title="AccessibilityAnnouncer">
      <div className="storybook-panel p-6">
        <AccessibilityAnnouncer />
        <p className="text-sm text-[var(--board-text)]">
          The announcer mounts polite and assertive live regions for simulator messages.
        </p>
      </div>
    </StoryFrame>
  ),
};
