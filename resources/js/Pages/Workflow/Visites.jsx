import { Head, Link } from '@inertiajs/react';
import DashboardShell from '@/Layouts/DashboardShell';
import {
    Building2,
    CalendarDays,
    CheckCircle2,
    Eye,
    FileText,
    FolderKanban,
    MapPin,
    Search,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

function Visites({ dossiers = [] }) {
    const [search, setSearch] = useState('');

    const filteredDossiers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return dossiers;

        return dossiers.filter((item) =>
            [
                item.reference,
                item.nom,
                item.campagne,
                item.statut,
                item.date_visite_formatted,
                item.etablissement?.nom,
                item.etablissement?.ville,
                item.etablissement?.universite,
                item.etablissement?.email,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(query)
        );
    }, [search, dossiers]);

    const totalVisites = dossiers.length;

    const totalExperts = useMemo(() => {
        return dossiers.reduce((sum, item) => sum + (item.experts_count || 0), 0);
    }, [dossiers]);

    const totalDocuments = useMemo(() => {
        return dossiers.reduce((sum, item) => sum + (item.documents_count || 0), 0);
    }, [dossiers]);

    const prochainesVisites = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return dossiers.filter((item) => {
            if (!item.date_visite) return false;

            const date = new Date(item.date_visite);
            if (Number.isNaN(date.getTime())) return false;

            date.setHours(0, 0, 0, 0);
            return date >= today;
        }).length;
    }, [dossiers]);

    return (
        <>
            <Head title="Organisation des visites" />

            <div className="mx-auto max-w-[98rem] px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] bg-gradient-to-r from-[#243cbe] via-[#2f61e7] to-[#0ea5c6] px-8 py-10 text-white shadow-xl shadow-blue-900/10">
                    <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-100">
                        Organisation des visites
                    </p>

                    <h1 className="mt-3 text-4xl font-black tracking-tight">
                        Visites planifiées
                    </h1>

                    <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50/90">
                        Cette page affiche uniquement les dossiers dont le statut est
                        <span className="font-black"> Date de visite planifiée </span>
                        et qui possèdent une date de visite enregistrée.
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-4">
                        <StatCard
                            icon={CalendarDays}
                            label="Visites"
                            value={totalVisites}
                        />

                        <StatCard
                            icon={CheckCircle2}
                            label="À venir"
                            value={prochainesVisites}
                        />

                        <StatCard
                            icon={Users}
                            label="Experts"
                            value={totalExperts}
                        />

                        <StatCard
                            icon={FileText}
                            label="Documents"
                            value={totalDocuments}
                        />
                    </div>
                </div>

                <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
                                Liste principale
                            </p>
                            <h2 className="mt-2 text-2xl font-black text-slate-900">
                                Dossiers avec date de visite planifiée
                            </h2>
                            <p className="mt-1 text-sm font-medium text-slate-500">
                                Les dossiers sont triés par date de visite, du plus proche au plus éloigné.
                            </p>
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
                                placeholder="Rechercher par dossier, établissement, ville, vague..."
                                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
                            />
                        </div>
                    </div>

                    {filteredDossiers.length > 0 ? (
                        <div className="mt-7 grid gap-5">
                            {filteredDossiers.map((dossier) => (
                                <div
                                    key={dossier.id}
                                    className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    <div className="grid gap-6 xl:grid-cols-[1fr_260px]">
                                        <div>
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div>
                                                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
                                                        <CalendarDays size={14} />
                                                        Visite planifiée
                                                    </div>

                                                    <h3 className="mt-4 text-2xl font-black text-slate-900">
                                                        {dossier.nom || 'Dossier sans nom'}
                                                    </h3>

                                                    <p className="mt-1 text-sm font-bold text-slate-500">
                                                        {dossier.reference || '—'}
                                                    </p>
                                                </div>

                                                <div className="rounded-2xl bg-blue-50 px-5 py-4 text-blue-700">
                                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-400">
                                                        Date de visite
                                                    </p>
                                                    <p className="mt-2 text-2xl font-black">
                                                        {dossier.date_visite_formatted || 'Non définie'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                                <InfoBox
                                                    icon={Building2}
                                                    label="Établissement"
                                                    value={dossier.etablissement?.nom || '—'}
                                                />

                                                <InfoBox
                                                    icon={MapPin}
                                                    label="Ville"
                                                    value={dossier.etablissement?.ville || '—'}
                                                />

                                                <InfoBox
                                                    icon={FolderKanban}
                                                    label="Vague"
                                                    value={dossier.campagne || '—'}
                                                />
                                            </div>

                                            <div className="mt-4 grid gap-4 md:grid-cols-3">
                                                <MiniInfo
                                                    label="Université"
                                                    value={dossier.etablissement?.universite || '—'}
                                                />

                                                <MiniInfo
                                                    label="Experts affectés"
                                                    value={dossier.experts_count ?? 0}
                                                />

                                                <MiniInfo
                                                    label="Documents déposés"
                                                    value={dossier.documents_count ?? 0}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-between rounded-[1.5rem] bg-slate-50 p-5">
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                                                    Statut actuel
                                                </p>

                                                <div className="mt-3">
                                                    <StatusBadge value={dossier.statut} />
                                                </div>

                                                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                                    Date création
                                                </p>

                                                <p className="mt-2 text-sm font-bold text-slate-700">
                                                    {dossier.created_at || '—'}
                                                </p>
                                            </div>

                                            <Link
                                                href={`/dossiers/${dossier.id}`}
                                                className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700"
                                            >
                                                <Eye size={17} />
                                                Ouvrir le dossier
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-7 flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100 text-blue-600">
                                <CalendarDays size={32} />
                            </div>

                            <h3 className="mt-5 text-xl font-black text-slate-900">
                                Aucun dossier avec visite planifiée
                            </h3>

                            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
                                Pour afficher un dossier ici, ajoute une date de visite dans le détail
                                du dossier. Le statut passera automatiquement à
                                <span className="font-bold text-slate-700">
                                    {' '}Date de visite planifiée
                                </span>.
                            </p>

                            <Link
                                href="/dossiers"
                                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                            >
                                <FolderKanban size={17} />
                                Voir les dossiers
                            </Link>
                        </div>
                    )}
                </div>
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

            <p className="mt-2 text-4xl font-black">
                {value}
            </p>
        </div>
    );
}

function InfoBox({ icon: Icon, label, value }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-blue-600">
                <Icon size={18} />
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    {label}
                </p>
            </div>

            <p className="mt-3 text-sm font-black leading-6 text-slate-800">
                {value || '—'}
            </p>
        </div>
    );
}

function MiniInfo({ label, value }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                {label}
            </p>

            <p className="mt-2 text-sm font-bold text-slate-800">
                {value || '—'}
            </p>
        </div>
    );
}

function StatusBadge({ value }) {
    const label = value || '—';
    const lower = label.toLowerCase();

    let classes = 'bg-slate-100 text-slate-700';

    if (lower.includes('date de visite planifiée')) {
        classes = 'bg-indigo-100 text-indigo-700';
    } else if (lower.includes('experts affectés')) {
        classes = 'bg-violet-100 text-violet-700';
    } else if (lower.includes('formulaire')) {
        classes = 'bg-cyan-100 text-cyan-700';
    } else if (lower.includes('rapport')) {
        classes = 'bg-amber-100 text-amber-700';
    } else if (lower.includes('clôturé')) {
        classes = 'bg-emerald-100 text-emerald-700';
    }

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${classes}`}>
            {label}
        </span>
    );
}

Visites.layout = (page) => <DashboardShell>{page}</DashboardShell>;

export default Visites;