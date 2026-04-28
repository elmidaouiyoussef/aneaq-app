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

/*
|--------------------------------------------------------------------------
| Changement de langue
|--------------------------------------------------------------------------
*/

Route::post('/language/{locale}', function (string $locale) {
    if (in_array($locale, ['fr', 'ar'], true)) {
        session(['locale' => $locale]);
    }

    return back();
})->name('language.switch');

/*
|--------------------------------------------------------------------------
| Confirmation expert depuis email
|--------------------------------------------------------------------------
| Cette route reste publique parce que l'expert confirme depuis le lien reçu
| dans son email.
|--------------------------------------------------------------------------
*/

Route::get('/experts/invitation/{token}/confirm', [ExpertInvitationController::class, 'confirm'])
    ->name('experts.invitation.confirm');

/*
|--------------------------------------------------------------------------
| Routes protégées par authentification
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard DEE
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', [AdminDashboardController::class, 'index'])
        ->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | Profil utilisateur
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
    | Gestion des établissements
    |--------------------------------------------------------------------------
    */

    Route::prefix('etablissements')->name('etablissements.')->group(function () {
        Route::get('/', [EtablissementController::class, 'index'])
            ->name('index');

        Route::get('/create', [EtablissementController::class, 'create'])
            ->name('create');

        Route::post('/', [EtablissementController::class, 'store'])
            ->name('store');

        Route::get('/{etablissement}', [EtablissementController::class, 'show'])
            ->name('show');

        Route::get('/{etablissement}/edit', [EtablissementController::class, 'edit'])
            ->name('edit');

        Route::patch('/{etablissement}', [EtablissementController::class, 'update'])
            ->name('update');

        Route::delete('/{etablissement}', [EtablissementController::class, 'destroy'])
            ->name('destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | Gestion des experts
    |--------------------------------------------------------------------------
    */

    Route::prefix('experts')->name('experts.')->group(function () {
        Route::get('/', [ExpertController::class, 'index'])
            ->name('index');

        Route::get('/create', [ExpertController::class, 'create'])
            ->name('create');

        Route::post('/', [ExpertController::class, 'store'])
            ->name('store');

        Route::get('/{expert}', [ExpertController::class, 'show'])
            ->name('show');

        Route::get('/{expert}/edit', [ExpertController::class, 'edit'])
            ->name('edit');

        Route::patch('/{expert}', [ExpertController::class, 'update'])
            ->name('update');

        Route::delete('/{expert}', [ExpertController::class, 'destroy'])
            ->name('destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | Gestion des vagues / campagnes d'évaluation
    |--------------------------------------------------------------------------
    */

    Route::prefix('campagnes')->name('campagnes.')->group(function () {
        Route::get('/', [CampagneEvaluationController::class, 'index'])
            ->name('index');

        Route::get('/create', [CampagneEvaluationController::class, 'create'])
            ->name('create');

        Route::post('/', [CampagneEvaluationController::class, 'store'])
            ->name('store');

        Route::get('/{campagneEvaluation}', [CampagneEvaluationController::class, 'show'])
            ->name('show');

        Route::patch('/{campagneEvaluation}', [CampagneEvaluationController::class, 'update'])
            ->name('update');

        Route::delete('/{campagneEvaluation}', [CampagneEvaluationController::class, 'destroy'])
            ->name('destroy');

        /*
        |--------------------------------------------------------------------------
        | Ancienne route de gestion des établissements
        |--------------------------------------------------------------------------
        | Maintenant la sélection des établissements se fait dans une popup
        | directement depuis la page détail de la vague.
        |--------------------------------------------------------------------------
        */

        Route::get('/{campagneEvaluation}/etablissements', function (CampagneEvaluation $campagneEvaluation) {
            return redirect()->route('campagnes.show', $campagneEvaluation);
        })->name('etablissements');

        /*
        |--------------------------------------------------------------------------
        | Établissements rattachés à une vague
        |--------------------------------------------------------------------------
        */

        Route::post('/{campagneEvaluation}/etablissements/attach', [CampagneEtablissementController::class, 'attach'])
            ->name('etablissements.attach');

        Route::post('/{campagneEvaluation}/etablissements/{campagneEtablissement}/confirm', [CampagneEtablissementController::class, 'confirm'])
            ->name('etablissements.confirm');

        Route::delete('/{campagneEvaluation}/etablissements/{campagneEtablissement}/refuse', [CampagneEtablissementController::class, 'refuse'])
            ->name('etablissements.refuse');
    });

    /*
    |--------------------------------------------------------------------------
    | Gestion des dossiers
    |--------------------------------------------------------------------------
    */

    Route::prefix('dossiers')->name('dossiers.')->group(function () {
        Route::get('/', [DossierController::class, 'index'])
            ->name('index');

        Route::get('/{dossier}', [DossierController::class, 'show'])
            ->name('show');

        Route::patch('/{dossier}', [DossierController::class, 'update'])
            ->name('update');

        Route::delete('/{dossier}', [DossierController::class, 'destroy'])
            ->name('destroy');

        /*
        |--------------------------------------------------------------------------
        | Documents du dossier
        |--------------------------------------------------------------------------
        */

        Route::post('/{dossier}/documents', [DossierDocumentController::class, 'store'])
            ->name('documents.store');

        Route::delete('/{dossier}/documents/{document}', [DossierDocumentController::class, 'destroy'])
            ->whereNumber('document')
            ->name('documents.destroy');

        /*
        |--------------------------------------------------------------------------
        | Experts affectés au dossier
        |--------------------------------------------------------------------------
        */

        Route::post('/{dossier}/experts', [DossierExpertController::class, 'store'])
            ->name('experts.store');

        Route::post('/{dossier}/experts/{dossierExpert}/confirm', [DossierExpertController::class, 'confirm'])
            ->name('experts.confirm');

        Route::delete('/{dossier}/experts/{dossierExpert}/refuse', [DossierExpertController::class, 'refuse'])
            ->name('experts.refuse');

        Route::delete('/{dossier}/experts/{dossierExpert}', [DossierExpertController::class, 'destroy'])
            ->name('experts.destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | Workflow / visites
    |--------------------------------------------------------------------------
    */

    Route::prefix('workflow')->name('workflow.')->group(function () {
        Route::get('/visites', [WorkflowController::class, 'visites'])
            ->name('visites');
    });
});

/*
|--------------------------------------------------------------------------
| Routes Auth Breeze / Laravel
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';