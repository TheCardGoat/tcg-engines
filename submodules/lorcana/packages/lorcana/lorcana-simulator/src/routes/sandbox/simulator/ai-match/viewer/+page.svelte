<script lang="ts">
  import { goto } from "$app/navigation";
  import AutomatedMatchViewerPage from "@/features/simulator-devtools/ai-match/AutomatedMatchViewerPage.svelte";
</script>

<AutomatedMatchViewerPage onNavigateToSetup={(path) => goto(path)} />
