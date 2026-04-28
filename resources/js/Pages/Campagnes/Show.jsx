import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import DashboardShell from '@/Layouts/DashboardShell';
import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Edit3,
    Eye,
    FileText,
    FolderKanban,
    Mail,
    MapPin,
    Plus,
    Save,
    Search,
    Send,
    Settings2,
    Trash2,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

function CampagneShow({
    campagne,
    stats = {},
    etablissements = [],
    availableEtablissements = [],
}) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [search, setSearch] = useState('');

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState(null);

    const [refuseModalOpen, setRefuseModalOpen] = useState(false);
    const [refuseTarget, setRefuseTarget] = useState(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const infoForm = useForm({
        annee: campagne.annee || '',
        vocation: campagne.vocation || '',
        observation: campagne.observation || '',
    });

    const statusForm = useForm({
        statut: campagne.statut || 'brouillon',
    });

    const attachForm = useForm({
        etablissement_id: '',
    });

    const confirmForm = useForm({
        email: '',
        lettre_dee: null,
    });

    const refuseForm = useForm({});

    const deleteForm = useForm({});

    const filteredAvailableEtablissements = useMemo(() => {
        const value = search.toLowerCase().trim();

        if (!value) {
            return availableEtablissements;
        }

        return availableEtablissements.filter((item) => {
            return [
                item.nom,
                item.type,
                item.ville,
                item.universite,
                item.email,
            ]
                .join(' ')
                .toLowerCase()
                .includes(value);
        });
    }, [search, availableEtablissements]);

    const submitInfo = (e) => {
        e.preventDefault();

        infoForm.patch(`/campagnes/${campagne.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditingInfo(false);
            },
        });
    };

    const submitStatus = (e) => {
        e.preventDefault();

        statusForm.patch(`/campagnes/${campagne.id}`, {
            preserveScroll: true,
        });
    };

    const attachEtablissement = (etablissementId) => {
        attachForm.setData('etablissement_id', etablissementId);

        router.post(
            `/campagnes/${campagne.id}/etablissements/attach`,
            {
                etablissement_id: etablissementId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setAddModalOpen(false);
                    setSearch('');
                    attachForm.reset();
                },
            }
        );
    };

    const openConfirmModal = (item) => {
        setConfirmTarget(item);

        confirmForm.setData('email', item.email || item.etablissement?.email || '');
        confirmForm.setData('lettre_dee', null);
        confirmForm.clearErrors();

        setConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setConfirmModalOpen(false);
        setConfirmTarget(null);
        confirmForm.reset();
        confirmForm.clearErrors();
    };

    const submitConfirm = (e) => {
        e.preventDefault();

        if (!confirmTarget) {
            return;
        }

        confirmForm.post(
            `/campagnes/${campagne.id}/etablissements/${confirmTarget.id}/confirm`,
            {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    closeConfirmModal();
                },
            }
        );
    };

    const openRefuseModal = (item) => {
        setRefuseTarget(item);
        setRefuseModalOpen(true);
    };

    const closeRefuseModal = () => {
        setRefuseTarget(null);
        setRefuseModalOpen(false);
    };

    const submitRefuse = () => {
        if (!refuseTarget) {
            return;
        }

        refuseForm.delete(
            `/campagnes/${campagne.id}/etablissements/${refuseTarget.id}/refuse`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeRefuseModal();
                },
            }
        );
    };

    const submitDeleteCampagne = () => {
        deleteForm.delete(`/campagnes/${campagne.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModalOpen(false);
            },
        });
    };

    return (
        <>
            <Head title={`Vague ${campagne.reference}`} />

            <div className="mx-auto max-w-[98rem] px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
                            Détail de la vague
                        </p>

                        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                            {campagne.reference}
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/campagnes"
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                            <ArrowLeft size={17} />
                            Retour aux vagues
                        </Link>

                        <button
                            type="button"
                            onClick={() => setAddModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <Plus size={17} />
                            Ajouter des établissements
                        </button>

                        <button
                            type="button"
                            onClick={() => setDeleteModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-700"
                        >
                            <Trash2 size={17} />
                            Supprimer la vague
                        </button>
                    </div>
                </div>

                {flash.success && (
                    <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
                        {flash.success}
                    </div>
                )}

                {flash.error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                        {flash.error}
                    </div>
                )}

                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#3730c9] via-[#2563eb] to-[#0891b2] text-white shadow-xl shadow-blue-900/10">
                    <div className="grid gap-8 p-8 lg:grid-cols-[1.35fr_0.65fr] lg:p-10">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-100">
                                Vague d’évaluation
                            </p>

                            <h2 className="mt-3 text-4xl font-black tracking-tight">
                                {campagne.reference}
                            </h2>

                            <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50/90">
                                Cette page permet de piloter la vague, suivre les établissements rattachés,
                                confirmer les accès, consulter les dossiers et contrôler l’avancement global.
                            </p>

                            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                <HeroInfo label="Année" value={campagne.annee} />
                                <HeroInfo label="Statut" value={formatStatusLabel(campagne.statut)} />
                                <HeroInfo label="Créée par" value={campagne.created_by} />
                                <HeroInfo label="Mise à jour" value={campagne.updated_at} />
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] bg-white/10 p-6 backdrop-blur">
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-100">
                                Observation
                            </p>

                            <p className="mt-4 min-h-[7rem] whitespace-pre-line text-sm leading-7 text-white/95">
                                {campagne.observation || 'Aucune observation saisie pour cette vague.'}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        icon={Building2}
                        label="Établissements"
                        value={stats.etablissements ?? 0}
                        description="Rattachés à la vague"
                        accent="bg-blue-600"
                    />

                    <StatCard
                        icon={Send}
                        label="Accès envoyés"
                        value={stats.acces_envoyes ?? 0}
                        description="Comptes transmis"
                        accent="bg-emerald-500"
                    />

                    <StatCard
                        icon={FolderKanban}
                        label="Dossiers"
                        value={stats.dossiers ?? 0}
                        description="Dossiers créés"
                        accent="bg-orange-500"
                    />

                    <StatCard
                        icon={CheckCircle2}
                        label="Formulaires"
                        value={stats.formulaires ?? 0}
                        description="Formulaires complétés"
                        accent="bg-pink-500"
                    />
                </section>

                <section className="mt-7 grid gap-7 xl:grid-cols-[1.4fr_0.7fr]">
                    <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-7 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <ClipboardList size={24} />
                                </div>

                                <div>
                                    <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
                                        Informations générales
                                    </p>

                                    <h3 className="mt-1 text-2xl font-black text-slate-900">
                                        Données principales
                                    </h3>

                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        Cliquez sur le crayon pour modifier les informations de la vague.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsEditingInfo((value) => !value)}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                            >
                                <Edit3 size={17} />
                                {isEditingInfo ? 'Annuler' : 'Modifier'}
                            </button>
                        </div>

                        <form onSubmit={submitInfo} className="p-7">
                            <div className="grid gap-5 md:grid-cols-2">
                                <InputBlock
                                    label="Référence"
                                    value={campagne.reference}
                                    disabled
                                />

                                <InputBlock
                                    label="Année"
                                    value={infoForm.data.annee}
                                    onChange={(e) => infoForm.setData('annee', e.target.value)}
                                    disabled={!isEditingInfo}
                                    error={infoForm.errors.annee}
                                />

                                <InputBlock
                                    label="Vocation"
                                    value={infoForm.data.vocation}
                                    onChange={(e) => infoForm.setData('vocation', e.target.value)}
                                    disabled={!isEditingInfo}
                                    error={infoForm.errors.vocation}
                                />

                                <InputBlock
                                    label="Créée par"
                                    value={campagne.created_by}
                                    disabled
                                />

                                <InputBlock
                                    label="Date de création"
                                    value={campagne.created_at}
                                    disabled
                                />

                                <InputBlock
                                    label="Dernière mise à jour"
                                    value={campagne.updated_at}
                                    disabled
                                />

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                                        Observation
                                    </label>

                                    <textarea
                                        value={infoForm.data.observation}
                                        onChange={(e) => infoForm.setData('observation', e.target.value)}
                                        disabled={!isEditingInfo}
                                        rows="5"
                                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:text-slate-500"
                                    />

                                    {infoForm.errors.observation && (
                                        <p className="mt-2 text-sm font-semibold text-red-600">
                                            {infoForm.errors.observation}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {isEditingInfo && (
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={infoForm.processing}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
                                    >
                                        <Save size={17} />
                                        {infoForm.processing
                                            ? 'Enregistrement...'
                                            : 'Enregistrer les informations'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                                <Settings2 size={24} />
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-slate-900">
                                    Pilotage
                                </h3>

                                <p className="mt-1 text-sm font-medium text-slate-500">
                                    Le statut ne change qu’après clic sur enregistrer.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submitStatus} className="mt-7 space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Statut
                                </label>

                                <select
                                    value={statusForm.data.statut}
                                    onChange={(e) => statusForm.setData('statut', e.target.value)}
                                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-500"
                                >
                                    <option value="brouillon">Brouillon</option>
                                    <option value="active">Active</option>
                                    <option value="cloturee">Clôturée</option>
                                </select>

                                {statusForm.errors.statut && (
                                    <p className="mt-2 text-sm font-semibold text-red-600">
                                        {statusForm.errors.statut}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={statusForm.processing}
                                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={18} />
                                {statusForm.processing ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </form>
                    </div>
                </section>

                <section className="mt-7 rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-7 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
                                Établissements rattachés
                            </p>

                            <h3 className="mt-2 text-2xl font-black text-slate-900">
                                Liste des établissements de la vague
                            </h3>

                            <p className="mt-1 text-sm font-medium text-slate-500">
                                Chaque établissement ajouté reste en attente jusqu’à confirmation DEE.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setAddModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                        >
                            <Plus size={17} />
                            Ajouter des établissements
                        </button>
                    </div>

                    {etablissements.length > 0 ? (
                        <div className="grid gap-4 p-7 md:grid-cols-2 xl:grid-cols-3">
                            {etablissements.map((item) => (
                                <EtablissementCard
                                    key={item.id}
                                    item={item}
                                    onAccept={() => openConfirmModal(item)}
                                    onRefuse={() => openRefuseModal(item)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                                <Building2 size={30} />
                            </div>

                            <h4 className="mt-5 text-xl font-black text-slate-900">
                                Aucun établissement rattaché
                            </h4>

                            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
                                Ajoute des établissements à cette vague pour commencer le processus
                                d’évaluation.
                            </p>

                            <button
                                type="button"
                                onClick={() => setAddModalOpen(true)}
                                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                            >
                                <Plus size={17} />
                                Ajouter des établissements
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {addModalOpen && (
                <Modal onClose={() => setAddModalOpen(false)} title="Ajouter un établissement">
                    <div className="space-y-5">
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher par nom, ville, université..."
                                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-500"
                            />
                        </div>

                        <div className="max-h-[430px] space-y-3 overflow-y-auto pr-1">
                            {filteredAvailableEtablissements.length > 0 ? (
                                filteredAvailableEtablissements.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                                <Building2 size={22} />
                                            </div>

                                            <div>
                                                <h4 className="font-black text-slate-900">
                                                    {item.nom}
                                                </h4>

                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    <Badge>{item.type}</Badge>
                                                    <Badge>
                                                        <MapPin size={12} />
                                                        {item.ville}
                                                    </Badge>
                                                </div>

                                                <p className="mt-2 text-sm font-semibold text-slate-500">
                                                    {item.universite}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={attachForm.processing}
                                            onClick={() => attachEtablissement(item.id)}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            <Plus size={16} />
                                            Ajouter
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                                    <Search size={34} className="mx-auto text-blue-600" />

                                    <h4 className="mt-4 text-lg font-black text-slate-900">
                                        Aucun établissement trouvé
                                    </h4>

                                    <p className="mt-2 text-sm font-semibold text-slate-500">
                                        Aucun résultat ne correspond à votre recherche.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>
            )}

            {confirmModalOpen && (
                <Modal onClose={closeConfirmModal} title="Confirmer et créer le compte">
                    <form
                        onSubmit={submitConfirm}
                        encType="multipart/form-data"
                        className="space-y-5"
                    >
                        <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                                Établissement
                            </p>

                            <p className="mt-3 text-base font-black text-slate-900">
                                {confirmTarget?.etablissement?.nom || '—'}
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-500">
                                {confirmTarget?.etablissement?.universite || '—'}
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-black text-slate-700">
                                Email de l’établissement
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                                />

                                <input
                                    type="email"
                                    value={confirmForm.data.email}
                                    onChange={(e) =>
                                        confirmForm.setData('email', e.target.value)
                                    }
                                    placeholder="email@exemple.com"
                                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-500"
                                />
                            </div>

                            {confirmForm.errors.email && (
                                <p className="mt-2 text-sm font-semibold text-red-600">
                                    {confirmForm.errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-black text-slate-700">
                                Lettre DEE à envoyer
                            </label>

                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) =>
                                    confirmForm.setData('lettre_dee', e.target.files[0])
                                }
                                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-slate-700 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-black file:text-white hover:file:bg-blue-700 focus:border-blue-500"
                            />

                            <p className="mt-2 text-xs font-semibold text-slate-500">
                                Formats acceptés : PDF, DOC, DOCX, JPG, PNG.
                            </p>

                            {confirmForm.errors.lettre_dee && (
                                <p className="mt-2 text-sm font-semibold text-red-600">
                                    {confirmForm.errors.lettre_dee}
                                </p>
                            )}
                        </div>

                        {confirmForm.progress && (
                            <div className="rounded-2xl bg-blue-50 p-4">
                                <div className="h-2 overflow-hidden rounded-full bg-blue-100">
                                    <div
                                        className="h-full rounded-full bg-blue-600 transition-all"
                                        style={{
                                            width: `${confirmForm.progress.percentage}%`,
                                        }}
                                    />
                                </div>

                                <p className="mt-2 text-xs font-black text-blue-700">
                                    Upload : {confirmForm.progress.percentage}%
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeConfirmModal}
                                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                disabled={confirmForm.processing}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Send size={18} />
                                {confirmForm.processing
                                    ? 'Envoi en cours...'
                                    : 'Envoyer et créer le compte'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {refuseModalOpen && (
                <Modal onClose={closeRefuseModal} title="Refuser l’établissement">
                    <div className="space-y-5">
                        <div className="rounded-2xl bg-red-50 p-5">
                            <p className="text-sm font-bold leading-7 text-red-700">
                                Voulez-vous vraiment refuser cet établissement ?
                                Il sera supprimé de la vague.
                            </p>

                            <p className="mt-3 text-base font-black text-red-900">
                                {refuseTarget?.etablissement?.nom || '—'}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeRefuseModal}
                                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                disabled={refuseForm.processing}
                                onClick={submitRefuse}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:opacity-60"
                            >
                                <Trash2 size={18} />
                                {refuseForm.processing ? 'Suppression...' : 'Confirmer le refus'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {deleteModalOpen && (
                <Modal onClose={() => setDeleteModalOpen(false)} title="Supprimer la vague">
                    <div className="space-y-5">
                        <div className="rounded-2xl bg-red-50 p-5">
                            <p className="text-sm font-bold leading-7 text-red-700">
                                Cette action va supprimer la vague et ses rattachements.
                                Confirmez-vous la suppression ?
                            </p>

                            <p className="mt-3 text-base font-black text-red-900">
                                {campagne.reference}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteModalOpen(false)}
                                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                disabled={deleteForm.processing}
                                onClick={submitDeleteCampagne}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:opacity-60"
                            >
                                <Trash2 size={18} />
                                {deleteForm.processing ? 'Suppression...' : 'Supprimer définitivement'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}

function HeroInfo({ label, value }) {
    return (
        <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-100">
                {label}
            </p>

            <p className="mt-2 text-sm font-black text-white">
                {value || '—'}
            </p>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, description, accent }) {
    return (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className={`h-1.5 w-16 rounded-full ${accent}`} />

            <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-blue-600">
                <Icon size={25} />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                {label}
            </p>

            <p className="mt-2 text-4xl font-black text-slate-900">
                {value}
            </p>

            <p className="mt-2 text-sm font-medium text-slate-500">
                {description}
            </p>
        </div>
    );
}

function InputBlock({ label, value, onChange, disabled = false, error = null }) {
    return (
        <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                {label}
            </label>

            <input
                value={value || ''}
                onChange={onChange}
                disabled={disabled}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:text-slate-500"
            />

            {error && (
                <p className="mt-2 text-sm font-semibold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function EtablissementCard({ item, onAccept, onRefuse }) {
    const status = item.statut || 'en_attente_confirmation_dee';
    const isPending = status === 'en_attente_confirmation_dee';
    const isAccessSent = status === 'acces_envoye';

    return (
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h4 className="text-base font-black text-slate-900">
                        {item.etablissement?.nom || '—'}
                    </h4>

                    <p className="mt-1 text-sm font-semibold text-slate-500">
                        {item.etablissement?.universite || '—'}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onRefuse}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition hover:bg-red-100"
                >
                    <Trash2 size={17} />
                </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <Badge>
                    <MapPin size={12} />
                    {item.etablissement?.ville || '—'}
                </Badge>

                <StatusBadge value={status} />
            </div>

            <div className="mt-4">
                <p className="mb-2 text-sm font-black text-slate-700">
                    Email de l’établissement
                </p>

                <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700">
                    <Mail size={16} className="text-blue-500" />
                    {item.email || item.etablissement?.email || 'Non renseigné'}
                </div>
            </div>

            {isPending && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={onRefuse}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-black text-white transition hover:bg-red-600"
                    >
                        <Trash2 size={16} />
                        Refuser
                    </button>

                    <button
                        type="button"
                        onClick={onAccept}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
                    >
                        <Send size={16} />
                        Accepter
                    </button>
                </div>
            )}

            {isAccessSent && item.dossier && (
                <Link
                    href={`/dossiers/${item.dossier.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                >
                    <Eye size={16} />
                    Voir le dossier
                </Link>
            )}

            {isAccessSent && !item.dossier && (
                <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
                    Accès envoyé
                </div>
            )}
        </div>
    );
}

function StatusBadge({ value }) {
    const labels = {
        en_attente_confirmation_dee: 'En attente confirmation DEE',
        acces_envoye: 'Accès envoyé',
        selectionne: 'Sélectionné',
        refuse: 'Refusé',
    };

    const label = labels[value] || value || '—';

    let classes = 'bg-slate-100 text-slate-700';

    if (value === 'en_attente_confirmation_dee') {
        classes = 'bg-amber-100 text-amber-700';
    }

    if (value === 'acces_envoye') {
        classes = 'bg-emerald-100 text-emerald-700';
    }

    if (value === 'refuse') {
        classes = 'bg-red-100 text-red-700';
    }

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black ${classes}`}>
            {label}
        </span>
    );
}

function Badge({ children }) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
            {children}
        </span>
    );
}

function Modal({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <h3 className="text-xl font-black text-slate-900">
                        {title}
                    </h3>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

function formatStatusLabel(value) {
    const labels = {
        brouillon: 'Brouillon',
        active: 'Active',
        cloturee: 'Clôturée',
    };

    return labels[value] || value || '—';
}

CampagneShow.layout = (page) => <DashboardShell>{page}</DashboardShell>;

export default CampagneShow;