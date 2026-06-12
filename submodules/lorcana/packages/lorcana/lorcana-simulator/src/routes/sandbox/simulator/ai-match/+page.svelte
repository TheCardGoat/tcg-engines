<script lang="ts">
  import { goto } from "$app/navigation";
  import AutomatedMatchSetupPage from "@/features/simulator-devtools/ai-match/AutomatedMatchSetupPage.svelte";
</script>

<AutomatedMatchSetupPage onNavigateToViewer={(path) => goto(path)} />
