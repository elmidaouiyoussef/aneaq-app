<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Dossier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DossierDocumentController extends Controller
{
    public function store(Request $request, Dossier $dossier)
    {
        $validated = $request->validate([
            'type_document' => ['required', 'in:rapport_autoevaluation,annexe,piece_justificative'],
            'observation' => ['nullable', 'string'],
            'file' => ['required', 'file', 'max:10240'],
        ]);

        $path = $request->file('file')->store('dossiers/'.$dossier->id, 'public');

        Document::create([
            'dossier_id' => $dossier->id,
            'type_document' => $validated['type_document'],
            'file_path' => $path,
            'original_name' => $request->file('file')->getClientOriginalName(),
            'uploaded_by' => $request->user()?->id,
            'observation' => $validated['observation'] ?? null,
        ]);

        if ($validated['type_document'] === 'rapport_autoevaluation') {
            $dossier->update(['statut' => 'Rapport reçu']);
            $dossier->campagneEtablissement?->update(['statut' => 'rapport d’autoévaluation déposé']);
        }

        if ($validated['type_document'] === 'annexe') {
            $dossier->update(['statut' => 'Annexes reçues']);
            $dossier->campagneEtablissement?->update(['statut' => 'annexes déposées']);
        }

        return back()->with('success', 'Le document a été ajouté au dossier.');
    }

    public function destroy(Dossier $dossier, Document $document)
    {
        abort_unless($document->dossier_id === $dossier->id, 404);

        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return back()->with('success', 'Le document a été supprimé.');
    }
}
