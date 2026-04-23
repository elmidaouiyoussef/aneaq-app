import { Head, Link, useForm } from '@inertiajs/react';
import DashboardShell from '@/Layouts/DashboardShell';

export default function Create() {
    const form = useForm({
        annee: new Date().getFullYear().toString(),
        vocation: '',
        observation: '',
    });

    return (
        <>
            <Head title="Nouvelle vague" />

            <DashboardShell
                title="Créer une vague d’évaluation"
                subtitle="Phase 1 du flux DEE"
                action={
                    <Link
                        href="/campagnes"
                        className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200"
                    >
                        Retour aux vagues
                    </Link>
                }
            >
                <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.post('/campagnes');
                        }}
                        className="space-y-6"
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">Année</label>
                                <input
                                    type="text"
                                    value={form.data.annee}
                                    onChange={(e) => form.setData('annee', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Vocation des établissements
                                </label>
                                <input
                                    type="text"
                                    value={form.data.vocation}
                                    onChange={(e) => form.setData('vocation', e.target.value)}
                                    placeholder="Ex : Universités publiques, écoles d’ingénieurs..."
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">Observation</label>
                            <textarea
                                rows={5}
                                value={form.data.observation}
                                onChange={(e) => form.setData('observation', e.target.value)}
                                placeholder="Contexte de la vague, objectifs, consignes DEE..."
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="rounded-xl bg-[#223270] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1b285a] disabled:opacity-60"
                            >
                                Créer la vague
                            </button>
                        </div>
                    </form>
                </div>
            </DashboardShell>
        </>
    );
}
