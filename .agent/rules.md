# Project Rules & Coding Standards

1. **TypeScript Strict Mode**: Keep `"strict": true` in `tsconfig.json`. Every function, API route, and component must have clean, explicit typings.
2. **shadcn/ui & Tailwind CSS**: Build accessible, modern components using Tailwind CSS and shadcn/ui conventions.
3. **Zod Validation**: Validate all incoming API request payloads, query parameters, and configuration inputs using Zod schemas.
4. **Security & Shell Isolation**:
   - NEVER use `exec()` with arbitrary user input or unsanitized strings.
   - Use strict allow-lists and `execFile()` with fixed argument arrays for commands (`systemctl is-active`, `ip -4 addr show`, `ping -I`, `nr-cli`).
   - Slices and interfaces are strictly mapped (`Slice A` -> `uesimtun0`, `Slice B` -> `uesimtun1`).
5. **Dual Environment Resilience**:
   - Provide direct integration with Linux host commands and MongoDB (`mongodb://localhost:27017/open5gs`) for the Ubuntu 5G environment.
   - Provide seamless automatic fallback/demo simulation when running in environments where Open5GS or Linux network interfaces are not actively attached, ensuring the UI and tests can be fully demonstrated anywhere.
6. **Code Clarity**: Keep code simple, well-structured, commented, and beginner-readable. Explain each file briefly.
7. **Phase Discipline**:
   - Show a short plan before coding each phase.
   - Run lint, build, and tests after each phase.
   - Verify acceptance criteria in the browser and commit to Git.

