# CCM v2.0 – Construction Capacity Manager

## O projektu
Funkční prototyp systému pro řízení kapacit ve stavebnictví, vytvořený na základě strategického dokumentu **PRODUKTOVÝ RESET** (`PRODUKTOVÝ RESET_revised.docx`). Cílem je demonstrovat klíčové funkce v2.0 s ukázkovými daty. Deploy na Vercel.

**GitHub:** https://github.com/veraklabanova/ProductReset

## Tech stack
- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** (postcss plugin)
- **@phosphor-icons/react** – ikony (duotone/fill/bold varianty)
- In-memory mock data (žádná databáze)
- Deploy: Vercel (automatický z GitHub main branch)

## Struktura projektu
```
src/
├── app/
│   ├── page.tsx          – Dashboard (statistiky, konflikty, zóny, tabulka projektů)
│   ├── workers/page.tsx  – Správa pracovníků (tabulka desktop / kartičky mobil)
│   ├── projects/page.tsx – Přehled projektů (grid karty)
│   ├── calendar/page.tsx – Týdenní kalendář alokací s přidáváním + 16h validace
│   ├── heatmap/page.tsx  – Konfliktní heatmapa (barevná matice)
│   ├── migration/page.tsx – 4-krokový migrační wizard (v1.0 → v2.0)
│   ├── audit/page.tsx    – Audit log (filtrovatelný seznam akcí)
│   ├── preview/page.tsx  – Prezentační stránka s device mockupy (iPhone/iPad/Desktop)
│   ├── preview/layout.tsx
│   ├── layout.tsx        – Root layout s AppShell
│   └── globals.css       – Tailwind, animace slide-in, .table-responsive
├── components/
│   ├── sidebar.tsx       – Navigace: desktop sidebar + mobilní hamburger + embed režim
│   └── app-shell.tsx     – Wrapper: podmíněně zobrazuje sidebar (embed/preview režim)
└── lib/
    ├── types.ts          – TypeScript typy (Worker, Project, Allocation, Conflict, atd.)
    ├── data.ts           – Mock data: 15 pracovníků, 5 projektů, 3 zóny, alokace, audit log
    └── validation.ts     – 16h cap validace, zónové konflikty, detekce konfliktů
```

## Klíčové koncepty

### Validační pravidla (Constraint Engine)
- **16h Hard Cap:** `SUM(slot_hours) <= 16` za den – systém BLOKUJE překročení
- **Zone-Check:** Pracovník ve 2+ zónách za den → WARNING (lze přepsat s odůvodněním)
- **Override:** Přepis měkkých pravidel s povinným komentářem → záznam v audit logu

### Časové sloty
- AM (4h), PM (4h), Day/Den (8h), Night/Noc (8h)

### Průmyslové šablony (Metadata Engine)
- Pozemní stavby, Dopravní stavby, Specializovaná řemesla

### Embed režim (?embed=1)
- URL parametr `?embed=1` aktivuje embed režim
- Skryje desktop sidebar, zobrazí kompaktní hamburger lištu
- Všechny interní odkazy zachovávají `?embed=1`
- Používá se v /preview stránce (iPhone/iPad/Desktop iframe mockup)

### Responzivní design
- Breakpointy: mobilní (default) → sm (640px) → md (768px) → lg (1024px) → xl (1280px)
- Sidebar: hamburger overlay na <1024px, fixní sidebar na >=1024px
- Workers: kartičky na mobilu, tabulka na desktopu
- Modály: bottom-sheet styl na mobilu
- Tabulky: horizontální scroll s min-width

## Ukázková data s konflikty
- **w3 (Martin Dvořák):** 20h v pondělí 2026-03-23 → překapacita
- **w4 (Tomáš Černý):** zóna z1+z2 v úterý 2026-03-24 → zónový konflikt
- **w9 (Adam Hájek):** zóna z1+z2 ve středu 2026-03-25 → zónový konflikt
- **w6 (Jakub Horák):** 16h+ ve středu 2026-03-25 → překapacita
- **w4:** override ve čtvrtek 2026-03-26 → přepis s odůvodněním

## Jazyk UI
- Veškerý text v **češtině** se správnou diakritikou (háčky, čárky)
- „Dispečer Kovář" (ne Dispatcher)
- Pomlčky: „–" (ne „-" v textech)

## Příkazy
```bash
npm run dev    # lokální vývoj
npm run build  # produkční build
npm run lint   # ESLint
```
