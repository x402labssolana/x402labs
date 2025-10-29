# Tailwind CSS Global Import Guide

## ❌ WRONG: What Causes Import Issues (Older Format)
```css
/* DON'T DO THIS in newer Next.js versions - causes styling to break */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## ✅ CORRECT: Proper Global CSS Setup (Newer Next.js Versions)
```css
/* app/globals.css - This is the CORRECT way for newer Next.js versions */
@import "tailwindcss";

/* Your custom styles go after the Tailwind import */
:root {
  --background: #ffffff;
  --foreground: #171717;
}

/* Ensure light theme is used */
* {
  color-scheme: light;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

## Critical Rules

1. **Use `@import "tailwindcss"`** - this is the correct format for newer Next.js versions
2. **Remove the individual @tailwind directives** - they cause conflicts in newer versions
3. **Import globals.css ONLY in your root layout** - never in components
4. **Place custom CSS AFTER the Tailwind import** - not before

## Root Layout Import
```tsx
// app/layout.tsx
import './globals.css' // ← Import ONLY here

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## Quick Fix Checklist
- [ ] Replace individual `@tailwind` directives with `@import "tailwindcss"`
- [ ] Remove `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;` lines
- [ ] Import `globals.css` only in root layout
- [ ] Place custom CSS after the Tailwind import
- [ ] Restart your dev server after changes

This setup will fix your styling issues and prevent future import problems.