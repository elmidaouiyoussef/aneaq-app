<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\CampagneEtablissementController;
use App\Http\Controllers\CampagneEvaluationController;
use App\Http\Controllers\DossierController;
use App\Http\Controllers\DossierDocumentController;
use App\Http\Controllers\DossierExpertController;
use App\Http\Controllers\EtablissementController;
use App\Http\Controllers\ExpertController;
use App\Http\Controllers\ExpertInvitationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkflowController;
use App\Models\CampagneEvaluation;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Page publique
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::post('/language/{locale}', function (string $locale) {
    if (in_array($locale, ['fr', 'ar'], true)) {
        session(['locale' => $locale]);
    }

    return back();
})->name('language.switch');

/*
|--------------------------------------------------------------------------
| Confirmation expert par email
|--------------------------------------------------------------------------
*/

Route::get('/experts/invitation/{token}/confirm', [ExpertInvitationController::class, 'confirm'])
    ->name('experts.invitation.confirm');

/*
|--------------------------------------------------------------------------
| Routes authentifiées
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', [AdminDashboardController::class, 'index'])
        ->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | Profil
    |--------------------------------------------------------------------------
    */

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    /*
    |--------------------------------------------------------------------------
    | Établissements
    |--------------------------------------------------------------------------
    */

    Route::get('/etablissements', [EtablissementController::class, 'index'])
        ->name('etablissements.index');

    Route::get('/etablissements/create', [EtablissementController::class, 'create'])
        ->name('etablissements.create');

    Route::post('/etablissements', [EtablissementController::class, 'store'])
        ->name('etablissements.store');

    Route::get('/etablissements/{etablissement}', [EtablissementController::class, 'show'])
        ->name('etablissements.show');

    Route::get('/etablissements/{etablissement}/edit', [EtablissementController::class, 'edit'])
        ->name('etablissements.edit');

    Route::patch('/etablissements/{etablissement}', [EtablissementController::class, 'update'])
        ->name('etablissements.update');

    Route::delete('/etablissements/{etablissement}', [EtablissementController::class, 'destroy'])
        ->name('etablissements.destroy');

    /*
    |--------------------------------------------------------------------------
    | Experts
    |--------------------------------------------------------------------------
    */

    Route::get('/experts', [ExpertController::class, 'index'])
        ->name('experts.index');

    Route::get('/experts/create', [ExpertController::class, 'create'])
        ->name('experts.create');

    Route::post('/experts', [ExpertController::class, 'store'])
        ->name('experts.store');

    Route::get('/experts/{expert}', [ExpertController::class, 'show'])
        ->name('experts.show');

    Route::get('/experts/{expert}/edit', [ExpertController::class, 'edit'])
        ->name('experts.edit');

    Route::patch('/experts/{expert}', [ExpertController::class, 'update'])
        ->name('experts.update');

    Route::delete('/experts/{expert}', [ExpertController::class, 'destroy'])
        ->name('experts.destroy');

    /*
    |--------------------------------------------------------------------------
    | Vagues / Campagnes
    |--------------------------------------------------------------------------
    */

    Route::get('/campagnes', [CampagneEvaluationController::class, 'index'])
        ->name('campagnes.index');

    Route::get('/campagnes/create', [CampagneEvaluationController::class, 'create'])
        ->name('campagnes.create');

    Route::post('/campagnes', [CampagneEvaluationController::class, 'store'])
        ->name('campagnes.store');

    Route::get('/campagnes/{campagneEvaluation}', [CampagneEvaluationController::class, 'show'])
        ->name('campagnes.show');

    Route::patch('/campagnes/{campagneEvaluation}', [CampagneEvaluationController::class, 'update'])
        ->name('campagnes.update');

    Route::delete('/campagnes/{campagneEvaluation}', [CampagneEvaluationController::class, 'destroy'])
        ->name('campagnes.destroy');

    /*
    |--------------------------------------------------------------------------
    | Ancienne page gérer établissements
    |--------------------------------------------------------------------------
    | Maintenant on utilise une popup dans la page show.
    |--------------------------------------------------------------------------
    */

    Route::get('/campagnes/{campagneEvaluation}/etablissements', function (CampagneEvaluation $campagneEvaluation) {
        return redirect()->route('campagnes.show', $campagneEvaluation);
    })->name('campagnes.etablissements');

    /*
    |--------------------------------------------------------------------------
    | Établissements dans la vague
    |--------------------------------------------------------------------------
    */

    Route::post('/campagnes/{campagneEvaluation}/etablissements/attach', [CampagneEtablissementController::class, 'attach'])
        ->name('campagnes.etablissements.attach');

    Route::post('/campagnes/{campagneEvaluation}/etablissements/{campagneEtablissement}/confirm', [CampagneEtablissementController::class, 'confirm'])
        ->name('campagnes.etablissements.confirm');

    Route::delete('/campagnes/{campagneEvaluation}/etablissements/{campagneEtablissement}/refuse', [CampagneEtablissementController::class, 'refuse'])
        ->name('campagnes.etablissements.refuse');

    /*
    |--------------------------------------------------------------------------
    | Dossiers
    |--------------------------------------------------------------------------
    */

    Route::get('/dossiers', [DossierController::class, 'index'])
        ->name('dossiers.index');

    Route::get('/dossiers/{dossier}', [DossierController::class, 'show'])
        ->name('dossiers.show');

    Route::patch('/dossiers/{dossier}', [DossierController::class, 'update'])
        ->name('dossiers.update');

    Route::delete('/dossiers/{dossier}', [DossierController::class, 'destroy'])
        ->name('dossiers.destroy');

    /*
    |--------------------------------------------------------------------------
    | Documents des dossiers
    |--------------------------------------------------------------------------
    */

    Route::post('/dossiers/{dossier}/documents', [DossierDocumentController::class, 'store'])
        ->name('dossiers.documents.store');

    Route::delete('/dossiers/{dossier}/documents/{document}', [DossierDocumentController::class, 'destroy'])
        ->whereNumber('document')
        ->name('dossiers.documents.destroy');

    /*
    |--------------------------------------------------------------------------
    | Experts affectés aux dossiers
    |--------------------------------------------------------------------------
    */

    Route::post('/dossiers/{dossier}/experts', [DossierExpertController::class, 'store'])
        ->name('dossiers.experts.store');

    Route::post('/dossiers/{dossier}/experts/{dossierExpert}/confirm', [DossierExpertController::class, 'confirm'])
        ->name('dossiers.experts.confirm');

    Route::delete('/dossiers/{dossier}/experts/{dossierExpert}/refuse', [DossierExpertController::class, 'refuse'])
        ->name('dossiers.experts.refuse');

    Route::delete('/dossiers/{dossier}/experts/{dossierExpert}', [DossierExpertController::class, 'destroy'])
        ->name('dossiers.experts.destroy');

    /*
    |--------------------------------------------------------------------------
    | Workflow visites
    |--------------------------------------------------------------------------
    */

    Route::get('/workflow/visites', [WorkflowController::class, 'visites'])
        ->name('workflow.visites');
});

require __DIR__.'/auth.php';