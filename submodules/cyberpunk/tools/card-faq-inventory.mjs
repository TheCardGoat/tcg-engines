export function normalizeFaqText(text) {
  return text
    .normalize("NFKC")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function auditFaqInventory(manifest, faqs) {
  if (manifest.schemaVersion !== 2)
    throw new Error("Expected consolidated FAQ inventory schema 2.");
  const seen = new Set();
  const textOwners = new Map();
  const links = [];
  const conflicts = [];
  for (const entry of manifest.entries) {
    if (!entry.sources?.length || entry.id !== entry.sources[0].id) {
      throw new Error(`FAQ group ${entry.id} needs a stable first source ID.`);
    }
    const sourceIds = new Set();
    for (const source of entry.sources) {
      if (seen.has(source.id)) throw new Error(`Duplicate coverage source ${source.id}`);
      seen.add(source.id);
      sourceIds.add(source.id);
      const question = source.question ?? entry.question;
      const answer = source.answer ?? entry.answer;
      const faq = faqs.get(source.id);
      if (!faq || faq.question !== question || faq.answer !== answer) {
        throw new Error(`FAQ ${source.id} is missing or changed; re-audit its coverage.`);
      }
      const key = `${normalizeFaqText(question)}\n${normalizeFaqText(answer)}`;
      const owner = textOwners.get(key);
      if (owner && owner !== entry.id)
        throw new Error(
          `Duplicate FAQ wording in groups ${owner} and ${entry.id}; consolidate the sources.`,
        );
      textOwners.set(key, entry.id);
      const canonical = `${normalizeFaqText(entry.question)}\n${normalizeFaqText(entry.answer)}`;
      if (key !== canonical && !entry.consolidation) {
        throw new Error(`FAQ ${source.id} needs an explanation for equivalent wording.`);
      }
    }
    if (entry.conflict) {
      if (!entry.conflict.reason || !entry.conflict.policy || !entry.conflict.cardSource) {
        throw new Error(`FAQ ${entry.id} needs an explicit source-conflict explanation.`);
      }
      conflicts.push(entry);
    }
    if (!entry.tests?.length) throw new Error(`FAQ ${entry.id} has no behavior test.`);
    const covered = new Set();
    const testKeys = new Set();
    for (const test of entry.tests) {
      const key = `${test.file}\n${test.title}`;
      if (!test.file || !test.title || testKeys.has(key))
        throw new Error(`Invalid or duplicate test reference for ${entry.id}`);
      testKeys.add(key);
      if (!test.faqIds?.length || new Set(test.faqIds).size !== test.faqIds.length) {
        throw new Error(`Test ${test.title} needs unique FAQ source IDs.`);
      }
      for (const id of test.faqIds) {
        if (!sourceIds.has(id))
          throw new Error(`Test ${test.title} references a source outside its FAQ group: ${id}`);
        covered.add(id);
      }
      links.push({ file: test.file, title: test.title, faqIds: test.faqIds });
    }
    for (const id of sourceIds) {
      if (!covered.has(id))
        throw new Error(`FAQ source ${id} has no behavior test after consolidation.`);
    }
  }
  for (const id of faqs.keys()) {
    if (!seen.has(id)) throw new Error(`New scraped FAQ ${id} needs behavior coverage.`);
  }
  const conflictSources = conflicts.reduce((total, entry) => total + entry.sources.length, 0);
  return {
    links,
    conflicts,
    sourceCount: seen.size,
    verifiedSourceCount: seen.size - conflictSources,
  };
}

export function renderFaqInventory(manifest) {
  const sourceCount = manifest.entries.reduce((n, entry) => n + entry.sources.length, 0);
  const conflicts = manifest.entries.filter((entry) => entry.conflict);
  const conflictSources = conflicts.reduce((n, entry) => n + entry.sources.length, 0);
  const lines = [
    "# Consolidated card FAQ inventory",
    "",
    "<!-- Generated from card-faq-coverage.json. Run node tools/check-card-faq-coverage.mjs --write-inventory from the Cyberpunk workspace. -->",
    "",
    `Source: [official card FAQ feed](${manifest.source}). Checked ${manifest.verifiedDate}.`,
    "",
    `${sourceCount} source FAQs are consolidated into ${manifest.entries.length} entries. ${sourceCount - conflictSources} source FAQs (${manifest.entries.length - conflicts.length} entries) have behavior-test mappings. ${conflictSources} source conflicts remain; their current-behavior tests do not verify the FAQ ruling. Run \`vp run ci:faq\` to verify every linked test.`,
    "",
    "Identical questions and answers share one entry, including repeated text on different cards. Equivalent wording is merged only with an explicit explanation. All official IDs and card-specific test mappings remain. Related questions with different assertions remain separate.",
    "",
    "## Consolidated duplicates",
    "",
    ...manifest.entries
      .filter((entry) => entry.sources.length > 1)
      .map(
        (entry) =>
          `- [${entry.sources
            .map((s) => s.name)
            .filter((s, i, all) => all.indexOf(s) === i)
            .join(
              " / ",
            )}](#faq-${entry.id}): ${entry.sources.length} source FAQs. ${entry.consolidation ?? "Identical question and answer."}`,
      ),
    "",
  ];
  lines.push("## Coverage gaps", "");
  for (const entry of conflicts) {
    lines.push(
      `- [${entry.sources.map((source) => source.name).join(" / ")}](#faq-${entry.id}): ${entry.conflict.reason}`,
    );
  }
  lines.push("");
  for (const entry of manifest.entries) {
    lines.push(
      `<a id="faq-${entry.id}"></a>`,
      "",
      `## ${entry.sources
        .map((s) => s.name)
        .filter((s, i, all) => all.indexOf(s) === i)
        .join(" / ")}`,
      "",
      `**Question:** ${entry.question}`,
      "",
      `**Answer:** ${entry.answer}`,
      "",
      `**Status:** ${entry.conflict ? "Unresolved source conflict; current-behavior tests only." : "Behavior tests mapped; CI requires them to pass."}`,
      "",
    );
    if (entry.consolidation) lines.push(`**Consolidation:** ${entry.consolidation}`, "");
    if (entry.conflict)
      lines.push(
        `**Conflict:** ${entry.conflict.reason}`,
        "",
        `Sources: [card](${entry.conflict.cardSource})${entry.conflict.rulesSource ? `; [rules](${entry.conflict.rulesSource})` : ""}.`,
        "",
      );
    lines.push("**Official sources:**", "");
    for (const source of entry.sources) {
      lines.push(
        `- [${source.name}](https://cyberpunktcg.com/cards/${source.slug}) — \`${source.id}\``,
      );
      if (source.question) lines.push(`  - Wording: ${source.question}`);
      if (source.answer) lines.push(`  - Answer: ${source.answer}`);
    }
    lines.push("", "**Unit tests:**", "");
    for (const test of entry.tests) {
      const cards = entry.sources
        .filter((source) => test.faqIds.includes(source.id))
        .map((source) => source.name);
      lines.push(
        `- [${test.file}](../${test.file}) — ${test.title}${entry.sources.length > 1 ? ` (${[...new Set(cards)].join(" / ")})` : ""}`,
      );
    }
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}
