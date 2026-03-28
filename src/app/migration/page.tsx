'use client';

import { useState } from 'react';
import { migrationFieldMappings } from '@/lib/data';
import { TEMPLATE_LABELS, IndustryTemplate, MigrationFieldMapping } from '@/lib/types';
import { ArrowRight, Check, AlertTriangle, X, ChevronRight, ArrowRightLeft, FileCheck, Settings, Shield } from 'lucide-react';

const steps = [
  { id: 1, label: 'Vyber sablony', icon: Settings },
  { id: 2, label: 'Mapovani poli', icon: ArrowRightLeft },
  { id: 3, label: 'Reseni konfliktu', icon: AlertTriangle },
  { id: 4, label: 'Kontrola a podpis', icon: FileCheck },
];

export default function MigrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<IndustryTemplate | null>(null);
  const [mappings, setMappings] = useState<MigrationFieldMapping[]>(migrationFieldMappings);
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
        <h1 className="text-3xl font-bold text-slate-900">Migracni pruvodce</h1>
        <p className="text-slate-500 mt-1">Automatizovany prevod z v1.0 na v2.0</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center mb-8 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className={`flex items-center gap-3 ${currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep > step.id ? 'bg-emerald-500 text-white' :
                currentStep === step.id ? 'bg-blue-600 text-white' :
                'bg-slate-100 text-slate-400'
              }`}>
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
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

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        {/* Step 1: Template Selection */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Vyber prumyslove sablony (Blueprint)</h2>
            <p className="text-slate-500 mb-6">Vyberte sablonu, ktera nejlepe odpovida vasemu oboru. Sablona definuje strukturu dat, casove sloty a validacni pravidla.</p>
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
                    {key === 'ground_construction' && 'Bytova vystavba, komercni budovy, rekonstrukce. Casove sloty: AM/PM/Den.'}
                    {key === 'transportation' && 'Silnice, mosty, zeleznice. Casove sloty: Den/Noc. Geo-validace tras.'}
                    {key === 'specialized_trades' && 'Elektro, ZTI, svarovani. Certifikacni kontrola, specializovane sloty.'}
                  </p>
                  {selectedTemplate === key && (
                    <div className="mt-3 flex items-center gap-1 text-blue-600 text-sm font-medium">
                      <Check className="w-4 h-4" /> Vybrano
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Field Mapping */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Automaticke mapovani poli</h2>
            <p className="text-slate-500 mb-6">System automaticky namapoval pole z v1.0 na v2.0. Zkontrolujte mapovani a odsouhlaste.</p>
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
                        {m.status === 'mapped' && <Check className="w-3 h-3" />}
                        {m.status === 'conflict' && <AlertTriangle className="w-3 h-3" />}
                        {m.status === 'unmapped' && <X className="w-3 h-3" />}
                        {m.status === 'mapped' ? 'Namapovano' : m.status === 'conflict' ? 'Konflikt' : 'Nenamapovano'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              {mappings.filter((m) => m.status === 'mapped').length} poli uspesne namapovano,{' '}
              {mappings.filter((m) => m.status === 'conflict').length} konfliktu k reseni,{' '}
              {mappings.filter((m) => m.status === 'unmapped').length} poli zruseno (specialni rezimy).
            </div>
          </div>
        )}

        {/* Step 3: Conflict Resolution */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Reseni konfliktu</h2>
            <p className="text-slate-500 mb-6">Nasledujici datove konflikty vyzaduji manualni opravu pred migraci.</p>
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
                      {conflictsResolved[m.v1Field] ? 'Vyreseno' : 'Oznacit jako vyreseno'}
                    </button>
                  </div>
                  {m.v1Field === 'hodiny_denne' && !conflictsResolved[m.v1Field] && (
                    <div className="mt-3 p-3 bg-white rounded border border-red-100 text-sm">
                      <p className="font-medium text-red-700 mb-1">Nalezene chyby (3 zaznamy):</p>
                      <ul className="text-slate-600 space-y-1 list-disc list-inside">
                        <li>Pracovnik ID-045: 24h/den (2026-01-15) - nerealna smena</li>
                        <li>Pracovnik ID-112: 20h/den (2026-02-03) - presahuje limit</li>
                        <li>Pracovnik ID-078: 18h/den (2026-02-20) - presahuje limit</li>
                      </ul>
                      <p className="text-xs text-slate-400 mt-2">Tyto zaznamy budou pri migraci orezany na 16h maximum.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Review & Sign-off */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Zaverecna kontrola a podpis</h2>
            <p className="text-slate-500 mb-6">Zkontrolujte souhrn migrace a potvrdte digitalne.</p>

            <div className="space-y-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Vybrana sablona</p>
                <p className="text-lg font-semibold text-slate-900">{selectedTemplate ? TEMPLATE_LABELS[selectedTemplate] : '-'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Namapovana pole</p>
                <p className="text-lg font-semibold text-emerald-600">{mappings.filter((m) => m.status === 'mapped').length} / {mappings.length}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Vyresene konflikty</p>
                <p className="text-lg font-semibold text-emerald-600">{Object.values(conflictsResolved).filter(Boolean).length} / {conflictMappings.length}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Zrusena pole (specialni rezimy)</p>
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
                  <p className="font-medium text-slate-900">Potvrzuji spravnost dat a souhlasim s migraci</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Potvrzenim pristupujete na migraci dat z v1.0 na v2.0. Data v1.0, ktera neodpovidaji v2.0 schematu,
                    budou ulozena v legacy_archive (pouze pro cteni). Migrace je nevratna.
                  </p>
                </div>
              </label>
            </div>

            {signed && (
              <div className="mt-6 p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <Shield className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-emerald-700">Migrace pripravena ke spusteni</h3>
                <p className="text-sm text-emerald-600 mt-1">Po potvrzeni bude migrace provedena behem 24 hodin.</p>
                <button className="mt-4 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium">
                  Spustit migraci
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Zpet
          </button>
          {currentStep < 4 && (
            <button
              onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Dalsi krok
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
