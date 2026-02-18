// Import the two core pieces from the MCP SDK:
// - McpServer: manages tools and handles the protocol logic
// - StdioServerTransport: lets Claude Code talk to this server over stdin/stdout
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod"; // zod is bundled with the SDK; used to define tool parameter schemas

import fs from "fs";
import path from "path";
import os from "os";

// The directory where all notes will be stored
const NOTES_DIR = path.join(os.homedir(), "dev-notes");

// Helper: turn a human-readable title into a safe filename
// e.g. "Project Ideas" → "project-ideas.md"
function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric runs with a dash
    .replace(/^-|-$/g, "");      // strip leading/trailing dashes
}

// Helper: ensure ~/dev-notes/ exists before trying to write into it
function ensureNotesDir() {
  if (!fs.existsSync(NOTES_DIR)) {
    fs.mkdirSync(NOTES_DIR, { recursive: true });
  }
}

// Create the MCP server instance and give it a name + version
const server = new McpServer({
  name: "dev-notes-server",
  version: "1.0.0",
});

// ── Tool 1: save_note ────────────────────────────────────────────────────────
// Saves a markdown file to ~/dev-notes/ using the title as the filename.
server.tool(
  "save_note",
  "Save a markdown note to ~/dev-notes/",
  {
    // z.object() describes the parameters Claude must supply when calling this tool
    title:   z.string().describe("Title of the note (used as the filename)"),
    content: z.string().describe("Markdown content to save"),
  },
  async ({ title, content }) => {
    ensureNotesDir();

    const filename = slugify(title) + ".md";
    const filepath = path.join(NOTES_DIR, filename);

    fs.writeFileSync(filepath, content, "utf8");

    return {
      content: [
        {
          type: "text",
          text: `Note saved to ${filepath}`,
        },
      ],
    };
  }
);

// ── Tool 2: list_notes ───────────────────────────────────────────────────────
// Returns all .md files in ~/dev-notes/ with their names and last-modified dates.
server.tool(
  "list_notes",
  "List all notes in ~/dev-notes/",
  {}, // no parameters needed
  async () => {
    ensureNotesDir();

    const files = fs
      .readdirSync(NOTES_DIR)
      .filter((f) => f.endsWith(".md"));

    if (files.length === 0) {
      return { content: [{ type: "text", text: "No notes found." }] };
    }

    // Build a readable list showing filename and last-modified date
    const lines = files.map((filename) => {
      const filepath = path.join(NOTES_DIR, filename);
      const stats = fs.statSync(filepath);
      const modified = stats.mtime.toLocaleString();
      return `- ${filename}  (last modified: ${modified})`;
    });

    return {
      content: [
        {
          type: "text",
          text: lines.join("\n"),
        },
      ],
    };
  }
);

// ── Tool 3: read_note ────────────────────────────────────────────────────────
// Finds a note by title (slugified) and returns its contents.
server.tool(
  "read_note",
  "Read a note from ~/dev-notes/ by title",
  {
    title: z.string().describe("Title of the note to read"),
  },
  async ({ title }) => {
    ensureNotesDir();

    const filename = slugify(title) + ".md";
    const filepath = path.join(NOTES_DIR, filename);

    if (!fs.existsSync(filepath)) {
      return {
        content: [
          {
            type: "text",
            text: `Note not found: ${filepath}`,
          },
        ],
      };
    }

    const content = fs.readFileSync(filepath, "utf8");

    return {
      content: [
        {
          type: "text",
          text: content,
        },
      ],
    };
  }
);

// ── Start the server ─────────────────────────────────────────────────────────
// StdioServerTransport connects the server to Claude Code via stdin/stdout.
// This is the standard transport for local MCP servers.
const transport = new StdioServerTransport();
await server.connect(transport);
