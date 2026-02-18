Create a simple MCP server for Claude Code using Node.js.

The server should have three tools:

1. "get_weather" - Takes a title (string) and content (string), saves the
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



I think I want to do the weather one, but I need to sleep