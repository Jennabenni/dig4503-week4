
This MCP server followed the tutorial, and helps keep track of notes that one makes.  It's useful for keeping track of projects that one can make and can easily give
details to Claude or another assistant that can use MCP servers.  The installation instructions followed the tutorial, and were:

1.  Create a Node.js project in ~/dig4503/week4/dev-notes-server with npm init
2.  Create a simple MCP server for Claude Code using Node.js.

The server should have three tools:

1. "save_note" - Takes a title (string) and content (string), saves the
   content as a markdown file in ~/dev-notes/ using the title as the
   filename (slugified, e.g. "Project Ideas" → "project-ideas.md").
   Creates the ~/dev-notes/ directory if it doesn't exist.

2. "list_notes" - Takes no parameters, returns a list of all .md files
   in ~/dev-notes/ with their titles and last-modified dates.

3. "read_note" - Takes a title (string), finds the matching .md file in
   ~/dev-notes/, and returns its contents.

Please create:

1. package.json with the @modelcontextprotocol/sdk dependency
2. index.js with the complete server code using McpServer and StdioServerTransport
3. Add clear comments explaining what each part does

Keep it simple - this is my first MCP server.



3.  Setup CodeTour, make sure that you are in dev-notes-server as the root folder, then run "CodeTour Start tour"
4. Any errors were run through Claude to make sure it ran smoothly
5. Had the codetour be more descriptive, prompting:
  "can my codetour be a little more specific? explaining it for someone who has never used MCP servers before"

6. Since I installed the mcp server with Claude, dependencies were installed
7. Start and test the MCP server. Verify that all three tools work correctly.  It confirmed there were no issues
8. ran this code: claude mcp add --transport stdio dev-notes -- node /full/path/to/dev-notes-server/index.js, however
I encountered a few issues, so I had to troubleshoot with Claude, asking if the pathing is wrong or what the issue was, since the MCP server was failing.

9. After fixing it with Claude, it appears in /mcp in the Claude terminal

10. Was then able to create a note, see all notes, and read a note.

Usage examples:

- "Save a note called "project-ideas" with some ideas for my midterm         
  project.  This project is for a low and no code class that uses claude"

- read my project idea notes 


No known limitations or issues.

