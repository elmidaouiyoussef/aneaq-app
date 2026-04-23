import { Head } from '@inertiajs/react';
import DashboardShell from '@/Layouts/DashboardShell';

export default function Index({ experts = [] }) {
    return (
        <>
            <Head title="Experts" />

            <DashboardShell
                title="Experts"
                subtitle="Évaluateurs mobilisés"
            >
                <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-sm text-slate-600">
                                    <th className="px-6 py-4">Nom</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Ville</th>
                                    <th className="px-6 py-4">Spécialité</th>
                                    <th className="px-6 py-4">Fonction</th>
                                </tr>
                            </thead>
                            <tbody>
                                {experts.map((expert) => (
                                    <tr key={expert.id} className="border-t border-slate-100 text-sm">
                                        <td className="px-6 py-4 font-semibold text-slate-800">{expert.nom || '—'}</td>
                                        <td className="px-6 py-4 text-slate-700">{expert.email || '—'}</td>
                                        <td className="px-6 py-4 text-slate-700">{expert.ville || '—'}</td>
                                        <td className="px-6 py-4 text-slate-700">{expert.specialite || '—'}</td>
                                        <td className="px-6 py-4 text-slate-700">{expert.fonction || '—'}</td>
                                    </tr>
                                ))}

                                {experts.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-500">
                                            Aucun expert disponible.
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
