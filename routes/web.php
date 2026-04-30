<?php

use App\Http\Controllers\DEE\AdminDashboardController;
use App\Http\Controllers\DEE\CampagneEtablissementController;
use App\Http\Controllers\DEE\CampagneEvaluationController;
use App\Http\Controllers\DEE\DossierController;
use App\Http\Controllers\DEE\DossierDocumentController;
use App\Http\Controllers\DEE\DossierExpertController;
use App\Http\Controllers\DEE\EtablissementController;
use App\Http\Controllers\DEE\ExpertController;
use App\Http\Controllers\DEE\ExpertInvitationController;
use App\Http\Controllers\DEE\ProfileController;
use App\Http\Controllers\DEE\WorkflowController;
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
| Ancienne route /dashboard
|--------------------------------------------------------------------------
| Si l'utilisateur est admin_dee => /dee/dashboard
| Sinon => il ne voit rien de l'espace DEE.
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->get('/dashboard', function () {
    if (auth()->user()?->role === 'admin_dee') {
        return redirect()->route('dee.dashboard');
    }

    abort(403, 'Accès refusé. Cette page est réservée à l’administrateur DEE.');
})->name('dashboard');

/*
|--------------------------------------------------------------------------
| Confirmation expert depuis email
|--------------------------------------------------------------------------
| Cette route reste publique.
|--------------------------------------------------------------------------
*/

Route::get('/experts/invitation/{token}/confirm', [ExpertInvitationController::class, 'confirm'])
    ->name('experts.invitation.confirm');

/*
|--------------------------------------------------------------------------
| Routes accessibles à tout utilisateur connecté
|--------------------------------------------------------------------------
| Le profil reste accessible à tous les utilisateurs connectés.
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Redirections anciennes URLs admin
|--------------------------------------------------------------------------
| Ces anciennes URLs restent protégées. Donc un non-admin ne verra rien.
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'dee.admin'])->group(function () {
    Route::redirect('/campagnes', '/dee/campagnes');
    Route::redirect('/campagnes/create', '/dee/campagnes/create');
    Route::get('/campagnes/{path}', function (string $path) {
        return redirect('/dee/campagnes/'.$path);
    })->where('path', '.*');

    Route::redirect('/dossiers', '/dee/dossiers');
    Route::get('/dossiers/{path}', function (string $path) {
        return redirect('/dee/dossiers/'.$path);
    })->where('path', '.*');

    Route::redirect('/etablissements', '/dee/etablissements');
    Route::get('/etablissements/{path}', function (string $path) {
        return redirect('/dee/etablissements/'.$path);
    })->where('path', '.*');

    Route::redirect('/experts', '/dee/experts');
    Route::get('/experts/{path}', function (string $path) {
        return redirect('/dee/experts/'.$path);
    })->where('path', '.*');

    Route::redirect('/workflow/visites', '/dee/workflow/visites');
});

/*
|--------------------------------------------------------------------------
| Espace DEE Administrateur
|--------------------------------------------------------------------------
| Toutes ces routes sont réservées seulement à role = admin_dee.
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'dee.admin'])
    ->prefix('dee')
    ->name('dee.')
    ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Dashboard DEE
        |--------------------------------------------------------------------------
        */

        Route::get('/dashboard', [AdminDashboardController::class, 'index'])
            ->name('dashboard');

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
        | Gestion des vagues / campagnes d’évaluation
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

            Route::get('/{campagneEvaluation}/etablissements', function (CampagneEvaluation $campagneEvaluation) {
                return redirect()->route('dee.campagnes.show', $campagneEvaluation);
            })->name('etablissements');

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

            Route::post('/{dossier}/documents', [DossierDocumentController::class, 'store'])
                ->name('documents.store');

            Route::delete('/{dossier}/documents/{document}', [DossierDocumentController::class, 'destroy'])
                ->whereNumber('document')
                ->name('documents.destroy');

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