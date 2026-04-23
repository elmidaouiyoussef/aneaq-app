<?php

namespace App\Http\Controllers;

use App\Models\Dossier;
use App\Models\Expert;
use Illuminate\Http\Request;

class DossierExpertController extends Controller
{
    public function store(Request $request, Dossier $dossier)
    {
        $validated = $request->validate([
            'expert_id' => ['required', 'integer', 'exists:experts,id'],
            'role' => ['nullable', 'string', 'max:255'],
            'statut_participation' => ['nullable', 'string', 'max:255'],
        ]);

        $expert = Expert::findOrFail($validated['expert_id']);

        $dossier->experts()->syncWithoutDetaching([
            $expert->id => [
                'role' => $validated['role'] ?? null,
                'statut_participation' => $validated['statut_participation'] ?? 'proposé',
                'validated_by_dee_at' => now(),
                'updated_at' => now(),
                'created_at' => now(),
            ],
        ]);

        $dossier->update([
            'statut' => 'Experts affectés',
        ]);

        $dossier->campagneEtablissement?->update([
            'statut' => 'experts affectés',
        ]);

        return back()->with('success', 'L’expert a été affecté au dossier.');
    }

    public function destroy(Dossier $dossier, Expert $expert)
    {
        $dossier->experts()->detach($expert->id);

        return back()->with('success', 'L’expert a été retiré du dossier.');
    }
}
