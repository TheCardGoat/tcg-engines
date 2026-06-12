<script lang="ts">
  import * as Sidebar from "$lib/design-system/primitives/sidebar";
  import type { ConfirmableDirectMoveCategoryId } from "@/features/simulator/model/direct-action-state.js";
  import LorcanaSimulatorSidebar from "@/features/simulator/shell/LorcanaSimulatorSidebar.svelte";

  interface Props {
    readOnly?: boolean;
    onOpenHotkeys?: () => void;
    onOpenSupport?: () => void;
    pendingDirectMoveCategoryId?: ConfirmableDirectMoveCategoryId | null;
    onTriggerUndo?: (() => void) | null;
  }

  let {
    readOnly = false,
    onOpenHotkeys,
    onOpenSupport,
    pendingDirectMoveCategoryId = null,
    onTriggerUndo = null,
  }: Props = $props();
</script>

<Sidebar.Provider>
  <LorcanaSimulatorSidebar
    {readOnly}
    {onOpenHotkeys}
    {onOpenSupport}
    {pendingDirectMoveCategoryId}
    {onTriggerUndo}
  />
</Sidebar.Provider>
