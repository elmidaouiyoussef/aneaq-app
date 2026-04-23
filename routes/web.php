<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\CampagneEtablissementController;
use App\Http\Controllers\CampagneEvaluationController;
use App\Http\Controllers\DossierController;
use App\Http\Controllers\DossierDocumentController;
use App\Http\Controllers\DossierExpertController;
use App\Http\Controllers\EtablissementController;
use App\Http\Controllers\EtablissementOnboardingController;
use App\Http\Controllers\ExpertController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkflowController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::post('/language/{locale}', function (Request $request, string $locale) {
    if (in_array($locale, ['fr', 'ar'], true)) {
        session(['locale' => $locale]);
    }

    return back();
})->name('language.switch');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/campagnes', [CampagneEvaluationController::class, 'index'])->name('campagnes.index');
    Route::get('/campagnes/create', [CampagneEvaluationController::class, 'create'])->name('campagnes.create');
    Route::post('/campagnes', [CampagneEvaluationController::class, 'store'])->name('campagnes.store');
    Route::get('/campagnes/{campagneEvaluation}', [CampagneEvaluationController::class, 'show'])->name('campagnes.show');
    Route::patch('/campagnes/{campagneEvaluation}', [CampagneEvaluationController::class, 'update'])->name('campagnes.update');
    Route::delete('/campagnes/{campagneEvaluation}', [CampagneEvaluationController::class, 'destroy'])->name('campagnes.destroy');

    Route::get('/campagnes/{campagneEvaluation}/etablissements', [CampagneEtablissementController::class, 'index'])->name('campagnes.etablissements.index');
    Route::post('/campagnes/{campagneEvaluation}/etablissements/select', [CampagneEtablissementController::class, 'store'])->name('campagnes.etablissements.store');
    Route::patch('/campagnes/{campagneEvaluation}/etablissements/{campagneEtablissement}', [CampagneEtablissementController::class, 'update'])->name('campagnes.etablissements.update');
    Route::post('/campagnes/{campagneEvaluation}/etablissements/{campagneEtablissement}/send-access', [CampagneEtablissementController::class, 'sendAccess'])->name('campagnes.etablissements.send-access');

    Route::get('/dossiers', [DossierController::class, 'index'])->name('dossiers.index');
    Route::get('/dossiers/{dossier}', [DossierController::class, 'show'])->name('dossiers.show');
    Route::patch('/dossiers/{dossier}', [DossierController::class, 'update'])->name('dossiers.update');
    Route::delete('/dossiers/{dossier}', [DossierController::class, 'destroy'])->name('dossiers.destroy');

    Route::get('/etablissements', [EtablissementController::class, 'index'])->name('etablissements.index');
    Route::get('/experts', [ExpertController::class, 'index'])->name('experts.index');

    Route::get('/workflow/selection-etablissements', [WorkflowController::class, 'selectionEtablissements'])->name('workflow.selection-etablissements');
    Route::get('/workflow/selection-experts', [WorkflowController::class, 'selectionExperts'])->name('workflow.selection-experts');
    Route::get('/workflow/comites', [WorkflowController::class, 'comites'])->name('workflow.comites');
    Route::get('/workflow/affectations', [WorkflowController::class, 'affectations'])->name('workflow.affectations');
    Route::get('/workflow/visites', [WorkflowController::class, 'visites'])->name('workflow.visites');
    Route::get('/workflow/recommandations', [WorkflowController::class, 'recommandations'])->name('workflow.recommandations');

    Route::post('/dossiers/{dossier}/experts', [DossierExpertController::class, 'store'])->name('dossiers.experts.store');
    Route::delete('/dossiers/{dossier}/experts/{expert}', [DossierExpertController::class, 'destroy'])->name('dossiers.experts.destroy');

    Route::post('/dossiers/{dossier}/documents', [DossierDocumentController::class, 'store'])->name('dossiers.documents.store');
    Route::delete('/dossiers/{dossier}/documents/{document}', [DossierDocumentController::class, 'destroy'])->name('dossiers.documents.destroy');

    Route::get('/etablissement/premier-formulaire', [EtablissementOnboardingController::class, 'show'])->name('etablissement.onboarding.show');
    Route::post('/etablissement/premier-formulaire', [EtablissementOnboardingController::class, 'store'])->name('etablissement.onboarding.store');

    Route::post('/logout', function () {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect('/');
    })->name('logout');
});

require __DIR__.'/auth.php';
