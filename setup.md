##Initialize Next.js in current directory:
```bash
mkdir temp; cd temp; npx create-next-app@latest . --typescript --eslint --tailwind --app --src-dir --import-alias "@/*" --turbopack --yes
```

Now let's move back to the parent directory and move all files.

For Windows (PowerShell):
```powershell
cd ..; Move-Item -Path "temp*" -Destination . -Force; Remove-Item -Path "temp" -Recurse -Force
```

For Mac/Linux (bash):
```bash
cd .. && mv temp/* temp/.* . 2>/dev/null || true && rm -rf temp
```

# Project Files Setup
Generated on: 2025-09-06T23:10:50.646Z
Project ID: 1b0332d2-3c4e-45c3-8536-62b75aec0215

You are responsible for ensuring consistency and proper structure across the established markdown files when generating code based on the following markdown files:
- main-page.md
- home.md
- course.md
- docs.md
- origins.md
- migration.md
- song.md
- docs.md
- home.md
- course.md
- tailwind-imports-best-practice.md

Critical Processing Rules:
- NO parallel implementation
- NO partial completion
- NO skipping between files
- COMPLETE verification at each stage
- MAINTAIN structural integrity
- ENHANCE without breaking

Completion Requirements:
- Each markdown file MUST be fully executed
- ALL code MUST be generated
- VERIFY against file requirements
- LOG completion status
- STRICT sequential processing
- NO mixing implementation steps

The agent MUST:
- Process ONE markdown file at a time
- Complete CURRENT file before advancing
- Generate ALL required code
- Verify FULL implementation
- Track completion status
- Follow markdown specifications exactly

UI best practices:
- The main-page.md file is the parent when it comes to color code, fonting and overall styling. Each page should follow the style from main-page.md
- Ensure layout components (sidebar/nav) extend full viewport height and width using min-h-screen and w-full
- MUST maintain readable contrast by avoiding light gray text (#808080 or lighter) on white backgrounds. Default using black text on white background unless dictated otherwise