## Surface Brief — Landing page (src/routes/index.tsx)

### Scope
Persuade. Single-page landing. Primary surface.

### Visitor
Women 18-45 in Caracas. Mobile-first browse, desktop decision. Job: confirm a nail appointment in under 60 seconds from arrival.

### Direction Contract

THESIS: The page is a high-fashion editorial archive — the service catalog expressed as a nail-box index wall, photography dominant, the booking form woven into the same scroll without a separate page. It refuses the glassmorphism salon-landing default.

OWN-WORLD: Deep plum-near-black ground (`oklch(0.12 0.055 330)`). Rose-mauve lacquer strips (`oklch(0.48 0.12 340)`) as index-tab accents on service panels. White body text and headlines. Warm rose (`oklch(0.62 0.18 345)`) for primary actions only. Fraunces light italic for display; system-stacked condensed sans (font-stretch: condensed) for index labels; `font-family: ui-monospace` for metadata. No decorative glass, no hero-stats template, no gradient text.

STORY: Arrive → feel the dark precision + see the photography → index panels reveal services inline → select → date/time grid activates → contact form → confirm.

FIRST VIEWPORT: Full-width dark panel. Left 40%: vertical stack of rose-mauve index strips (3 strips, full-bleed horizontal bands, condensed white caps for service names, monospace duration+price right-justified). Right 60%: full-height editorial photograph (pearlescent nails, dark studio background, luxury). Overlaid at bottom: "Belleza que se siente" in Fraunces 72-80px light italic white, crossing both columns. No kicker label. Two CTAs in bottom-left: rose pill "Agendar ahora" + ghost ring "Ver servicios".

FORM: Comp B (approved). Seed key f53881f8.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

### Approved comp
`C:/Users/Shino/.gemini/antigravity-cli/brain/7af83059-d2e3-4386-83f9-78c0f39fd3bc/comp_archive_b_1789764555328.jpg`

### Unresolved
- Real hero and service images exist in assets; will use those rather than generating new plates
- Express backend API endpoint for booking submission (TBD, currently wired to Supabase — keep same interface, swap endpoint)
