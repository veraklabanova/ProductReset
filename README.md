# CCM v2.0 - Construction Capacity Manager

Funkcni prototyp systemu pro rizeni kapacit ve stavebnictvi. Vznikl na zaklade strategickeho dokumentu **PRODUKTOVY RESET**.

## Funkce prototypu

- **Dashboard** - Prehled kapacit, konfliktu a zon
- **Pracovnici** - Sprava zdroju s filtry a vyhledavanim
- **Projekty** - Prehled staveb s prirazenymy pracovniky
- **Kalendar** - Tydenni alokace se sloty (AM/PM/Den/Noc), validace 16h limitu
- **Heatmapa** - Vizualni konfliktni mapa (prekapacity, zonove konflikty)
- **Migracni pruvodce** - 4-krokovy wizard pro prechod z v1.0 na v2.0
- **Audit Log** - Historie vsech akci a prepisu pravidel

## Validacni pravidla

- **16h Hard Cap** - System blokuje prirazeni presahujici 16h/den
- **Zone-Check** - Varovani pri prirazeni do 2+ zon za den
- **Override** - Prepis mekkych pravidel s povinnym oduvodnenim

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Lucide React (ikony)
- In-memory ukazkova data (15 pracovniku, 5 projektu, 3 zony)

## Spusteni

```bash
npm install
npm run dev
```

## Nasazeni

Projekt je pripraven pro deploy na Vercel.
