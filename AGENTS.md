# Core Principles

- **Prioritize readability over cleverness** - Write clear, maintainable code
- **Work atomically** - Complete one focused task at a time and confirm before proceeding
- **Stay on scope** - Do not add features or changes that weren't requested

# Python Rules

- **Package management**: Always use `uv` instead of `pip` for all Python operations
- **Database changes**: Never modify database schemas without explicit confirmation first
- **Code consistency**: Review existing codebase patterns before implementing new features
- **Type checking**: Use `uv run ty check .` for type validation (do not use `mypy` directly)
- **Type checking**: Do not check your LSP, it might differ with my IDE. Just NOT!

# TypeScript Rules

- **Package management**: Always use `pnpm` for all Node.js operations
- **Build commands**: Do not run `pnpm dev` or `pnpm build` unless explicitly requested
- **Code consistency**: Review existing codebase patterns before implementing new features
- **Type safety**: Ensure TypeScript strict mode compliance

# Workflow Guidelines

- **Before changes**: Ask clarifying questions if requirements are unclear
- **After changes**: Summarize what was modified and why
- **When uncertain**: Stop and ask rather than making assumptions
