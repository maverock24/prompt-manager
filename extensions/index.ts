/**
 * Prompt Manager Extension
 *
 * A general-purpose prompt library manager for pi coding agent.
 * Ships with OWASP Top 10 security audit prompts as the initial library.
 *
 * Features:
 * - /prompts — list all available prompt templates
 * - /prompt <name> — load and inject a specific prompt into the conversation
 * - load_prompt tool — LLM can load prompts by name
 * - list_prompts tool — LLM can discover available prompts
 * - Automatic critical-thinking preamble injected into system prompt
 *
 * Add new prompts by committing .md files to prompts/ and running pi update.
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PromptMeta {
  /** Filename without extension — used as the prompt key */
  slug: string;
  /** Human-readable title (from frontmatter or filename) */
  title: string;
  /** Short description (from frontmatter or first paragraph) */
  description: string;
  /** Full path to the .md file */
  path: string;
}

// ─── Critical Thinking Preamble ──────────────────────────────────────────────

const CRITICAL_THINKING_PREAMBLE = `
## ⚠️ CRITICAL THINKING REQUIREMENT

Before answering, you MUST:
1. **Challenge your own assumptions.** Ask yourself: "What am I assuming that I haven't verified?"
2. **Find evidence, don't guess.** Prefer reading actual code/files over relying on memory of how a framework "usually" works.
3. **Cite concrete proof.** Every finding must include exact file paths and line numbers.
4. **State uncertainty explicitly.** If you're unsure, say "I need to verify X by reading Y" — do NOT proceed without evidence.
5. **Do not move too fast.** Take the time to actually inspect the code. A thorough slow review is better than a fast sloppy one.
`.trim();

// ─── Prompt Discovery ────────────────────────────────────────────────────────

/**
 * Parse YAML-style frontmatter from a markdown file.
 * Returns { data, bodyOffset } where bodyOffset is the byte offset where content starts.
 */
function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const trimmed = raw.trimStart();
  if (!trimmed.startsWith("---")) {
    return { data: {}, body: raw };
  }

  const endIdx = trimmed.indexOf("\n---", 3);
  if (endIdx === -1) {
    return { data: {}, body: raw };
  }

  const fmBlock = trimmed.slice(4, endIdx);
  const body = trimmed.slice(endIdx + 4).trim();

  const data: Record<string, string> = {};
  for (const line of fmBlock.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (key) data[key] = value;
  }

  return { data, body };
}

/**
 * Extract a description from markdown body — first non-empty, non-heading paragraph.
 */
function extractDescription(body: string, maxLen = 120): string {
  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    if (trimmed.length <= maxLen) return trimmed;
    return trimmed.slice(0, maxLen - 3) + "...";
  }
  return "(no description)";
}

/**
 * Discover all prompt .md files in the prompts directory.
 */
async function discoverPrompts(promptsDir: string): Promise<PromptMeta[]> {
  const prompts: PromptMeta[] = [];

  let entries: string[];
  try {
    entries = await readdir(promptsDir);
  } catch {
    return prompts; // directory doesn't exist
  }

  for (const entry of entries) {
    if (extname(entry) !== ".md") continue;
    const fullPath = join(promptsDir, entry);
    try {
      const st = await stat(fullPath);
      if (!st.isFile()) continue;
    } catch {
      continue;
    }

    const slug = basename(entry, ".md");
    let title = slug;
    let description = "";

    try {
      const raw = await readFile(fullPath, "utf-8");
      const { data, body } = parseFrontmatter(raw);
      title = data.title || title;
      description = data.description || extractDescription(body);
    } catch {
      // keep defaults
    }

    prompts.push({ slug, title, description, path: fullPath });
  }

  // Sort: owasp-* prompts in numeric order, then alphabetically
  prompts.sort((a, b) => {
    const aMatch = a.slug.match(/^owasp-(\d+)/);
    const bMatch = b.slug.match(/^owasp-(\d+)/);
    if (aMatch && bMatch) return parseInt(aMatch[1]) - parseInt(bMatch[1]);
    if (aMatch) return -1;
    if (bMatch) return 1;
    return a.slug.localeCompare(b.slug);
  });

  return prompts;
}

/**
 * Load the full content of a prompt by slug.
 */
async function loadPromptContent(promptsDir: string, slug: string): Promise<string | null> {
  const filePath = join(promptsDir, `${slug}.md`);
  try {
    const raw = await readFile(filePath, "utf-8");
    const { body } = parseFrontmatter(raw);
    return body;
  } catch {
    return null;
  }
}

/**
 * Resolve the prompts directory relative to this extension file.
 */
function resolvePromptsDir(): string {
  // __dirname equivalent for ESM
  const extDir = fileURLToPath(import.meta.url);
  // extensions/index.ts -> go up to package root -> prompts/
  return resolve(extDir, "..", "..", "prompts");
}

// ─── Extension ───────────────────────────────────────────────────────────────

