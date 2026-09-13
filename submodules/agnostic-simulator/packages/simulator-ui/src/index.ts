// Components
export { AiControlPanel, type AiControlPanelProps } from "./components/AiControlPanel";
export { Board } from "./components/Board";
export { BoardBlock } from "./components/BoardBlock";
export { BoardLayout } from "./components/BoardLayout";
export { Card } from "./components/Card";
export {
  CardInteractionFrame,
  cardInteractionDescription,
} from "./components/CardInteractionFrame";
export type { CardInteractionFrameProps } from "./components/CardInteractionFrame";
export { CardActionPicker, type CardActionPickerProps } from "./components/CardActionPicker";
export { CardFace } from "./components/CardFace";
export { CardFan } from "./components/CardFan";
export { FixedSlotCardZone, type FixedSlotCardZoneProps } from "./components/FixedSlotCardZone";
export { CardGrid } from "./components/CardGrid";
export { CardImage, STANDARD_CARD_IMAGE_ASPECT_RATIO } from "./components/CardImage";
export {
  ViewerSafeCardImage,
  type ViewerSafeCardImageProps,
} from "./components/ViewerSafeCardImage";
export {
  projectSimulatorEntityForFace,
  type SimulatorEntityFace,
} from "./components/entity-visibility";
export { CardSlot, type CardSlotProps } from "./components/CardSlot";
export { CardStack, type CardStackProps } from "./components/CardStack";
export { CardZone } from "./components/CardZone";
export { DeckStackZone, type DeckStackZoneProps } from "./components/DeckStackZone";
export { DeckRevealShelf, type DeckRevealShelfProps } from "./components/DeckRevealShelf";
export { DiscardPileZone, type DiscardPileZoneProps } from "./components/DiscardPileZone";
export {
  ResourceCardZone,
  type ResourceCardRenderState,
  type ResourceCardZoneProps,
} from "./components/ResourceCardZone";
export { ChatPanel, type ChatMessage, type ChatPanelProps } from "./components/ChatPanel";
export { CompactHandZone } from "./components/CompactHandZone";
export {
  ConnectionPanel,
  type ConnectionPanelDiagnostic,
  type ConnectionPanelConnectionStatus,
  type ConnectionPanelProps,
} from "./components/ConnectionPanel";
export { CardRow } from "./components/CardRow";
export { ChoiceChips } from "./components/ChoiceChips";
export { ChoiceModal } from "./components/ChoiceModal";
export { ChoiceResolutionOverlay } from "./components/ChoiceResolutionOverlay";
export { PromptBanner } from "./components/PromptBanner";
export { CardInspector } from "./components/CardInspector";
export { CardDetailSheet } from "./components/CardDetailSheet";
export {
  CardContextMenu,
  CardContextMenuController,
  type CardContextMenuActionIconProps,
  type CardContextMenuControl,
  type CardContextMenuControlIconProps,
  type CardContextMenuControllerProps,
  type CardContextMenuIdentityProps,
  type CardContextMenuProps,
  type CardContextMenuVisualIdentity,
} from "./components/CardContextMenu";
export { CoreComponentMap } from "./components/CoreComponentMap";
export { EmptyZone } from "./components/EmptyZone";
export { EventLogPanel } from "./components/EventLogPanel";
export { MatchHistoryPanel, type MatchHistoryPanelProps } from "./components/MatchHistoryPanel";
export { Draggable } from "./components/Draggable";
export { Droppable } from "./components/Droppable";
export {
  DropTargetFrame,
  type DropTargetFrameProps,
  type DropTargetTheme,
} from "./components/DropTargetFrame";
export {
  PointerDraggable,
  type PointerDraggableProps,
  type PointerDraggableState,
  type PointerDraggableTransformBehavior,
} from "./components/PointerDraggable";
export {
  PointerDroppable,
  type PointerDroppableProps,
  type PointerDroppableState,
} from "./components/PointerDroppable";
export { FixtureNavigation } from "./components/FixtureNavigation";
export { HandZone } from "./components/HandZone";
export {
  SimulatorViewportShell,
  SimulatorViewportRailPortal,
  SimulatorViewportSidebarToolsProvider,
  useSimulatorViewportLayout,
  type SimulatorViewportRailPortalProps,
  type SimulatorViewportSidebarToolsProviderProps,
  type SimulatorViewportShellControls,
  type SimulatorViewportShellProps,
} from "./components/SimulatorViewportShell";
export {
  SimulatorActivityTabs,
  SimulatorMatchActionDock,
  SimulatorMatchParticipantView,
  SimulatorMatchSidebar,
  type SimulatorActivityTabsProps,
  type SimulatorActivityTab,
  type SimulatorMatchActions,
  type SimulatorMatchActionDockProps,
  type SimulatorMatchActivity,
  type SimulatorMatchAutomation,
  type SimulatorMatchMetric,
  type SimulatorMatchParticipant,
  type SimulatorMatchSidebarProps,
} from "./components/SimulatorMatchSidebar";
export {
  SimulatorRouteStatus,
  type SimulatorRouteStatusProps,
} from "./components/SimulatorRouteStatus";
export {
  TabletopStatementsPanel,
  type TabletopStatementsPanelProps,
} from "./components/TabletopStatementsPanel";
export {
  MaskedCardFrame,
  type MaskedCardFrameOverlayPosition,
  type MaskedCardFrameProps,
} from "./components/MaskedCardFrame";
export {
  MobileBattlefieldLane,
  MobileHandDock,
  MobileMirrorLedger,
  MobilePlayerRail,
  MobilePortraitBoard,
  MobileZoneInventoryPopover,
  type FieldOverflowState,
  type FieldScrollAxis,
  type MobileBattlefieldLaneProps,
  type MobileHandDockProps,
  type MobileMirrorLedgerProps,
  type MobilePlayerRailProps,
  type MobilePortraitBoardProps,
  type MobileZoneInventoryPopoverProps,
} from "./components/MobilePortraitBoard";
export { InteractionPanel } from "./components/InteractionPanel";
export {
  InteractionResolutionPrompt,
  type InteractionChoiceModalPresentation,
  type InteractionResolutionPromptProps,
} from "./components/InteractionResolutionPrompt";
export {
  InteractionDraftProvider,
  useInteractionDraft,
  type InteractionDraftControls,
  type InteractionDraftState,
} from "./interactions/InteractionDraftContext";
export {
  actionsForCard,
  cardInteractionStateFromFlags,
  resolveCardInteractionState,
  useCardInteractionController,
  type CardActionPickerModel,
  type CardInteractionAction,
  type CardInteractionController,
  type CardInteractionControllerOptions,
  type CardInteractionState,
  type CardInteractionStateResolver,
} from "./interactions/card-interaction";
export {
  activeActionableInputs,
  actionableInputs,
  currentActionableInput,
  implicitSubmissionValues,
  interactionBoundsCopy,
  interactionCommitMode,
  interactionInputAdvancesImmediately,
  interactionInputComplete,
  interactionTargetPresentation,
  optionalDecisionInteraction,
  optionalTargetInteraction,
  requirementFromInput,
  resolveInteractionText,
  type OptionalTargetInteraction,
  type InteractionCommitMode,
  type InteractionCommitPolicy,
  type InteractionTargetPresentation,
  type OptionalDecisionInteraction,
} from "./interactions/interaction-presentation";
export { PostGameModal, type PostGameModalProps } from "./components/PostGameModal";
export { RunbookPanel } from "./components/RunbookPanel";
export {
  ResolvingEntityStage,
  type ResolvingEntityStageProps,
} from "./components/ResolvingEntityStage";
export { SeatSummary } from "./components/SeatSummary";
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
  type SidebarCollapsible,
  type SidebarContextValue,
  type SidebarMenuButtonSize,
  type SidebarMenuButtonVariant,
  type SidebarSide,
  type SidebarState,
  type SidebarVariant,
} from "./components/Sidebar";
export { SimulatorHarness } from "./SimulatorHarness";
export { StatusBar } from "./components/StatusBar";
export { SingleCardZone, type SingleCardZoneProps } from "./components/SingleCardZone";
export {
  TabletopActionButton,
  type TabletopActionButtonProps,
} from "./components/TabletopActionButton";
export {
  TabletopCounterBadge,
  type TabletopCounterBadgeProps,
} from "./components/TabletopCounterBadge";
export { TargetingArrow } from "./components/TargetingArrow";
export {
  CombatIntentOverlay,
  type CombatIntentOverlayProps,
} from "./components/CombatIntentOverlay";
export {
  TargetFilterModal,
  type TargetFilterDuplicateFilter,
  type TargetFilterModalClassNames,
  type TargetFilterModalProps,
} from "./components/TargetFilterModal";
export {
  TargetingContext,
  TargetingProvider,
  useTargeting,
  type TargetingContextValue,
  type TargetingProviderProps,
} from "./components/TargetingContext";
export { TargetingOverlay } from "./components/TargetingOverlay";
export { TargetingPreviewBadge } from "./components/TargetingPreviewBadge";
export { TargetingSpotlight } from "./components/TargetingSpotlight";
export { TokenRow } from "./components/TokenRow";
export { TurnIndicator } from "./components/TurnIndicator";
export { PriorityRing } from "./components/PriorityRing";
export { ChessClock } from "./components/ChessClock";
export { ClockReadout, type ClockReadoutProps } from "./components/ClockReadout";
export {
  PointerDragDropSurface,
  type PointerDragDropSurfaceProps,
} from "./components/PointerDragDropSurface";
export { ZoneFrame } from "./components/ZoneFrame";
export * from "./animation/index";
export { isSimulatorAnimationDebugEnabled, simulatorAnimationDebug } from "./animation/debug";

// Accessibility
export { AccessibilityAnnouncer } from "./components/AccessibilityAnnouncer";
export { KeyboardNavigator } from "./components/KeyboardNavigator";

// Hooks
export { DndContext, useDnd, useDndProvider } from "./hooks/useDnd";
export {
  useActiveLayout,
  type ActiveLayout,
  type ActiveLayoutOptions,
} from "./hooks/useActiveLayout";
export { useStickToBottom, type UseStickToBottomOptions } from "./hooks/useStickToBottom";

// Utilities
export { cx } from "./class-names";
export { buildCardImageUrl, resolveEntityImageUrl } from "./lib/urlBuilder";
