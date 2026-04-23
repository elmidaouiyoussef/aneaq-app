import { Head, Link, router } from '@inertiajs/react';
import DashboardShell from '@/Layouts/DashboardShell';
import { useMemo, useState } from 'react';

export default function Etablissements({
    campagne,
    statuts = [],
    etablissementsDisponibles = [],
    selectionnes = [],
}) {
    const [query, setQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [rowState, setRowState] = useState(
        Object.fromEntries(
            selectionnes.map((item) => [
                item.id,
                {
                    statut: item.statut,
                    observation: item.observation || '',
                    email: item.etablissement?.email || '',
                },
            ])
        )
    );

    const filteredDisponibles = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        if (!normalized) {
            return etablissementsDisponibles;
        }

        return etablissementsDisponibles.filter((item) => {
            return [
                item.etablissement,
                item.etablissement_2,
                item.ville,
                item.universite,
                item.email,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(normalized));
        });
    }, [etablissementsDisponibles, query]);

    const toggleSelection = (id) => {
        setSelectedIds((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    };

    return (
        <>
            <Head title={`Établissements - ${campagne.reference}`} />

            <DashboardShell
                title={`Établissements - ${campagne.reference}`}
                subtitle="Phase 2, 3 et 5 du flux DEE"
                action={
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/campagnes/${campagne.id}`}
                            className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200"
                        >
                            Retour à la vague
                        </Link>
                        <Link
                            href="/dossiers"
                            className="rounded-xl bg-[#223270] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b285a]"
                        >
                            Voir les dossiers
                        </Link>
                    </div>
                }
            >
                <div className="grid gap-6 xl:grid-cols-[1.1fr,1.6fr]">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-black text-slate-900">Ajouter des établissements</h2>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher un établissement, une ville, une université..."
                            className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                        />

                        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                            {filteredDisponibles.map((item) => {
                                const checked = selectedIds.includes(item.id);
                                const label = item.etablissement_2 || item.etablissement;

                                return (
                                    <label
                                        key={item.id}
                                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                                            checked
                                                ? 'border-blue-200 bg-blue-50'
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleSelection(item.id)}
                                            className="mt-1"
                                        />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-800">{label}</p>
                                            <p className="text-sm text-slate-500">
                                                {item.ville || 'Ville non renseignée'} · {item.universite || 'Université non renseignée'}
                                            </p>
                                        </div>
                                    </label>
                                );
                            })}

                            {filteredDisponibles.length === 0 && (
                                <p className="text-sm text-slate-500">Aucun établissement disponible pour cette recherche.</p>
                            )}
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                            <p className="text-sm text-slate-500">{selectedIds.length} sélectionné(s)</p>
                            <button
                                type="button"
                                onClick={() => {
                                    router.post(
                                        `/campagnes/${campagne.id}/etablissements/select`,
                                        { etablissement_ids: selectedIds },
                                        {
                                            onSuccess: () => setSelectedIds([]),
                                        }
                                    );
                                }}
                                disabled={selectedIds.length === 0}
                                className="rounded-xl bg-[#223270] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b285a] disabled:opacity-60"
                            >
                                Ajouter à la vague
                            </button>
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-black text-slate-900">Suivi des établissements sélectionnés</h2>

                        <div className="space-y-4">
                            {selectionnes.map((item) => (
                                <div key={item.id} className="rounded-[1.7rem] border border-slate-200 p-5">
                                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                        <div>
                                            <p className="text-lg font-bold text-slate-900">
                                                {item.etablissement?.nom || 'Établissement'}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {item.etablissement?.ville || 'Ville non renseignée'} · {item.etablissement?.universite || 'Université non renseignée'}
                                            </p>
                                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                                Dossier: {item.dossier?.reference || 'Non généré'}
                                            </p>
                                        </div>

                                        {item.dossier?.id && (
                                            <Link
                                                href={`/dossiers/${item.dossier.id}`}
                                                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
                                            >
                                                Ouvrir le dossier
                                            </Link>
                                        )}
                                    </div>

                                    <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr,1fr,auto]">
                                        <select
                                            value={rowState[item.id]?.statut || item.statut}
                                            onChange={(e) =>
                                                setRowState((current) => ({
                                                    ...current,
                                                    [item.id]: {
                                                        ...(current[item.id] || {}),
                                                        statut: e.target.value,
                                                    },
                                                }))
                                            }
                                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                                        >
                                            {statuts.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>

                                        <input
                                            type="text"
                                            value={rowState[item.id]?.observation || ''}
                                            onChange={(e) =>
                                                setRowState((current) => ({
                                                    ...current,
                                                    [item.id]: {
                                                        ...(current[item.id] || {}),
                                                        observation: e.target.value,
                                                    },
                                                }))
                                            }
                                            placeholder="Observation de suivi"
                                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.patch(
                                                    `/campagnes/${campagne.id}/etablissements/${item.id}`,
                                                    {
                                                        statut: rowState[item.id]?.statut || item.statut,
                                                        observation: rowState[item.id]?.observation || '',
                                                    }
                                                )
                                            }
                                            className="rounded-xl bg-[#223270] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b285a]"
                                        >
                                            Mettre à jour
                                        </button>
                                    </div>

                                    <div className="mt-4 grid gap-4 xl:grid-cols-[1fr,auto]">
                                        <input
                                            type="email"
                                            value={rowState[item.id]?.email || ''}
                                            onChange={(e) =>
                                                setRowState((current) => ({
                                                    ...current,
                                                    [item.id]: {
                                                        ...(current[item.id] || {}),
                                                        email: e.target.value,
                                                    },
                                                }))
                                            }
                                            placeholder="Email de connexion établissement"
                                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.post(
                                                    `/campagnes/${campagne.id}/etablissements/${item.id}/send-access`,
                                                    {
                                                        email: rowState[item.id]?.email || '',
                                                    }
                                                )
                                            }
                                            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                                        >
                                            Générer l’accès et envoyer l’email
                                        </button>
                                    </div>

                                    <div className="mt-4 grid gap-3 text-xs text-slate-500 md:grid-cols-3">
                                        <p>Lettre: {item.lettre_envoyee_at || '—'}</p>
                                        <p>Compte: {item.compte_genere_at || '—'}</p>
                                        <p>Email: {item.email_envoye_at || '—'}</p>
                                    </div>
                                </div>
                            ))}

                            {selectionnes.length === 0 && (
                                <p className="text-sm text-slate-500">Aucun établissement n’a encore été ajouté à cette vague.</p>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardShell>
        </>
    );
}
