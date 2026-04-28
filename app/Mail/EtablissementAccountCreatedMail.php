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
    public string $dossierReference;
    public string $campagneReference;
    public string $logoPath;

    public function __construct(
        string $etablissementName,
        string $loginEmail,
        string $plainPassword,
        string $dossierReference = '—',
        string $campagneReference = '—',
        string $logoPath = ''
    ) {
        $this->etablissementName = $etablissementName;
        $this->loginEmail = $loginEmail;
        $this->plainPassword = $plainPassword;
        $this->dossierReference = $dossierReference;
        $this->campagneReference = $campagneReference;
        $this->logoPath = $logoPath;
    }

    public function build()
    {
        return $this
            ->subject('Accès établissement ANEAQ')
            ->view('emails.etablissement_account_created')
            ->with([
                'etablissementName' => $this->etablissementName,
                'loginEmail' => $this->loginEmail,
                'plainPassword' => $this->plainPassword,
                'dossierReference' => $this->dossierReference,
                'campagneReference' => $this->campagneReference,
                'logoPath' => $this->logoPath,
            ]);
    }
}