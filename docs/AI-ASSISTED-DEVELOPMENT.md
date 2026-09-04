# How AI Was Used in This Project

Notes on the AI-assisted development process behind the Task Tracker project — written for anyone evaluating how AI was actually used here, not just that it was used.

## Model and tooling

The assistant was **Claude** (Anthropic), running in **Cowork** mode — an agentic interface built on the Claude Agent SDK that gives the assistant a sandboxed environment, file access, shell execution, and web search, rather than a plain chat window. This session was configured to run on **Claude Sonnet 5**.

Two AI capabilities were load-bearing for this project specifically:

- **Web search, used for real-time fact-checking.** When AWS App Runner turned out to have stopped accepting new customers as of April 30, 2026 — a fact that postdates any model's static training — the assistant searched for and verified the current situation, AWS's official deprecation notice, and the recommended alternative, rather than working from outdated assumptions. The same happened when confirming current GitHub Actions syntax and AWS Lightsail pricing before recommending them.
- **A persistent, stateful working session**, not a single prompt-and-response — the assistant tracked project state (a phase-by-phase task list) across the entire multi-hour build, and held context on decisions made earlier in the project (the tech stack chosen, the AWS pivot, the credential incident) when later steps depended on them.

## The collaboration model: advisor, not autopilot

This is the detail most "AI built my app" projects skip, and the one that actually matters for a delivery-leadership audience: **the AI did not execute a single command in this project's actual environment.** Every terminal command, every AWS console click, every GitHub setting change was typed and clicked by a human, in real time, based on the AI's instructions.

Concretely, the working pattern for every step was:

1. AI explains what's about to happen and why.
2. AI gives the exact command or file content.
3. Human runs it / creates it, in their own environment.
4. Human pastes back the actual output.
5. AI verifies that output against what was expected — including catching mistakes silently (a `.gitignore` accidentally created as a folder instead of a file; a JSON file broken by an inline `//` comment; a PowerShell session mistaken for the AWS server's SSH session) before they became compounding problems.
6. Only then does the next step begin.

This was a deliberate choice, not a limitation of the tool — the goal was retained understanding of the full stack, not a fast finished artifact.

## What AI actually did

- Explained the underlying concepts (frontend/backend/API, Git internals, AWS service trade-offs, CI/CD terminology) before any implementation, checking comprehension along the way rather than assuming it.
- Authored the initial code (Express backend, vanilla JS/HTML/CSS frontend, the automated smoke test, the GitHub Actions pipeline YAML) for the human to create and run.
- Recommended and justified each infrastructure and tooling decision, including researching and pivoting the AWS deployment target mid-project when the original plan became unavailable.
- Diagnosed failures interactively (SSH authentication failures, a stuck browser-terminal paste, a timed-out server connection resolved by a reboot) by reasoning through what the error output actually indicated, rather than guessing.
- Flagged a security incident in real time — a GitHub personal access token pasted into the chat by mistake — and required it be revoked and rotated before continuing, rather than treating it as a minor slip.

## What stayed strictly human

- Every keystroke in the terminal, the AWS console, and GitHub's UI.
- Every judgment call with real consequences: approving the AWS App Runner → Lightsail pivot, deciding to make the repository public, choosing what to commit and when.
- All AWS account creation, billing setup, and payment details — the AI never had or requested access to any of it.
- The final decision on what ships and what gets rolled back.

## Takeaway

The interesting part of "using AI for development" isn't that AI can write code — it's *where the line was deliberately drawn* between what the AI was allowed to decide versus execute, and what stayed a human decision with human hands on it. That line is a governance choice, not a technical constraint, and it's the one worth being explicit about in any AI-assisted work presented for review.
