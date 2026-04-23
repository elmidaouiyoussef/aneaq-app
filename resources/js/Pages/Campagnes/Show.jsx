import { Head, Link, router, useForm } from '@inertiajs/react';
import DashboardShell from '@/Layouts/DashboardShell';

function StatCard({ label, value }) {
    return (
        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
        </div>
    );
}

export default function Show({ campagne }) {
    const form = useForm({
        statut: campagne.statut,
        observation: campagne.observation || '',
    });

    return (
        <>
            <Head title={campagne.reference} />

            <DashboardShell
                title={campagne.reference}
                subtitle="Détail de la vague"
                action={
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/campagnes/${campagne.id}/etablissements`}
                            className="rounded-xl bg-[#223270] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b285a]"
                        >
                            Gérer les établissements
                        </Link>
                        <Link
                            href="/campagnes"
                            className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200"
                        >
                            Retour
                        </Link>
                        <button
                            type="button"
                            onClick={() => {
                                if (confirm('Voulez-vous supprimer cette vague et ses dossiers liés ?')) {
                                    router.delete(`/campagnes/${campagne.id}`);
                                }
                            }}
                            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                        >
                            Supprimer la vague
                        </button>
                    </div>
                }
            >
                <div className="grid gap-6 xl:grid-cols-4">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                        <h2 className="mb-5 text-lg font-black text-slate-900">Informations générales</h2>
                        <div className="space-y-3 text-sm text-slate-700">
                            <p><strong>Référence :</strong> {campagne.reference}</p>
                            <p><strong>Année :</strong> {campagne.annee}</p>
                            <p><strong>Vocation :</strong> {campagne.vocation}</p>
                            <p><strong>Créée par :</strong> {campagne.creator || '—'}</p>
                            <p><strong>Créée le :</strong> {campagne.created_at}</p>
                            <p><strong>Dernière mise à jour :</strong> {campagne.updated_at}</p>
                        </div>

                        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                            <strong>Observation :</strong>
                            <p className="mt-2 leading-7">{campagne.observation || 'Aucune observation.'}</p>
                        </div>
                    </div>

                    <StatCard label="Établissements" value={campagne.stats?.etablissements || 0} />
                    <StatCard label="Accès envoyés" value={campagne.stats?.acces_envoyes || 0} />
                    <StatCard label="Lettres préparées" value={campagne.stats?.lettres_preparees || 0} />
                    <StatCard label="Formulaires complétés" value={campagne.stats?.formulaires_completes || 0} />

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-4">
                        <h2 className="mb-5 text-lg font-black text-slate-900">Pilotage de la vague</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.patch(`/campagnes/${campagne.id}`);
                            }}
                            className="grid gap-4 md:grid-cols-2"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">Statut</label>
                                <select
                                    value={form.data.statut}
                                    onChange={(e) => form.setData('statut', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                                >
                                    <option value="brouillon">brouillon</option>
                                    <option value="active">active</option>
                                    <option value="cloturee">cloturee</option>
                                </select>
                            </div>

                            <div className="md:col-span-1">
                                <label className="mb-2 block text-sm font-bold text-slate-700">Observation</label>
                                <textarea
                                    rows={4}
                                    value={form.data.observation}
                                    onChange={(e) => form.setData('observation', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-xl bg-[#223270] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b285a] disabled:opacity-60"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-4">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-black text-slate-900">Établissements de la vague</h2>
                            <Link
                                href={`/campagnes/${campagne.id}/etablissements`}
                                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
                            >
                                Gérer la sélection
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {campagne.etablissements?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-800">{item.etablissement?.nom || 'Établissement'}</p>
                                        <p className="text-sm text-slate-500">
                                            {item.etablissement?.ville || 'Ville non renseignée'} · {item.statut}
                                        </p>
                                    </div>
                                    {item.dossier_id && (
                                        <Link
                                            href={`/dossiers/${item.dossier_id}`}
                                            className="rounded-xl bg-[#223270] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1b285a]"
                                        >
                                            Voir le dossier
                                        </Link>
                                    )}
                                </div>
                            ))}

                            {campagne?.etablissements?.length === 0 && (
                                <p className="text-sm text-slate-500">Aucun établissement n’a encore été rattaché à cette vague.</p>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardShell>
        </>
    );
}
