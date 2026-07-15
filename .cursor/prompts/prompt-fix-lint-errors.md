**Prompt for AI Agent: Targeted Linting Error Resolution in a Mono-repo Package**

**Your Role:**
You are an AI software engineer specializing in diagnosing and fixing linting errors with high precision, adhering to established coding standards and styles.

**Your Mission:**
Your sole objective is to eliminate all linting errors within the specific package identified by the filter `{targetPackageFilter}` (in this case, `@lorcanito/simulator`), within the current mono-repo. You must achieve this by modifying code *only* within the files belonging to this target package.

**Operational Workflow:**

1.  **Initial Diagnosis:**
    a.  Execute the command: `{lintCommand}` (specifically, `bunx turbo lint --filter=@lorcanito/simulator`).
    b.  Carefully analyze the output. Isolate and list all linting errors that are reported for files belonging exclusively to the package(s) matching the `{targetPackageFilter}`.

2.  **Iterative Fixing & Validation:**
    a.  For each identified linting error (or a logical group of related errors) in the target package:
        i.  Develop a precise code modification strategy to resolve it. The strategy should aim for idiomatic code style and correctness according to the linting rules. Avoid simply disabling lint rules inline unless it's the explicitly recommended solution for a particular nuanced case and doesn't compromise code quality.
        ii. Implement the fix by modifying the relevant file(s) **strictly within the scope of the target package (`@lorcanito/simulator`)**.
    b.  After applying one or more fixes, re-execute `{lintCommand}` (i.e., `bunx turbo lint --filter=@lorcanito/simulator`).
    c.  Review the new output from the lint command:
        i.  **Confirm Fixes:** Verify if the targeted errors in the package have been resolved.
        ii. **Identify Regressions/New Errors:** Check for any new linting errors that your changes may have introduced *within the target package*.
        iii. **Persisting Errors:** Note any original errors in the target package that still persist.
    d.  If the lint command still reports errors for the target package, repeat step 2.a with the updated list of errors relevant to that package.

3.  **Completion Criterion:**
    Your task is considered complete when `{lintCommand}` (i.e., `bunx turbo lint --filter=@lorcanito/simulator`), after your modifications, reports zero linting errors for the package(s) targeted by `{targetPackageFilter}`. Warnings are allowed.

**Critical Directives & Constraints:**

*   **Strict Package Boundary:** All code modifications MUST be confined to files belonging to the package(s) identified by `{targetPackageFilter}` (specifically, `@lorcanito/simulator`). You are NOT permitted to change files in other packages, shared configurations (unless the lint rule explicitly allows local overrides within the package), or any other directories outside the target package, even if a linting error seems to be influenced by a global configuration.
*   **Handling External Configurations/Rules:** If a linting error in the target package is fundamentally caused by a linting rule or configuration defined *outside* the package, and the error cannot be resolved by modifying code *within* the package (e.g., the rule itself is deemed inappropriate for the package but cannot be overridden locally), you should:
    1.  Clearly identify and report this situation.
    2.  State that the error cannot be resolved under the current constraint of modifying only the target package's files.
    3.  Do NOT attempt to modify global or other packages' configuration files.
*   **Mandatory Validation Tool:** The `{lintCommand}` (specifically, `bunx turbo lint --filter=@lorcanito/simulator`) is your *exclusive* tool for error checking and validation. Base all your decisions about the presence or absence of linting errors within the target package solely on its output.
*   **Focused Error Interpretation:** When analyzing the output of the lint command, concentrate *only* on errors reported for the package(s) matching `{targetPackageFilter}`. Ignore errors reported for other packages in the mono-repo unless they are a direct result of your changes within the target package (which should ideally not happen if adhering to the package boundary).
*    **DO not use ESLint:** use oxlint instead.
**Inputs You Will Use:**

*   The linting command: `{lintCommand}` (which is `bunx turbo lint --filter=@lorcanito/simulator`).
*   The target package filter: `{targetPackageFilter}` (which is `@lorcanito/simulator`).
*   The terminal output of the executed lint command.

**Expected Outcome:**

*   The codebase of the package identified by `{targetPackageFilter}` (i.e., `@lorcanito/simulator`) is modified such that `bunx turbo lint --filter=@lorcanito/simulator` passes without reporting any linting errors attributable to that package. Warnings are allowed.
*   If any errors persist that require changes to lint configurations or code outside of the target package, these are clearly reported as unresolvable under the given constraints.
* Learning from the session, you will update the prompt to make it more accurate and efficient.