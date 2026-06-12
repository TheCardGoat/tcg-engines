<script lang="ts">
  import { goto } from "$app/navigation";
  import HumanVsAiMatchPage from "@/features/simulator-devtools/vs-ai/HumanVsAiMatchPage.svelte";
</script>

<HumanVsAiMatchPage onNavigateToSetup={(path) => goto(path)} />
