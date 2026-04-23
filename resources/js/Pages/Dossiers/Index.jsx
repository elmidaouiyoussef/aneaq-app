import { Head, Link, router } from '@inertiajs/react';
import DashboardShell from '@/Layouts/DashboardShell';

function statusBadge(status) {
    const tones = {
        'Établissement sélectionné': 'bg-blue-100 text-blue-700',
        'Accès envoyé': 'bg-amber-100 text-amber-700',
        'Formulaire complété': 'bg-cyan-100 text-cyan-700',
        'Experts affectés': 'bg-indigo-100 text-indigo-700',
        'En cours d’autoévaluation': 'bg-violet-100 text-violet-700',
        'Rapport reçu': 'bg-emerald-100 text-emerald-700',
        'Annexes reçues': 'bg-teal-100 text-teal-700',
        'Clôturé': 'bg-slate-900 text-white',
    };

    return tones[status] || 'bg-slate-100 text-slate-700';
}

export default function Index({ dossiers = [], filters = {} }) {
    return (
        <>
            <Head title="Gestion des dossiers" />

            <DashboardShell
                title="Gestion des dossiers"
                subtitle="Suivi métier des établissements"
                action={
                    <Link
                        href="/campagnes"
                        className="rounded-xl bg-[#223270] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b285a]"
                    >
                        Voir les vagues
                    </Link>
                }
            >
                {filters.statut && (
                    <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                        Filtre actif : <strong>{filters.statut}</strong>
                    </div>
                )}

                <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-sm text-slate-600">
                                    <th className="px-6 py-4">Référence</th>
                                    <th className="px-6 py-4">Dossier</th>
                                    <th className="px-6 py-4">Établissement</th>
                                    <th className="px-6 py-4">Vague</th>
                                    <th className="px-6 py-4">Statut</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dossiers.map((dossier) => (
                                    <tr key={dossier.id} className="border-t border-slate-100 text-sm">
                                        <td className="px-6 py-4 font-semibold text-slate-700">
                                            {dossier.reference}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-800">{dossier.nom}</p>
                                            <p className="text-slate-500">{dossier.created_at}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-800">
                                                {dossier.etablissement?.nom || '—'}
                                            </p>
                                            <p className="text-slate-500">{dossier.etablissement?.ville || '—'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700">{dossier.campagne || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusBadge(
                                                    dossier.statut
                                                )}`}
                                            >
                                                {dossier.statut}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <Link
                                                    href={`/dossiers/${dossier.id}`}
                                                    className="font-semibold text-blue-700 hover:text-blue-900"
                                                >
                                                    Ouvrir
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm('Voulez-vous supprimer ce dossier ?')) {
                                                            router.delete(`/dossiers/${dossier.id}`);
                                                        }
                                                    }}
                                                    className="font-semibold text-red-600 hover:text-red-800"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {dossiers.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-sm text-slate-500">
                                            Aucun dossier disponible pour le moment.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DashboardShell>
        </>
    );
}
