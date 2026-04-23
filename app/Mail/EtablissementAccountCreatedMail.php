<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EtablissementAccountCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $etablissementName;
    public string $loginEmail;
    public string $plainPassword;
    public ?string $campagneReference;
    public ?string $dossierReference;
    public string $logoPath;

    public function __construct(
        string $etablissementName,
        string $loginEmail,
        string $plainPassword,
        ?string $campagneReference = null,
        ?string $dossierReference = null
    ) {
        $this->etablissementName = $etablissementName;
        $this->loginEmail = $loginEmail;
        $this->plainPassword = $plainPassword;
        $this->campagneReference = $campagneReference;
        $this->dossierReference = $dossierReference;
        $this->logoPath = public_path('images/logo-aneaq.png');
    }

    public function build(): self
    {
        return $this
            ->subject('Sélection à l’évaluation institutionnelle - ANEAQ')
            ->view('emails.etablissement_account_created');
    }
}