export default function promptManager(pi: ExtensionAPI) {
  const promptsDir = resolvePromptsDir();
  let promptCache: PromptMeta[] = [];
  let cacheLoaded = false;

  async function ensureCache(): Promise<PromptMeta[]> {
    if (!cacheLoaded) {
      promptCache = await discoverPrompts(promptsDir);
      cacheLoaded = true;
    }
    return promptCache;
  }

  // ── System Prompt: inject critical-thinking preamble ─────────────────────

  pi.on("before_agent_start", async (event) => {
    // Only inject if not already present
    if (event.systemPrompt.includes("CRITICAL THINKING REQUIREMENT")) {
      return;
    }
    return {
      systemPrompt: event.systemPrompt + "\n\n" + CRITICAL_THINKING_PREAMBLE,
    };
  });

  // ── Tool: list_prompts ──────────────────────────────────────────────────

  pi.registerTool({
    name: "list_prompts",
    label: "List Prompts",
    description:
      "List all available security audit and code review prompt templates. Use this to discover what prompts are available before loading one.",
    promptSnippet: "List available prompt templates in the prompt library",
    promptGuidelines: [
      "Use list_prompts to discover available security audit prompts before loading one with load_prompt.",
      "Call list_prompts when the user asks 'what security audits are available' or 'what prompts do you have'.",
    ],
    parameters: Type.Object({}),
    async execute() {
      const prompts = await ensureCache();
      if (prompts.length === 0) {
        return {
          content: [{ type: "text", text: "No prompt templates found in the library." }],
          details: { prompts: [] },
        };
      }

      const lines = prompts.map(
        (p, i) =>
          `${i + 1}. **${p.slug}** — ${p.title}\n   ${p.description}`,
      );

      return {
        content: [
          {
            type: "text",
            text: `# Available Prompt Templates (${prompts.length})\n\n${lines.join("\n\n")}`,
          },
        ],
        details: { prompts: prompts.map((p) => ({ slug: p.slug, title: p.title, description: p.description })) },
      };
    },
  });

  // ── Tool: load_prompt ───────────────────────────────────────────────────

  pi.registerTool({
    name: "load_prompt",
    label: "Load Prompt",
    description:
      "Load a specific prompt template by its slug name. Use list_prompts first to see available prompts. The loaded prompt will guide your next steps.",
    promptSnippet: "Load a specific prompt template (e.g. owasp-full, owasp-01-broken-access-control)",
    promptGuidelines: [
      "Use load_prompt when the user asks you to run a specific security audit or code review.",
      "Always call list_prompts first if you're unsure what prompts are available.",
    ],
    parameters: Type.Object({
      slug: Type.String({ description: "Prompt slug to load, e.g. 'owasp-full' or 'owasp-03-injection'" }),
    }),
    async execute(_toolCallId, params) {
      const prompts = await ensureCache();
      const found = prompts.find((p) => p.slug === params.slug);

      if (!found) {
        const available = prompts.map((p) => p.slug).join(", ");
        return {
          content: [
            {
              type: "text",
              text: `Prompt "${params.slug}" not found.\n\nAvailable prompts: ${available}`,
            },
          ],
          details: { error: "not_found", available: prompts.map((p) => p.slug) },
        };
      }

      const content = await loadPromptContent(promptsDir, params.slug);
      if (!content) {
        return {
          content: [{ type: "text", text: `Failed to load prompt "${params.slug}" — file may be corrupted.` }],
          details: { error: "read_error" },
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `# Loaded: ${found.title}\n\n${content}\n\n---\n${CRITICAL_THINKING_PREAMBLE}`,
          },
        ],
        details: { slug: params.slug, title: found.title },
      };
    },
  });

  // ── Command: /prompts ───────────────────────────────────────────────────

  pi.registerCommand("prompts", {
    description: "List all available prompt templates",
    handler: async (_args, ctx) => {
      const prompts = await ensureCache();
      if (prompts.length === 0) {
        ctx.ui.notify("No prompt templates found.", "warning");
        return;
      }

      const choice = await ctx.ui.select(
        `Prompt Templates (${prompts.length}) — select to load:`,
        prompts.map((p) => `${p.slug} — ${p.title}`),
      );

      if (!choice) return;

      const slug = choice.split(" — ")[0];
      const content = await loadPromptContent(promptsDir, slug);
      if (!content) {
        ctx.ui.notify(`Failed to load "${slug}"`, "error");
        return;
      }

      const found = prompts.find((p) => p.slug === slug);
      const title = found?.title ?? slug;

      pi.sendUserMessage(
        `Run the following security audit:\n\n# ${title}\n\n${content}\n\n---\n${CRITICAL_THINKING_PREAMBLE}`,
      );
      ctx.ui.notify(`Loaded: ${title}`, "info");
    },
  });

  // ── Command: /prompt <name> ─────────────────────────────────────────────

  pi.registerCommand("prompt", {
    description: "Load a specific prompt template by name",
    getArgumentCompletions: async (prefix: string) => {
      const prompts = await ensureCache();
      const filtered = prompts.filter((p) => p.slug.startsWith(prefix));
      if (filtered.length === 0) return null;
      return filtered.map((p) => ({ value: p.slug, label: `${p.slug} — ${p.title}` }));
    },
    handler: async (args, ctx) => {
      if (!args || !args.trim()) {
        // No argument — show picker
        const prompts = await ensureCache();
        const choice = await ctx.ui.select(
          "Which prompt would you like to load?",
          prompts.map((p) => `${p.slug} — ${p.title}`),
        );
        if (!choice) return;
        args = choice.split(" — ")[0];
      }

      const slug = args.trim();
      const content = await loadPromptContent(promptsDir, slug);
      if (!content) {
        const prompts = await ensureCache();
        const available = prompts.map((p) => p.slug).join(", ");
        ctx.ui.notify(`Prompt "${slug}" not found. Available: ${available}`, "error");
        return;
      }

      const prompts = await ensureCache();
      const found = prompts.find((p) => p.slug === slug);
      const title = found?.title ?? slug;

      pi.sendUserMessage(
        `Run the following security audit:\n\n# ${title}\n\n${content}\n\n---\n${CRITICAL_THINKING_PREAMBLE}`,
      );
      ctx.ui.notify(`Loaded: ${title}`, "info");
    },
  });

  // ── Session Start: preload cache ────────────────────────────────────────

  pi.on("session_start", async () => {
    await ensureCache();
  });
}
