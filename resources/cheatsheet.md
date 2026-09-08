# Claude Code cheatsheet

Print this. Keep it next to the keyboard during practices.

## Start

```bash
cd your-project
claude
```

```powershell
irm https://claude.ai/install.ps1 | iex
```

```bash
claude --permission-mode plan
claude -c                  # continue last session in this folder
claude -r "session-name"   # resume a named session
```

## Permission modes (`Shift+Tab`)

| Mode | Claude can | You do |
| --- | --- | --- |
| **Manual** (`default`) | Ask before edits and shell | Approve each step |
| **Accept edits** | Edit files freely | Still approve risky shell |
| **Plan** | Read, search, propose | No source edits until you approve |
| **Auto** | Classifier allows most actions | Spot-check; it still blocks risky ones |
| **Bypass permissions** | Skip prompts | Only in a safe, isolated environment |

## Input prefixes

| Type this | Meaning |
| --- | --- |
| `/` | Command or skill |
| `@path` | Attach a file, folder, or MCP resource |
| `!command` | Run a shell command, then let Claude see the output |
| `Esc` | Stop the current turn |
| `Esc` `Esc` | Rewind |

## Commands you will actually use

| Command | Use it when |
| --- | --- |
| `/init` | First setup of `CLAUDE.md` |
| `/context` | You need to see what is eating the window |
| `/compact` | Long session, new task, keep the useful bits |
| `/clear` | Completely different task |
| `/memory` | Open memory files |
| `/skills` | See loaded skills |
| `/hooks` | See hooks that actually registered |
| `/mcp` | MCP servers, auth, status |
| `/permissions` | Allow/deny tools |
| `/model` | Switch model |
| `/doctor` | Config is weird |
| `/resume` | Jump back to an old session |
| `/plan` or Plan mode | Feature is bigger than a rename |
| `/rewind` | The last approach was wrong |
| `/help` | You forgot this table |

## Where knowledge lives

| Put it here | If it is |
| --- | --- |
| `CLAUDE.md` | Always-on facts: build, test, architecture, “never do X” |
| `CLAUDE.local.md` | Personal, gitignored |
| `.claude/rules/*.md` | Topic files; add `paths:` to load only for matching files |
| `.claude/skills/*/SKILL.md` | A procedure you run sometimes, or `/name` |
| Hooks in `.claude/settings.json` | Must happen every time, no judgment |
| `.mcp.json` | External systems: Jira, Slack, DBs |
| `@file` in `CLAUDE.md` | Linked docs loaded at session start |

Keep `CLAUDE.md` under ~200 lines. Move long playbooks into skills.

## Agent loop (say this out loud)

1. **Gather** — read code, tickets, docs, errors  
2. **Act** — edit files, run commands, call MCP  
3. **Verify** — tests, linters, types, screenshots  
4. **Repeat** until the check is green, or you redirect

Never accept “looks done.” Ask for the command output.

## Context hygiene

- Put standing rules in `CLAUDE.md`, not in chat.
- Use skills so large docs load on demand.
- Use a subagent when Claude would otherwise read 40 files into *your* window.
- `/compact focus on the auth refactor` before a new long task in the same session.
- `/clear` when the next task does not need the last one.
- MCP: names load cheaply; full tool schemas load when used.

## Spec-driven prompt skeleton

```text
Work from @docs/specs/SPEC-xxx.md.
Do not invent requirements.
1. Restate the spec and list open questions.
2. Enter plan mode and write an implementation plan.
3. After I approve, implement.
4. Add/adjust tests from the spec's acceptance criteria.
5. Run pytest and ruff. Fix until green.
6. Update docs if behavior changed.
Show evidence: commands and output, not just "done".
```

## Atlassian MCP (class default)

```bash
claude mcp add --transport http atlassian https://mcp.atlassian.com/v2/mcp
```

Then in a session: `/mcp` → authenticate.

```text
Read Jira ISSUE-123 and summarize acceptance criteria.
Create a story in project CAMP for: ...
Do not change issue status unless I say so.
```

## Verification prompt (paste often)

```text
Write the code, then run the tests and the linter.
If anything fails, fix it and run them again.
Do not stop until pytest and ruff are green,
or you are blocked and can name the blocker.
```
