@php
    $logoCid = null;

    if (isset($message) && file_exists($logoPath)) {
        $logoCid = $message->embed($logoPath);
    }
@endphp

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Notification ANEAQ</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
    <div style="background:#ffffff;border-bottom:1px solid #e5e7eb;">
        <div style="max-width:900px;margin:0 auto;padding:20px 24px;display:flex;align-items:center;gap:16px;">
            @if($logoCid)
                <img src="{{ $logoCid }}" alt="ANEAQ" style="height:48px;display:block;">
            @endif
            <div>
                <div style="font-size:12px;font-weight:700;letter-spacing:0.22em;color:#2563eb;text-transform:uppercase;">
                    ANEAQ
                </div>
                <div style="font-size:22px;font-weight:800;color:#0f172a;margin-top:6px;">
                    Sélection à l’évaluation institutionnelle
                </div>
            </div>
        </div>
    </div>

    <div style="max-width:900px;margin:0 auto;padding:32px 24px;">
        <div style="background:linear-gradient(135deg,#13255c,#223983);border-radius:24px;padding:28px 30px;color:white;">
            <div style="font-size:12px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#bfdbfe;">
                Notification officielle
            </div>
            <div style="font-size:28px;font-weight:800;margin-top:10px;">
                Votre établissement a été sélectionné
            </div>
            <p style="margin-top:14px;font-size:15px;line-height:1.8;color:#dbeafe;">
                Bonjour, votre établissement <strong>{{ $etablissementName }}</strong> a été sélectionné
                dans le cadre de l’évaluation institutionnelle de l’ANEAQ.
            </p>
        </div>

        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:24px;padding:28px 30px;margin-top:22px;">
            <h2 style="margin:0 0 18px 0;font-size:20px;color:#0f172a;">Informations de connexion</h2>

            <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:18px;padding:18px 20px;">
                <p style="margin:0 0 10px 0;font-size:15px;color:#334155;">
                    <strong>Email :</strong> {{ $loginEmail }}
                </p>
                <p style="margin:0 0 10px 0;font-size:15px;color:#334155;">
                    <strong>Mot de passe temporaire :</strong> {{ $plainPassword }}
                </p>
                @if($dossierReference)
                    <p style="margin:0 0 10px 0;font-size:15px;color:#334155;">
                        <strong>Référence du dossier :</strong> {{ $dossierReference }}
                    </p>
                @endif
                @if($campagneReference)
                    <p style="margin:0;font-size:15px;color:#334155;">
                        <strong>Référence de la vague :</strong> {{ $campagneReference }}
                    </p>
                @endif
            </div>

            <p style="margin:22px 0 0 0;font-size:15px;line-height:1.8;color:#334155;">
                Nous vous invitons à vous connecter à la plateforme et à modifier votre mot de passe
                après la première connexion. Vous pourrez ensuite compléter le premier formulaire,
                renseigner le responsable du comité d’autoévaluation et déposer les annexes demandées.
            </p>
        </div>
    </div>

    <div style="background:#13255c;color:white;margin-top:20px;">
        <div style="max-width:900px;margin:0 auto;padding:28px 24px;">
            <div style="font-size:22px;font-weight:800;">ANEAQ</div>
            <p style="margin:14px 0 0 0;font-size:14px;line-height:1.8;color:#cbd5e1;">
                Agence Nationale d’Évaluation et d’Assurance Qualité de l’Enseignement Supérieur
                et de la Recherche Scientifique.
            </p>
            <p style="margin:18px 0 0 0;font-size:12px;color:#94a3b8;">
                © 2026 ANEAQ - Division de l’Evaluation des Etablissements.
            </p>
        </div>
    </div>
</body>
</html>
