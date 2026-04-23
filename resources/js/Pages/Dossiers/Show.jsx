import { Head, Link, router, useForm } from '@inertiajs/react';
import DashboardShell from '@/Layouts/DashboardShell';

function badgeClass(status) {
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

export default function Show({
    dossier,
    availableExperts = [],
    statusOptions = [],
    documentTypes = [],
}) {
    const dossierForm = useForm({
        statut: dossier.statut || '',
        description: dossier.description || '',
        observation: dossier.observation || '',
    });

    const expertForm = useForm({
        expert_id: '',
        role: '',
        statut_participation: 'proposé',
    });

    const documentForm = useForm({
        type_document: documentTypes[0] || 'rapport_autoevaluation',
        observation: '',
        file: null,
    });

    return (
        <>
            <Head title={`Dossier ${dossier.reference}`} />

            <DashboardShell
                title={dossier.nom}
                subtitle="Détail du dossier"
                action={
                    <div className="flex items-center gap-3">
                        {dossier.campagne_id && (
                            <Link
                                href={`/campagnes/${dossier.campagne_id}`}
                                className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200"
                            >
                                Voir la vague
                            </Link>
                        )}
                        <Link
                            href="/dossiers"
                            className="rounded-xl bg-[#223270] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b285a]"
                        >
                            Retour à la liste
                        </Link>
                        <button
                            type="button"
                            onClick={() => {
                                if (confirm('Voulez-vous supprimer ce dossier ?')) {
                                    router.delete(`/dossiers/${dossier.id}`);
                                }
                            }}
                            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                        >
                            Supprimer le dossier
                        </button>
                    </div>
                }
            >
                <div className="grid gap-6 xl:grid-cols-3">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                        <h2 className="mb-5 text-lg font-black text-slate-900">Pilotage du dossier</h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                dossierForm.patch(`/dossiers/${dossier.id}`);
                            }}
                            className="grid gap-4 md:grid-cols-2"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">Statut</label>
                                <select
                                    value={dossierForm.data.statut}
                                    onChange={(e) => dossierForm.setData('statut', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                                    Référence
                                </p>
                                <p className="mt-2 font-semibold text-slate-800">{dossier.reference}</p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-bold text-slate-700">Description</label>
                                <textarea
                                    rows={4}
                                    value={dossierForm.data.description}
                                    onChange={(e) => dossierForm.setData('description', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-bold text-slate-700">Observation</label>
                                <textarea
                                    rows={3}
                                    value={dossierForm.data.observation}
                                    onChange={(e) => dossierForm.setData('observation', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                                />
                            </div>

                            <div className="md:col-span-2 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${badgeClass(dossier.statut)}`}>
                                    {dossier.statut}
                                </span>
                                <button
                                    type="submit"
                                    disabled={dossierForm.processing}
                                    className="rounded-xl bg-[#223270] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b285a] disabled:opacity-60"
                                >
                                    Mettre à jour
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-black text-slate-900">Établissement</h2>
                        <div className="space-y-3 text-sm text-slate-700">
                            <p><strong>Nom :</strong> {dossier.etablissement?.nom || '—'}</p>
                            <p><strong>Ville :</strong> {dossier.etablissement?.ville || '—'}</p>
                            <p><strong>Université :</strong> {dossier.etablissement?.universite || '—'}</p>
                            <p><strong>Email :</strong> {dossier.etablissement?.email || '—'}</p>
                            <p><strong>Créé par :</strong> {dossier.creator || '—'}</p>
                            <p><strong>Mise à jour :</strong> {dossier.updated_at || '—'}</p>
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-black text-slate-900">Formulaire établissement</h2>
                            <Link
                                href="/etablissement/premier-formulaire"
                                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
                            >
                                Ouvrir le formulaire
                            </Link>
                        </div>

                        {dossier.etablissement?.onboarding ? (
                            <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-700">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p><strong>Adresse :</strong> {dossier.etablissement.onboarding.adresse}</p>
                                    <p className="mt-2"><strong>Site web :</strong> {dossier.etablissement.onboarding.site_web || '—'}</p>
                                    <p className="mt-2"><strong>Téléphone :</strong> {dossier.etablissement.onboarding.telephone}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p><strong>Responsable :</strong> {dossier.etablissement.onboarding.responsable_nom}</p>
                                    <p className="mt-2"><strong>Fonction :</strong> {dossier.etablissement.onboarding.responsable_fonction}</p>
                                    <p className="mt-2"><strong>Email :</strong> {dossier.etablissement.onboarding.responsable_email}</p>
                                    <p className="mt-2"><strong>Téléphone :</strong> {dossier.etablissement.onboarding.responsable_telephone}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">Le premier formulaire n’a pas encore été complété.</p>
                        )}
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                        <h2 className="mb-5 text-lg font-black text-slate-900">Affectation des experts</h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                expertForm.post(`/dossiers/${dossier.id}/experts`, {
                                    onSuccess: () => expertForm.reset('expert_id', 'role'),
                                });
                            }}
                            className="grid gap-4 md:grid-cols-3"
                        >
                            <select
                                value={expertForm.data.expert_id}
                                onChange={(e) => expertForm.setData('expert_id', e.target.value)}
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                            >
                                <option value="">Choisir un expert</option>
                                {availableExperts.map((expert) => (
                                    <option key={expert.id} value={expert.id}>
                                        {`${expert.prenom || ''} ${expert.nom || ''}`.trim()}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                value={expertForm.data.role}
                                onChange={(e) => expertForm.setData('role', e.target.value)}
                                placeholder="Rôle dans le dossier"
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                            />

                            <button
                                type="submit"
                                disabled={expertForm.processing}
                                className="rounded-xl bg-[#223270] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b285a] disabled:opacity-60"
                            >
                                Affecter
                            </button>
                        </form>

                        <div className="mt-6 space-y-3">
                            {dossier.experts.map((expert) => (
                                <div
                                    key={expert.id}
                                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-800">{expert.nom}</p>
                                        <p className="text-sm text-slate-500">{expert.specialite || expert.email}</p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {expert.pivot?.role || 'Sans rôle'} · {expert.pivot?.statut_participation || 'proposé'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => router.delete(`/dossiers/${dossier.id}/experts/${expert.id}`)}
                                        className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                                    >
                                        Retirer
                                    </button>
                                </div>
                            ))}

                            {dossier.experts.length === 0 && (
                                <p className="text-sm text-slate-500">Aucun expert n’est encore affecté à ce dossier.</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-black text-slate-900">Documents</h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                documentForm.post(`/dossiers/${dossier.id}/documents`, {
                                    forceFormData: true,
                                    onSuccess: () => documentForm.reset('observation', 'file'),
                                });
                            }}
                            className="space-y-3"
                        >
                            <select
                                value={documentForm.data.type_document}
                                onChange={(e) => documentForm.setData('type_document', e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                            >
                                {documentTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>

                            <textarea
                                rows={3}
                                value={documentForm.data.observation}
                                onChange={(e) => documentForm.setData('observation', e.target.value)}
                                placeholder="Observation sur le dépôt"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                            />

                            <input
                                type="file"
                                onChange={(e) => documentForm.setData('file', e.target.files[0])}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                            />

                            <button
                                type="submit"
                                disabled={documentForm.processing}
                                className="w-full rounded-xl bg-[#223270] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b285a] disabled:opacity-60"
                            >
                                Déposer le document
                            </button>
                        </form>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3">
                        <h2 className="mb-5 text-lg font-black text-slate-900">Documents déposés</h2>
                        <div className="space-y-3">
                            {dossier.documents.map((document) => (
                                <div
                                    key={document.id}
                                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-800">{document.original_name}</p>
                                        <p className="text-sm text-slate-500">
                                            {document.type_document} · {document.created_at} · {document.uploaded_by || 'Utilisateur'}
                                        </p>
                                        {document.observation && (
                                            <p className="mt-1 text-sm text-slate-600">{document.observation}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <a
                                            href={document.download_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                                        >
                                            Ouvrir
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => router.delete(`/dossiers/${dossier.id}/documents/${document.id}`)}
                                            className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {dossier.documents.length === 0 && (
                                <p className="text-sm text-slate-500">Aucun document n’a encore été déposé.</p>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardShell>
        </>
    );
}
