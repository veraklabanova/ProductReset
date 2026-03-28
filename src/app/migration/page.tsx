'use client';

import { useState } from 'react';
import { migrationFieldMappings } from '@/lib/data';
import { TEMPLATE_LABELS, IndustryTemplate, MigrationFieldMapping } from '@/lib/types';
import { ArrowRight, Check, Warning, X, CaretRight, ArrowsLeftRight, FileMagnifyingGlass, GearSix, ShieldCheck } from '@phosphor-icons/react';

const steps = [
  { id: 1, label: 'Výběr šablony', icon: GearSix },
  { id: 2, label: 'Mapování polí', icon: ArrowsLeftRight },
  { id: 3, label: 'Řešení konfliktů', icon: Warning },
  { id: 4, label: 'Kontrola a podpis', icon: FileMagnifyingGlass },
];

export default function MigrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<IndustryTemplate | null>(null);
  const [mappings] = useState<MigrationFieldMapping[]>(migrationFieldMappings);
  const [conflictsResolved, setConflictsResolved] = useState<Record<string, boolean>>({});
  const [signed, setSigned] = useState(false);

  const conflictMappings = mappings.filter((m) => m.status === 'conflict');
  const allConflictsResolved = conflictMappings.every((m) => conflictsResolved[m.v1Field]);

  const canProceed = () => {
    if (currentStep === 1) return selectedTemplate !== null;
    if (currentStep === 2) return true;
    if (currentStep === 3) return allConflictsResolved;
    return signed;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Migrační průvodce</h1>
        <p className="text-slate-500 mt-1">Automatizovaný převod z v1.0 na v2.0</p>
      </div>

      {/* Kroky postupu */}
      <div className="flex items-center mb-8 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className={`flex items-center gap-3 ${currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep > step.id ? 'bg-emerald-500 text-white' :
                currentStep === step.id ? 'bg-blue-600 text-white' :
                'bg-slate-100 text-slate-400'
              }`}>
                {currentStep > step.id ? <Check className="w-5 h-5" weight="bold" /> : step.id}
              </div>
              <div>
                <p className="text-sm font-medium">{step.label}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Obsah kroků */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        {/* Krok 1: Výběr šablony */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Výběr průmyslové šablony (Blueprint)</h2>
            <p className="text-slate-500 mb-6">Vyberte šablonu, která nejlépe odpovídá vašemu oboru. Šablona definuje strukturu dat, časové sloty a validační pravidla.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.entries(TEMPLATE_LABELS) as [IndustryTemplate, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    selectedTemplate === key
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">{label}</h3>
                  <p className="text-sm text-slate-500">
                    {key === 'ground_construction' && 'Bytová výstavba, komerční budovy, rekonstrukce. Časové sloty: AM/PM/Den.'}
                    {key === 'transportation' && 'Silnice, mosty, železnice. Časové sloty: Den/Noc. Geo-validace tras.'}
                    {key === 'specialized_trades' && 'Elektro, ZTI, svařování. Certifikační kontrola, specializované sloty.'}
                  </p>
                  {selectedTemplate === key && (
                    <div className="mt-3 flex items-center gap-1 text-blue-600 text-sm font-medium">
                      <Check className="w-4 h-4" weight="bold" /> Vybráno
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Krok 2: Mapování polí */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Automatické mapování polí</h2>
            <p className="text-slate-500 mb-6">Systém automaticky namapoval pole z v1.0 na v2.0. Zkontrolujte mapování a odsouhlaste.</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Pole v1.0</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-500"></th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Pole v2.0</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {mappings.map((m) => (
                  <tr key={m.v1Field} className="border-b border-slate-100">
                    <td className="py-3 px-4 font-mono text-sm">{m.v1Field}</td>
                    <td className="py-3 px-4 text-center">
                      <ArrowRight className="w-4 h-4 text-slate-400 mx-auto" />
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">{m.v2Field}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        m.status === 'mapped' ? 'bg-emerald-100 text-emerald-700' :
                        m.status === 'conflict' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {m.status === 'mapped' && <Check className="w-3 h-3" weight="bold" />}
                        {m.status === 'conflict' && <Warning className="w-3 h-3" weight="fill" />}
                        {m.status === 'unmapped' && <X className="w-3 h-3" weight="bold" />}
                        {m.status === 'mapped' ? 'Namapováno' : m.status === 'conflict' ? 'Konflikt' : 'Nenamapováno'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              {mappings.filter((m) => m.status === 'mapped').length} polí úspěšně namapováno,{' '}
              {mappings.filter((m) => m.status === 'conflict').length} konfliktů k řešení,{' '}
              {mappings.filter((m) => m.status === 'unmapped').length} polí zrušeno (speciální režimy).
            </div>
          </div>
        )}

        {/* Krok 3: Řešení konfliktů */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Řešení konfliktů</h2>
            <p className="text-slate-500 mb-6">Následující datové konflikty vyžadují manuální opravu před migrací.</p>
            <div className="space-y-4">
              {conflictMappings.map((m) => (
                <div key={m.v1Field} className={`p-4 rounded-lg border-2 ${
                  conflictsResolved[m.v1Field] ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900">
                        {m.v1Field} <ArrowRight className="w-4 h-4 inline text-slate-400" /> {m.v2Field}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">{m.conflictReason}</p>
                    </div>
                    <button
                      onClick={() => setConflictsResolved((prev) => ({ ...prev, [m.v1Field]: !prev[m.v1Field] }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        conflictsResolved[m.v1Field]
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-white border border-red-300 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      {conflictsResolved[m.v1Field] ? 'Vyřešeno' : 'Označit jako vyřešeno'}
                    </button>
                  </div>
                  {m.v1Field === 'hodiny_denne' && !conflictsResolved[m.v1Field] && (
                    <div className="mt-3 p-3 bg-white rounded border border-red-100 text-sm">
                      <p className="font-medium text-red-700 mb-1">Nalezené chyby (3 záznamy):</p>
                      <ul className="text-slate-600 space-y-1 list-disc list-inside">
                        <li>Pracovník ID-045: 24h/den (2026-01-15) – nereálná směna</li>
                        <li>Pracovník ID-112: 20h/den (2026-02-03) – přesahuje limit</li>
                        <li>Pracovník ID-078: 18h/den (2026-02-20) – přesahuje limit</li>
                      </ul>
                      <p className="text-xs text-slate-400 mt-2">Tyto záznamy budou při migraci ořezány na 16h maximum.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Krok 4: Závěrečná kontrola a podpis */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Závěrečná kontrola a podpis</h2>
            <p className="text-slate-500 mb-6">Zkontrolujte souhrn migrace a potvrďte digitálně.</p>

            <div className="space-y-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Vybraná šablona</p>
                <p className="text-lg font-semibold text-slate-900">{selectedTemplate ? TEMPLATE_LABELS[selectedTemplate] : '–'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Namapovaná pole</p>
                <p className="text-lg font-semibold text-emerald-600">{mappings.filter((m) => m.status === 'mapped').length} / {mappings.length}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Vyřešené konflikty</p>
                <p className="text-lg font-semibold text-emerald-600">{Object.values(conflictsResolved).filter(Boolean).length} / {conflictMappings.length}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Zrušená pole (speciální režimy)</p>
                <p className="text-lg font-semibold text-slate-500">{mappings.filter((m) => m.status === 'unmapped').length}</p>
              </div>
            </div>

            <div className={`p-6 rounded-xl border-2 ${signed ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={signed}
                  onChange={(e) => setSigned(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600"
                />
                <div>
                  <p className="font-medium text-slate-900">Potvrzuji správnost dat a souhlasím s migrací</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Potvrzením přistupujete na migraci dat z v1.0 na v2.0. Data v1.0, která neodpovídají v2.0 schématu,
                    budou uložena v legacy_archive (pouze pro čtení). Migrace je nevratná.
                  </p>
                </div>
              </label>
            </div>

            {signed && (
              <div className="mt-6 p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" weight="duotone" />
                <h3 className="text-lg font-bold text-emerald-700">Migrace připravena ke spuštění</h3>
                <p className="text-sm text-emerald-600 mt-1">Po potvrzení bude migrace provedena během 24 hodin.</p>
                <button className="mt-4 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium">
                  Spustit migraci
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigace */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Zpět
          </button>
          {currentStep < 4 && (
            <button
              onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Další krok
              <CaretRight className="w-4 h-4" weight="bold" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
