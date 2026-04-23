import { Head } from '@inertiajs/react';
import DashboardShell from '@/Layouts/DashboardShell';

export default function Index({ etablissements = [] }) {
    return (
        <>
            <Head title="Établissements" />

            <DashboardShell
                title="Établissements"
                subtitle="Structures engagées"
            >
                <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-sm text-slate-600">
                                    <th className="px-6 py-4">Nom</th>
                                    <th className="px-6 py-4">Ville</th>
                                    <th className="px-6 py-4">Université</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Campagnes</th>
                                    <th className="px-6 py-4">Dossiers</th>
                                </tr>
                            </thead>
                            <tbody>
                                {etablissements.map((item) => (
                                    <tr key={item.id} className="border-t border-slate-100 text-sm">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-800">{item.nom || '—'}</p>
                                            <p className="text-slate-500">{item.nom_officiel || '—'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700">{item.ville || '—'}</td>
                                        <td className="px-6 py-4 text-slate-700">{item.universite || '—'}</td>
                                        <td className="px-6 py-4 text-slate-700">{item.email || '—'}</td>
                                        <td className="px-6 py-4 text-slate-700">{item.campagnes_count}</td>
                                        <td className="px-6 py-4 text-slate-700">{item.dossiers_count}</td>
                                    </tr>
                                ))}

                                {etablissements.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-sm text-slate-500">
                                            Aucun établissement disponible.
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
