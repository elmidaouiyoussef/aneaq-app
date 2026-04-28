<?php

namespace App\Http\Controllers;

use App\Mail\EtablissementAccountCreatedMail;
use App\Models\CampagneEvaluation;
use App\Models\CampagneEtablissement;
use App\Models\Dossier;
use App\Models\Etablissement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class CampagneEtablissementController extends Controller
{
    public function attach(Request $request, CampagneEvaluation $campagneEvaluation)
    {
        $validated = $request->validate([
            'etablissement_id' => ['required', 'exists:etablissements,id'],
        ]);

        $exists = CampagneEtablissement::query()
            ->where('campagne_evaluation_id', $campagneEvaluation->id)
            ->where('etablissement_id', $validated['etablissement_id'])
            ->exists();

        if ($exists) {
            return back()->with('error', 'Cet établissement est déjà rattaché à cette vague.');
        }

        $campagneEtablissement = new CampagneEtablissement();

        $data = [
            'campagne_evaluation_id' => $campagneEvaluation->id,
            'etablissement_id' => $validated['etablissement_id'],
        ];

        if ($this->hasColumn($campagneEtablissement, 'statut')) {
            $data['statut'] = 'en_attente_confirmation_dee';
        }

        if ($this->hasColumn($campagneEtablissement, 'status')) {
            $data['status'] = 'en_attente_confirmation_dee';
        }

        $campagneEtablissement->forceFill($data);
        $campagneEtablissement->save();

        return back()->with('success', 'Établissement ajouté à la vague en attente de confirmation DEE.');
    }

    public function confirm(
        Request $request,
        CampagneEvaluation $campagneEvaluation,
        CampagneEtablissement $campagneEtablissement
    ) {
        if ((int) $campagneEtablissement->campagne_evaluation_id !== (int) $campagneEvaluation->id) {
            abort(404);
        }

        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'lettre_dee' => ['required', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:10240'],
        ]);

        $mailData = DB::transaction(function () use (
            $request,
            $validated,
            $campagneEvaluation,
            $campagneEtablissement
        ) {
            $etablissement = Etablissement::query()->findOrFail($campagneEtablissement->etablissement_id);

            if ($this->hasColumn($etablissement, 'email')) {
                $etablissement->email = $validated['email'];
                $etablissement->save();
            }

            $plainPassword = Str::random(10);

            $user = User::firstOrNew([
                'email' => $validated['email'],
            ]);

            $user->name = $this->etablissementName($etablissement);
            $user->password = Hash::make($plainPassword);

            if (Schema::hasColumn('users', 'role')) {
                $user->role = 'etablissement';
            }

            $user->save();

            $dossier = $this->createOrGetDossier(
                $campagneEvaluation,
                $campagneEtablissement,
                $etablissement
            );

            $file = $request->file('lettre_dee');

            $path = $file->store(
                'dossiers/' . $dossier->id . '/lettres-dee',
                'public'
            );

            $this->storeDossierDocument(
                dossier: $dossier,
                filePath: $path,
                originalName: $file->getClientOriginalName(),
                mimeType: $file->getClientMimeType(),
                size: $file->getSize()
            );

            $pivotUpdate = [];

            if ($this->hasColumn($campagneEtablissement, 'email')) {
                $pivotUpdate['email'] = $validated['email'];
            }

            if ($this->hasColumn($campagneEtablissement, 'statut')) {
                $pivotUpdate['statut'] = 'acces_envoye';
            }

            if ($this->hasColumn($campagneEtablissement, 'status')) {
                $pivotUpdate['status'] = 'acces_envoye';
            }

            if ($this->hasColumn($campagneEtablissement, 'access_sent_at')) {
                $pivotUpdate['access_sent_at'] = now();
            }

            if ($this->hasColumn($campagneEtablissement, 'dossier_id')) {
                $pivotUpdate['dossier_id'] = $dossier->id;
            }

            if ($this->hasColumn($campagneEtablissement, 'lettre_dee_path')) {
                $pivotUpdate['lettre_dee_path'] = $path;
            }

            if ($this->hasColumn($campagneEtablissement, 'lettre_path')) {
                $pivotUpdate['lettre_path'] = $path;
            }

            if (!empty($pivotUpdate)) {
                $campagneEtablissement->forceFill($pivotUpdate);
                $campagneEtablissement->save();
            }

            return [
                'email' => $validated['email'],
                'password' => $plainPassword,
                'etablissement_name' => $this->etablissementName($etablissement),
                'dossier_reference' => $dossier->reference ?? '—',
                'file_path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
            ];
        });

        try {
            Log::info('Tentative envoi email établissement', [
                'email' => $mailData['email'],
                'etablissement' => $mailData['etablissement_name'],
                'dossier' => $mailData['dossier_reference'],
            ]);

            try {
    Log::info('Tentative envoi email établissement', [
        'email' => $mailData['email'],
        'etablissement' => $mailData['etablissement_name'],
        'dossier' => $mailData['dossier_reference'],
    ]);

    Mail::to($mailData['email'])->send(
    new EtablissementAccountCreatedMail(
        $mailData['etablissement_name'],
        $mailData['email'],
        $mailData['password'],
        $mailData['dossier_reference'] ?? '—',
        $campagneEvaluation->reference ?? '—'
    )
);

    Log::info('Email établissement envoyé avec succès', [
        'email' => $mailData['email'],
    ]);

    return back()->with(
        'success',
        'Compte établissement créé, dossier créé, lettre DEE stockée et email envoyé avec succès.'
    );
} catch (\Throwable $e) {
    Log::error('Erreur envoi email établissement', [
        'email' => $mailData['email'] ?? null,
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
    ]);

    return back()->with(
        'error',
        'Email non envoyé : ' . $e->getMessage()
    );
}

            Log::info('Email établissement envoyé avec succès', [
                'email' => $mailData['email'],
            ]);

            return back()->with(
                'success',
                'Compte établissement créé, dossier créé, lettre DEE stockée et email envoyé avec succès.'
            );
        } catch (\Throwable $e) {
            Log::error('Erreur envoi email établissement', [
                'email' => $mailData['email'] ?? null,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return back()->with(
                'error',
                'Le compte et le dossier ont été créés, mais l’email n’a pas été envoyé : ' . $e->getMessage()
            );
        }
    }

    public function refuse(
        CampagneEvaluation $campagneEvaluation,
        CampagneEtablissement $campagneEtablissement
    ) {
        if ((int) $campagneEtablissement->campagne_evaluation_id !== (int) $campagneEvaluation->id) {
            abort(404);
        }

        DB::transaction(function () use ($campagneEvaluation, $campagneEtablissement) {
            $dossier = $this->findDossierForCampagneEtablissement(
                $campagneEvaluation,
                $campagneEtablissement
            );

            if ($dossier) {
                $dossier->delete();
            }

            $campagneEtablissement->delete();
        });

        return back()->with('success', 'Établissement refusé et supprimé de la vague.');
    }

    private function createOrGetDossier(
        CampagneEvaluation $campagne,
        CampagneEtablissement $campagneEtablissement,
        Etablissement $etablissement
    ): Dossier {
        $existing = $this->findDossierForCampagneEtablissement($campagne, $campagneEtablissement);

        if ($existing) {
            return $existing;
        }

        $dossier = new Dossier();
        $table = $dossier->getTable();

        $reference = $this->uniqueDossierReference($campagne, $etablissement);

        $data = [];

        if (Schema::hasColumn($table, 'reference')) {
            $data['reference'] = $reference;
        }

        if (Schema::hasColumn($table, 'campagne')) {
            $data['campagne'] = $campagne->reference;
        }

        if (Schema::hasColumn($table, 'campagne_evaluation_id')) {
            $data['campagne_evaluation_id'] = $campagne->id;
        }

        if (Schema::hasColumn($table, 'campagne_id')) {
            $data['campagne_id'] = $campagne->id;
        }

        if (Schema::hasColumn($table, 'campagne_etablissement_id')) {
            $data['campagne_etablissement_id'] = $campagneEtablissement->id;
        }

        if (Schema::hasColumn($table, 'etablissement_id')) {
            $data['etablissement_id'] = $etablissement->id;
        }

        if (Schema::hasColumn($table, 'nom')) {
            $data['nom'] = $this->etablissementName($etablissement);
        }

        if (Schema::hasColumn($table, 'description')) {
            $data['description'] = 'Dossier créé automatiquement après confirmation DEE.';
        }

        if (Schema::hasColumn($table, 'observation')) {
            $data['observation'] = null;
        }

        if (Schema::hasColumn($table, 'statut')) {
            $data['statut'] = 'Compte établissement créé';
        }

        if (Schema::hasColumn($table, 'status')) {
            $data['status'] = 'Compte établissement créé';
        }

        if (Schema::hasColumn($table, 'created_by')) {
            $data['created_by'] = Auth::id();
        }

        $dossier->forceFill($data);
        $dossier->save();

        return $dossier;
    }

    private function findDossierForCampagneEtablissement(
        CampagneEvaluation $campagne,
        CampagneEtablissement $campagneEtablissement
    ): ?Dossier {
        $pivotTable = $campagneEtablissement->getTable();
        $dossierTable = (new Dossier())->getTable();

        if (Schema::hasColumn($pivotTable, 'dossier_id')) {
            $dossierId = $campagneEtablissement->getAttribute('dossier_id');

            if ($dossierId) {
                $dossier = Dossier::query()->find($dossierId);

                if ($dossier) {
                    return $dossier;
                }
            }
        }

        if (Schema::hasColumn($dossierTable, 'campagne_etablissement_id')) {
            $dossier = Dossier::query()
                ->where('campagne_etablissement_id', $campagneEtablissement->id)
                ->first();

            if ($dossier) {
                return $dossier;
            }
        }

        $query = Dossier::query();

        $hasCampagneCondition = false;
        $hasEtablissementCondition = false;

        if (Schema::hasColumn($dossierTable, 'campagne_evaluation_id')) {
            $query->where('campagne_evaluation_id', $campagne->id);
            $hasCampagneCondition = true;
        } elseif (Schema::hasColumn($dossierTable, 'campagne_id')) {
            $query->where('campagne_id', $campagne->id);
            $hasCampagneCondition = true;
        } elseif (Schema::hasColumn($dossierTable, 'campagne')) {
            $query->where('campagne', $campagne->reference);
            $hasCampagneCondition = true;
        }

        if (Schema::hasColumn($dossierTable, 'etablissement_id')) {
            $query->where('etablissement_id', $campagneEtablissement->etablissement_id);
            $hasEtablissementCondition = true;
        }

        if (!$hasCampagneCondition || !$hasEtablissementCondition) {
            return null;
        }

        return $query->first();
    }

    private function storeDossierDocument(
        Dossier $dossier,
        string $filePath,
        string $originalName,
        ?string $mimeType,
        ?int $size
    ): void {
        $table = null;

        foreach (['dossier_documents', 'documents'] as $candidate) {
            if (Schema::hasTable($candidate)) {
                $table = $candidate;
                break;
            }
        }

        if (!$table) {
            Log::warning('Aucune table document trouvée pour stocker la lettre DEE', [
                'dossier_id' => $dossier->id,
                'file_path' => $filePath,
            ]);

            return;
        }

        $data = [];

        $this->setColumn($table, $data, 'dossier_id', $dossier->id);
        $this->setColumn($table, $data, 'type', 'lettre_dee');
        $this->setColumn($table, $data, 'document_type', 'lettre_dee');

        $this->setColumn($table, $data, 'titre', 'Lettre DEE');
        $this->setColumn($table, $data, 'nom', 'Lettre DEE');
        $this->setColumn($table, $data, 'name', 'Lettre DEE');

        $this->setColumn($table, $data, 'path', $filePath);
        $this->setColumn($table, $data, 'file_path', $filePath);
        $this->setColumn($table, $data, 'fichier', $filePath);

        $this->setColumn($table, $data, 'original_name', $originalName);
        $this->setColumn($table, $data, 'filename', $originalName);
        $this->setColumn($table, $data, 'mime_type', $mimeType);
        $this->setColumn($table, $data, 'size', $size);

        $this->setColumn($table, $data, 'uploaded_by', Auth::id());
        $this->setColumn($table, $data, 'created_by', Auth::id());

        $this->setColumn($table, $data, 'depose_par', 'DEE');
        $this->setColumn($table, $data, 'statut', 'Déposé');
        $this->setColumn($table, $data, 'status', 'Déposé');

        if (Schema::hasColumn($table, 'created_at')) {
            $data['created_at'] = now();
        }

        if (Schema::hasColumn($table, 'updated_at')) {
            $data['updated_at'] = now();
        }

        DB::table($table)->insert($data);
    }

    private function uniqueDossierReference(CampagneEvaluation $campagne, Etablissement $etablissement): string
    {
        $year = $campagne->annee ?: date('Y');

        $base = 'DOS-' . $year . '-' . $campagne->id . '-' . $etablissement->id;
        $reference = $base;
        $index = 1;

        if (!Schema::hasColumn((new Dossier())->getTable(), 'reference')) {
            return $reference;
        }

        while (Dossier::query()->where('reference', $reference)->exists()) {
            $reference = $base . '-' . $index;
            $index++;
        }

        return $reference;
    }

    private function etablissementName(?Etablissement $etablissement): string
    {
        if (!$etablissement) {
            return 'Établissement';
        }

        foreach (['nom', 'etablissement_2', 'etablissement', 'name', 'intitule'] as $column) {
            $value = $etablissement->getAttribute($column);

            if ($value !== null && $value !== '') {
                return $value;
            }
        }

        return 'Établissement';
    }

    private function hasColumn($model, string $column): bool
    {
        return Schema::hasColumn($model->getTable(), $column);
    }

    private function setColumn(string $table, array &$data, string $column, mixed $value): void
    {
        if (Schema::hasColumn($table, $column)) {
            $data[$column] = $value;
        }
    }
}