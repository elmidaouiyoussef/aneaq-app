import { Head, Link, router } from '@inertiajs/react';
import DashboardShell from '@/Layouts/DashboardShell';

function badge(status) {
    const tones = {
        brouillon: 'bg-slate-100 text-slate-700',
        active: 'bg-emerald-100 text-emerald-700',
        cloturee: 'bg-slate-900 text-white',
    };

    return tones[status] || 'bg-slate-100 text-slate-700';
}

export default function Index({ campagnes = [], filters = {} }) {
    return (
        <>
            <Head title="Vagues d’évaluation" />

            <DashboardShell
                title="Vagues d’évaluation"
                subtitle="Nouveau point d’entrée DEE"
                action={
                    <Link
                        href="/campagnes/create"
                        className="rounded-xl bg-[#223270] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b285a]"
                    >
                        Nouvelle vague
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
                                    <th className="px-6 py-4">Année</th>
                                    <th className="px-6 py-4">Vocation</th>
                                    <th className="px-6 py-4">Statut</th>
                                    <th className="px-6 py-4">Établissements</th>
                                    <th className="px-6 py-4">Dossiers</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campagnes.map((campagne) => (
                                    <tr key={campagne.id} className="border-t border-slate-100 text-sm">
                                        <td className="px-6 py-4 font-semibold text-slate-700">{campagne.reference}</td>
                                        <td className="px-6 py-4 text-slate-700">{campagne.annee}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-800">{campagne.vocation}</p>
                                            <p className="text-slate-500">{campagne.created_at}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${badge(campagne.statut)}`}>
                                                {campagne.statut}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700">{campagne.etablissements_count}</td>
                                        <td className="px-6 py-4 text-slate-700">{campagne.dossiers_count}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <Link
                                                    href={`/campagnes/${campagne.id}`}
                                                    className="font-semibold text-blue-700 hover:text-blue-900"
                                                >
                                                    Ouvrir
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm('Voulez-vous supprimer cette vague et ses dossiers liés ?')) {
                                                            router.delete(`/campagnes/${campagne.id}`);
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

                                {campagnes.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-sm text-slate-500">
                                            Aucune vague d’évaluation n’a encore été créée.
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
