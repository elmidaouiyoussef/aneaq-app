import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardShell from '@/Layouts/DashboardShell';
import {
    Building2,
    CalendarDays,
    Eye,
    FolderKanban,
    Layers3,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

function CampagnesIndex({ campagnes = [] }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [search, setSearch] = useState('');
    const [deleteItem, setDeleteItem] = useState(null);

    const filteredCampagnes = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return campagnes;

        return campagnes.filter((item) =>
            [
                item.reference,
                item.annee,
                item.vocation,
                item.statut,
                item.created_by,
                item.created_at,
                item.observation,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(query)
        );
    }, [search, campagnes]);

    const totalCampagnes = campagnes.length;

    const totalEtablissements = useMemo(() => {
        return campagnes.reduce(
            (sum, item) => sum + (item.etablissements_count || 0),
            0
        );
    }, [campagnes]);

    const totalDossiers = useMemo(() => {
        return campagnes.reduce(
            (sum, item) => sum + (item.dossiers_count || 0),
            0
        );
    }, [campagnes]);

    const totalActives = useMemo(() => {
        return campagnes.filter((item) =>
            (item.statut || '').toLowerCase().includes('active')
        ).length;
    }, [campagnes]);

    const submitDelete = () => {
        if (!deleteItem) return;

        router.delete(`/campagnes/${deleteItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteItem(null);
            },
        });
    };

    return (
        <>
            <Head title="Vagues d’évaluation" />

            <div className="mx-auto max-w-[98rem] px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] bg-gradient-to-r from-[#243cbe] via-[#2f61e7] to-[#0ea5c6] px-8 py-10 text-white shadow-xl shadow-blue-900/10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-100">
                                Vagues d’évaluation
                            </p>

                            <h1 className="mt-3 text-4xl font-black tracking-tight">
                                Gestion des vagues
                            </h1>

                            <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50/90">
                                Consulte, recherche, ouvre et supprime les vagues d’évaluation.
                                Chaque vague permet de gérer les établissements sélectionnés et les
                                dossiers associés.
                            </p>
                        </div>

                        <Link
                            href="/campagnes/create"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-blue-700 shadow-lg shadow-blue-900/10 transition hover:bg-blue-50"
                        >
                            <Plus size={18} />
                            Créer une vague
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-4">
                        <StatCard icon={Layers3} label="Vagues" value={totalCampagnes} />
                        <StatCard icon={Building2} label="Établissements" value={totalEtablissements} />
                        <StatCard icon={FolderKanban} label="Dossiers" value={totalDossiers} />
                        <StatCard icon={CalendarDays} label="Actives" value={totalActives} />
                    </div>
                </div>

                <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
                                Liste principale
                            </p>
                            <h2 className="mt-2 text-2xl font-black text-slate-900">
                                Toutes les vagues
                            </h2>
                        </div>

                        <div className="relative w-full lg:max-w-xl">
                            <Search
                                size={18}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher par référence, année, vocation, statut..."
                                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
                            />
                        </div>
                    </div>

                    {flash.success && (
                        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                            {flash.success}
                        </div>
                    )}

                    {flash.error && (
                        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                            {flash.error}
                        </div>
                    )}

                   <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
    <table className="w-full table-fixed">
        <thead className="bg-slate-50">
            <tr className="text-left text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                <th className="w-[13%] px-4 py-4">Référence</th>
                <th className="w-[8%] px-4 py-4">Année</th>
                <th className="w-[17%] px-4 py-4">Vocation</th>
                <th className="w-[10%] px-4 py-4">Statut</th>
                <th className="w-[11%] px-4 py-4 text-center">Étab.</th>
                <th className="w-[9%] px-4 py-4 text-center">Dossiers</th>
                <th className="w-[12%] px-4 py-4">Créée par</th>
                <th className="w-[12%] px-4 py-4">Date</th>
                <th className="w-[18%] px-4 py-4 text-right">Actions</th>
            </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white">
            {filteredCampagnes.length > 0 ? (
                filteredCampagnes.map((item) => (
                    <tr
                        key={item.id}
                        className="align-middle transition hover:bg-slate-50/70"
                    >
                        <td className="px-4 py-5">
                            <div className="break-words text-sm font-black leading-5 text-slate-900">
                                {item.reference || '—'}
                            </div>
                        </td>

                        <td className="px-4 py-5 text-sm font-bold text-slate-700">
                            {item.annee || '—'}
                        </td>

                        <td className="px-4 py-5">
                            <div className="break-words text-sm font-bold leading-5 text-slate-900">
                                {item.vocation || '—'}
                            </div>

                            {item.observation && (
                                <div className="mt-1 line-clamp-2 break-words text-xs font-medium leading-5 text-slate-500">
                                    {item.observation}
                                </div>
                            )}
                        </td>

                        <td className="px-4 py-5">
                            <StatusBadge statut={item.statut} />
                        </td>

                        <td className="px-4 py-5 text-center text-sm font-black text-slate-700">
                            {item.etablissements_count ?? 0}
                        </td>

                        <td className="px-4 py-5 text-center text-sm font-black text-slate-700">
                            {item.dossiers_count ?? 0}
                        </td>

                        <td className="px-4 py-5">
                            <div className="break-words text-sm font-bold text-slate-700">
                                {item.created_by || '—'}
                            </div>
                        </td>

                        <td className="px-4 py-5">
                            <div className="text-sm font-semibold leading-5 text-slate-600">
                                {item.created_at || '—'}
                            </div>
                        </td>

                        <td className="px-4 py-5">
                            <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                                <Link
                                    href={`/campagnes/${item.id}`}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white transition hover:bg-blue-700"
                                >
                                    <Eye size={14} />
                                    Ouvrir
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => setDeleteItem(item)}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white transition hover:bg-red-700"
                                >
                                    <Trash2 size={14} />
                                    Supprimer
                                </button>
                            </div>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td
                        colSpan="9"
                        className="px-6 py-14 text-center text-sm font-semibold text-slate-500"
                    >
                        Aucune vague trouvée.
                    </td>
                </tr>
            )}
        </tbody>
    </table>
</div>

                    <p className="mt-4 text-xs font-medium text-slate-400">
                        Toutes les informations principales des vagues sont affichées directement dans cette page.
                    </p>
                </div>

                {deleteItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg rounded-[2rem] bg-white p-7 shadow-2xl">
                            <div className="mb-5 flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-600">
                                        Suppression
                                    </p>
                                    <h3 className="mt-2 text-2xl font-black text-slate-900">
                                        Confirmer la suppression
                                    </h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setDeleteItem(null)}
                                    className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <p className="text-sm leading-7 text-slate-600">
                                Tu vas supprimer définitivement la vague :
                                <span className="font-bold text-slate-900">
                                    {' '}
                                    {deleteItem.reference}
                                </span>
                            </p>

                            <p className="mt-3 text-sm leading-7 text-slate-500">
                                Si cette vague contient des établissements ou des dossiers, la
                                suppression peut échouer selon les relations de la base de données.
                            </p>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDeleteItem(null)}
                                    className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Annuler
                                </button>

                                <button
                                    type="button"
                                    onClick={submitDelete}
                                    className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                                >
                                    Supprimer définitivement
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function StatCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Icon size={24} />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-blue-100">
                {label}
            </p>
            <p className="mt-2 text-4xl font-black">{value}</p>
        </div>
    );
}

function StatusBadge({ statut }) {
    const value = statut || '—';
    const lower = value.toLowerCase();

    let classes = 'bg-slate-100 text-slate-700';

    if (lower.includes('active')) {
        classes = 'bg-emerald-100 text-emerald-700';
    } else if (lower.includes('brouillon')) {
        classes = 'bg-amber-100 text-amber-700';
    } else if (lower.includes('clôturée') || lower.includes('cloturee')) {
        classes = 'bg-slate-200 text-slate-700';
    } else if (lower.includes('archivée') || lower.includes('archivee')) {
        classes = 'bg-red-100 text-red-700';
    }

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${classes}`}>
            {value}
        </span>
    );
}

CampagnesIndex.layout = (page) => <DashboardShell>{page}</DashboardShell>;

export default CampagnesIndex;