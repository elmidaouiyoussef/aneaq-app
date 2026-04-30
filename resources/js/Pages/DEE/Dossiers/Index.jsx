import { Head, Link, useForm } from '@inertiajs/react';
import DashboardShell from '@/Layouts/DashboardShell';
import {
    CalendarDays,
    Eye,
    FileText,
    FolderKanban,
   
    LockKeyhole,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

function DossiersIndex({ dossiers = [] }) {
    const [search, setSearch] = useState('');
    const [selectedDossier, setSelectedDossier] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const deleteForm = useForm({
        delete_password: '',
    });

    const getText = (value) => {
        if (value === null || value === undefined || value === '') {
            return '—';
        }

        if (typeof value === 'string' || typeof value === 'number') {
            return String(value);
        }

        if (typeof value === 'object') {
            return (
                value.nom ??
                value.etablissement_2 ??
                value.etablissement ??
                value.name ??
                value.reference ??
                value.ville ??
                '—'
            );
        }

        return String(value);
    };

    const getEtablissementName = (dossier) => {
        return getText(
            dossier.etablissement?.nom ??
                dossier.etablissement_nom ??
                dossier.nom_etablissement ??
                dossier.etablissement
        );
    };

    const getVille = (dossier) => {
        return getText(
            dossier.etablissement?.ville ??
                dossier.ville ??
                dossier.etablissement_ville
        );
    };

    const getCampagne = (dossier) => {
        return getText(
            dossier.campagne?.reference ??
                dossier.campagne_reference ??
                dossier.campagne
        );
    };

    const getRawDateVisite = (dossier) => {
        return (
            dossier.date_visite_value ??
            dossier.date_visite ??
            dossier.date_visite_planifiee ??
            dossier.visite?.date_visite ??
            ''
        );
    };

    const hasDateVisite = (dossier) => {
        const value = getRawDateVisite(dossier);

        if (value === null || value === undefined) {
            return false;
        }

        const text = String(value).trim().toLowerCase();

        if (!text) {
            return false;
        }

        return ![
            '—',
            '-',
            'null',
            'undefined',
            'non définie',
            'non definie',
            'non planifiée',
            'non planifiee',
        ].includes(text);
    };

    const formatDateVisite = (dossier) => {
        const value = getRawDateVisite(dossier);

        if (!hasDateVisite(dossier)) {
            return '—';
        }

        const text = String(value);

        if (text.includes('/')) {
            return text;
        }

        const date = new Date(text);

        if (Number.isNaN(date.getTime())) {
            return text;
        }

        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatStatus = (status) => {
        const labels = {
            etablissement_selectionne: 'Établissement sélectionné',
            compte_etablissement_cree: 'Compte établissement créé',
            en_attente_formulaire: 'En attente formulaire',
            formulaire_rempli: 'Formulaire rempli',
            rapport_autoevaluation_ajoute: "Rapport d’autoévaluation ajouté",
            annexe_ajoutee: 'Annexe ajoutée',
            rapport_expert_ajoute: 'Rapport expert ajouté',
            date_visite_planifiee: 'Date de visite planifiée',
        };

        return labels[status] || status || '—';
    };

    const filteredDossiers = useMemo(() => {
        const value = search.toLowerCase().trim();

        if (!value) {
            return dossiers;
        }

        return dossiers.filter((dossier) => {
            const searchableText = [
                dossier.reference,
                getEtablissementName(dossier),
                getVille(dossier),
                getCampagne(dossier),
                formatStatus(dossier.statut),
                formatDateVisite(dossier),
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return searchableText.includes(value);
        });
    }, [dossiers, search]);

    const openDeleteModal = (dossier) => {
        setSelectedDossier(dossier);
        deleteForm.setData('delete_password', '');
        deleteForm.clearErrors();
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setSelectedDossier(null);
        setShowDeleteModal(false);
        deleteForm.reset();
        deleteForm.clearErrors();
    };

    const submitDelete = (e) => {
        e.preventDefault();

        deleteForm.clearErrors();

        if (!selectedDossier) {
            deleteForm.setError('delete_password', 'Aucun dossier sélectionné.');
            return;
        }

        if (!deleteForm.data.delete_password.trim()) {
            deleteForm.setError('delete_password', 'Le mot de passe est obligatoire.');
            return;
        }

        deleteForm.delete(`/dee/dossiers/${selectedDossier.id}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                closeDeleteModal();
            },
            onError: (errors) => {
                deleteForm.setError(
                    'delete_password',
                    errors.delete_password || 'Mot de passe incorrect.'
                );
            },
        });
    };

    return (
        <>
            <Head title="Dossiers" />

            <div className="min-h-screen bg-[#f6f8fc] px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-600">
                                Gestion des dossiers
                            </p>

                            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                                Liste des dossiers
                            </h1>

                            <p className="mt-3 text-sm font-medium text-slate-500">
                                Consultez les dossiers créés automatiquement après confirmation des établissements.
                            </p>
                        </div>

                       
                    </div>

                    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col justify-between gap-5 border-b border-slate-100 p-6 lg:flex-row lg:items-center">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <FolderKanban size={26} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-black text-slate-950">
                                        Dossiers enregistrés
                                    </h2>

                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        Total : {filteredDossiers.length}
                                    </p>
                                </div>
                            </div>

                            <div className="relative w-full lg:w-[26rem]">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Rechercher par dossier, établissement, statut..."
                                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        {filteredDossiers.length === 0 ? (
                            <div className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
                                <FolderKanban size={44} className="text-blue-600" />

                                <h3 className="mt-4 text-xl font-black text-slate-950">
                                    Aucun dossier trouvé
                                </h3>

                                <p className="mt-2 text-sm font-medium text-slate-500">
                                    Aucun dossier ne correspond à votre recherche.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1050px] text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                                            <th className="px-6 py-5">Référence</th>
                                            <th className="px-6 py-5">Établissement</th>
                                            <th className="px-6 py-5">Campagne</th>
                                            <th className="px-6 py-5">Statut</th>
                                            <th className="px-6 py-5">Date visite</th>
                                            <th className="px-6 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredDossiers.map((dossier) => (
                                            <tr
                                                key={dossier.id}
                                                className="border-b border-slate-100 transition hover:bg-blue-50/40"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="font-black text-slate-950">
                                                        {dossier.reference || '—'}
                                                    </div>

                                                    <div className="mt-1 text-xs font-semibold text-slate-400">
                                                        ID : {dossier.id}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="font-black text-slate-700">
                                                        {getEtablissementName(dossier)}
                                                    </div>

                                                    <div className="mt-1 text-xs font-semibold text-slate-400">
                                                        {getVille(dossier)}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5 text-sm font-black text-slate-600">
                                                    {getCampagne(dossier)}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
                                                        {formatStatus(dossier.statut)}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="inline-flex items-center gap-2 text-sm font-black text-slate-600">
                                                        <CalendarDays size={16} className="text-slate-400" />
                                                        {formatDateVisite(dossier)}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/dee/dossiers/${dossier.id}`}
                                                            className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-black text-white transition hover:bg-blue-700"
                                                        >
                                                            <Eye size={15} />
                                                            Voir
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => openDeleteModal(dossier)}
                                                            className="inline-flex h-11 items-center gap-2 rounded-xl bg-red-50 px-4 text-xs font-black text-red-600 transition hover:bg-red-600 hover:text-white"
                                                        >
                                                            <Trash2 size={15} />
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {showDeleteModal && selectedDossier && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-xl rounded-[2rem] bg-white shadow-2xl">
                        <div className="flex items-start justify-between border-b border-slate-100 p-6">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-600">
                                    Suppression sécurisée
                                </p>

                                <h3 className="mt-2 text-2xl font-black text-slate-950">
                                    Confirmer la suppression
                                </h3>

                                <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                                    Pour supprimer le dossier{' '}
                                    <strong>
                                        {selectedDossier.reference || `#${selectedDossier.id}`}
                                    </strong>
                                    , saisissez le mot de passe unique administrateur DEE.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={submitDelete} className="p-6">
                            <label className="mb-2 block text-sm font-black text-slate-700">
                                Mot de passe DEE
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
                                />

                                <input
                                    type="password"
                                    value={deleteForm.data.delete_password}
                                    onChange={(e) => {
                                        deleteForm.setData('delete_password', e.target.value);
                                        deleteForm.clearErrors('delete_password');
                                    }}
                                    placeholder="Mot de passe de confirmation"
                                    className={`h-14 w-full rounded-2xl border bg-slate-50 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none transition focus:bg-white focus:ring-4 ${
                                        deleteForm.errors.delete_password
                                            ? 'border-red-500 focus:ring-red-100'
                                            : 'border-slate-200 focus:border-red-500 focus:ring-red-100'
                                    }`}
                                />
                            </div>

                            {deleteForm.errors.delete_password && (
                                <p className="mt-2 text-sm font-bold text-red-600">
                                    {deleteForm.errors.delete_password}
                                </p>
                            )}

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeDeleteModal}
                                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    disabled={deleteForm.processing}
                                    className="inline-flex h-12 items-center gap-2 rounded-2xl bg-red-600 px-5 text-sm font-black text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Trash2 size={18} />
                                    {deleteForm.processing ? 'Suppression...' : 'Supprimer définitivement'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

DossiersIndex.layout = (page) => <DashboardShell>{page}</DashboardShell>;

export default DossiersIndex;