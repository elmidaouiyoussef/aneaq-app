import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardShell from '@/Layouts/DashboardShell';
import {
    CalendarDays,
    Eye,
    FileText,
    FolderKanban,
    MapPin,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

function DossiersIndex({ dossiers = [] }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [search, setSearch] = useState('');
    const [deleteItem, setDeleteItem] = useState(null);

    const filteredDossiers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return dossiers;

        return dossiers.filter((item) =>
            [
                item.reference,
                item.nom,
                item.etablissement,
                item.ville,
                item.campagne,
                item.statut,
                item.created_at,
                item.date_visite,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(query)
        );
    }, [search, dossiers]);

    const totalDossiers = dossiers.length;

    const totalVisitesPlanifiees = useMemo(() => {
        return dossiers.filter((item) => {
            const statut = (item.statut || '').toLowerCase();
            return statut.includes('date de visite planifiée') || !!item.date_visite;
        }).length;
    }, [dossiers]);

    const totalClotures = useMemo(() => {
        return dossiers.filter((item) =>
            (item.statut || '').toLowerCase().includes('clôturé')
        ).length;
    }, [dossiers]);

    const totalDocuments = useMemo(() => {
        return dossiers.reduce((sum, item) => sum + (item.documents_count || 0), 0);
    }, [dossiers]);

    const submitDelete = () => {
        if (!deleteItem) return;

        router.delete(`/dossiers/${deleteItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteItem(null);
            },
        });
    };

    return (
        <>
            <Head title="Dossiers" />

            <div className="mx-auto max-w-[98rem] px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] bg-gradient-to-r from-[#243cbe] via-[#2f61e7] to-[#0ea5c6] px-8 py-10 text-white shadow-xl shadow-blue-900/10">
                    <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-100">
                        Gestion des dossiers
                    </p>

                    <h1 className="mt-3 text-4xl font-black tracking-tight">
                        Tous les dossiers d’évaluation
                    </h1>

                    <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50/90">
                        Consulte rapidement les dossiers, recherche par référence ou établissement,
                        ouvre le détail complet et supprime les dossiers si nécessaire.
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-4">
                        <StatCard icon={FolderKanban} label="Dossiers" value={totalDossiers} />
                        <StatCard icon={CalendarDays} label="Visites planifiées" value={totalVisitesPlanifiees} />
                        <StatCard icon={FileText} label="Documents" value={totalDocuments} />
                        <StatCard icon={FolderKanban} label="Clôturés" value={totalClotures} />
                    </div>
                </div>

                <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
                                Liste principale
                            </p>
                            <h2 className="mt-2 text-2xl font-black text-slate-900">
                                Tous les dossiers
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
                                placeholder="Rechercher par référence, dossier, établissement, vague, statut..."
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
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1250px] table-fixed">
                                <thead className="bg-slate-50">
                                    <tr className="text-left text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                                        <th className="w-[170px] px-4 py-4">Référence</th>
                                        <th className="w-[210px] px-4 py-4">Dossier</th>
                                        <th className="w-[190px] px-4 py-4">Établissement</th>
                                        <th className="w-[135px] px-4 py-4">Vague</th>
                                        <th className="w-[170px] px-4 py-4">Statut</th>
                                        <th className="w-[80px] px-4 py-4 text-center">Experts</th>
                                        <th className="w-[100px] px-4 py-4 text-center">Documents</th>
                                        <th className="w-[140px] px-4 py-4">Date visite</th>
                                        <th className="w-[190px] px-4 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {filteredDossiers.length > 0 ? (
                                        filteredDossiers.map((item) => (
                                            <tr key={item.id} className="align-middle transition hover:bg-slate-50/70">
                                                <td className="px-4 py-5">
                                                    <div className="whitespace-normal break-words text-sm font-black leading-5 text-slate-900">
                                                        {item.reference || '—'}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-5">
                                                    <div className="text-sm font-bold leading-5 text-slate-900">
                                                        {item.nom || '—'}
                                                    </div>
                                                    <div className="mt-1 text-xs font-medium text-slate-500">
                                                        {item.created_at || '—'}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-5">
                                                    <div className="text-sm font-bold text-slate-900">
                                                        {item.etablissement || '—'}
                                                    </div>
                                                    <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                                                        <MapPin size={13} className="text-blue-500" />
                                                        {item.ville || '—'}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-5 text-sm font-semibold leading-5 text-slate-700">
                                                    {item.campagne || '—'}
                                                </td>

                                                <td className="px-4 py-5">
                                                    <StatusBadge statut={item.statut} />
                                                </td>

                                                <td className="px-4 py-5 text-center text-sm font-black text-slate-700">
                                                    {item.experts_count ?? 0}
                                                </td>

                                                <td className="px-4 py-5 text-center text-sm font-black text-slate-700">
                                                    {item.documents_count ?? 0}
                                                </td>

                                                <td className="px-4 py-5 text-sm font-bold text-slate-700">
                                                    {formatVisitDate(item.date_visite)}
                                                </td>

                                                <td className="px-4 py-5">
                                                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                                                        <Link
                                                            href={`/dossiers/${item.id}`}
                                                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                                                        >
                                                            <Eye size={15} />
                                                            Ouvrir
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => setDeleteItem(item)}
                                                            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                                                        >
                                                            <Trash2 size={15} />
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
                                                Aucun dossier trouvé.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <p className="mt-4 text-xs font-medium text-slate-400">
                        Toutes les informations principales du dossier sont affichées directement dans cette page.
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
                                Tu vas supprimer définitivement le dossier :
                                <span className="font-bold text-slate-900">
                                    {' '}
                                    {deleteItem.nom}
                                </span>
                            </p>

                            <p className="mt-3 text-sm leading-7 text-slate-500">
                                Référence :
                                <span className="font-semibold text-slate-700">
                                    {' '}
                                    {deleteItem.reference}
                                </span>
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

    if (lower.includes('brouillon')) {
        classes = 'bg-slate-100 text-slate-700';
    } else if (lower.includes('accès envoyé')) {
        classes = 'bg-blue-100 text-blue-700';
    } else if (lower.includes('formulaire rempli')) {
        classes = 'bg-cyan-100 text-cyan-700';
    } else if (lower.includes('experts affectés')) {
        classes = 'bg-violet-100 text-violet-700';
    } else if (lower.includes('date de visite planifiée')) {
        classes = 'bg-indigo-100 text-indigo-700';
    } else if (lower.includes('rapport')) {
        classes = 'bg-amber-100 text-amber-700';
    } else if (lower.includes('annexe')) {
        classes = 'bg-orange-100 text-orange-700';
    } else if (lower.includes('clôturé')) {
        classes = 'bg-emerald-100 text-emerald-700';
    }

    return (
        <span className={`inline-flex max-w-[150px] rounded-full px-3 py-1 text-[11px] font-black leading-4 ${classes}`}>
            {value}
        </span>
    );
}

function formatVisitDate(value) {
    if (!value) return 'Non définie';

    if (typeof value === 'string' && value.includes('T')) {
        const date = new Date(value);

        if (!Number.isNaN(date.getTime())) {
            return date.toLocaleDateString('fr-FR');
        }
    }

    if (typeof value === 'string' && value.includes(' ')) {
        return value.split(' ')[0];
    }

    return value;
}

DossiersIndex.layout = (page) => <DashboardShell>{page}</DashboardShell>;

export default DossiersIndex;