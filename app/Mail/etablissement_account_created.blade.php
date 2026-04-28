<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Accès établissement ANEAQ</title>
</head>

<body style="margin:0; padding:0; background:#f4f7fb; font-family:Arial, Helvetica, sans-serif; color:#172033;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb; padding:40px 0;">
        <tr>
            <td align="center">
                <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 12px 35px rgba(15,23,42,0.10);">

                    <tr>
                        <td style="background:linear-gradient(135deg,#2438d7,#0891b2); padding:34px 38px; color:#ffffff;">
                            <div style="font-size:13px; letter-spacing:4px; text-transform:uppercase; font-weight:bold; opacity:0.9;">
                                ANEAQ
                            </div>

                            <h1 style="margin:14px 0 0; font-size:28px; line-height:1.3;">
                                Accès à la plateforme
                            </h1>

                            <p style="margin:12px 0 0; font-size:15px; line-height:1.8; color:#eaf2ff;">
                                Votre compte établissement a été créé avec succès.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:34px 38px;">
                            <p style="margin:0 0 18px; font-size:15px; line-height:1.8;">
                                Bonjour,
                            </p>

                            <p style="margin:0 0 22px; font-size:15px; line-height:1.8;">
                                Le compte de votre établissement a été créé sur la plateforme ANEAQ.
                                Vous pouvez utiliser les identifiants ci-dessous pour vous connecter.
                            </p>

                            <div style="background:#f8fafc; border:1px solid #e5eaf3; border-radius:14px; padding:20px; margin:24px 0;">
                                <p style="margin:0 0 8px; font-size:12px; letter-spacing:3px; text-transform:uppercase; color:#64748b; font-weight:bold;">
                                    Établissement
                                </p>

                                <p style="margin:0; font-size:17px; font-weight:bold; color:#0f172a;">
                                    {{ $etablissementName }}
                                </p>
                            </div>

                            <div style="background:#eef5ff; border:1px solid #dbeafe; border-radius:14px; padding:18px; margin-bottom:14px;">
                                <p style="margin:0 0 8px; font-size:12px; letter-spacing:3px; text-transform:uppercase; color:#2563eb; font-weight:bold;">
                                    Email
                                </p>

                                <p style="margin:0; font-size:15px; font-weight:bold; color:#172033;">
                                    {{ $loginEmail }}
                                </p>
                            </div>

                            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:14px; padding:18px; margin-bottom:14px;">
                                <p style="margin:0 0 8px; font-size:12px; letter-spacing:3px; text-transform:uppercase; color:#16a34a; font-weight:bold;">
                                    Mot de passe
                                </p>

                                <p style="margin:0; font-size:17px; font-weight:bold; color:#172033;">
                                    {{ $plainPassword }}
                                </p>
                            </div>

                            <div style="background:#f8fafc; border:1px solid #e5eaf3; border-radius:14px; padding:18px;">
                                <p style="margin:0 0 8px; font-size:12px; letter-spacing:3px; text-transform:uppercase; color:#64748b; font-weight:bold;">
                                    Dossier
                                </p>

                                <p style="margin:0; font-size:15px; font-weight:bold; color:#172033;">
                                    {{ $dossierReference }}
                                </p>

                                <p style="margin:10px 0 0; font-size:13px; color:#64748b;">
                                    Vague : {{ $campagneReference }}
                                </p>
                            </div>

                            <p style="margin:26px 0 0; font-size:14px; line-height:1.8; color:#475569;">
                                Pour des raisons de sécurité, il est recommandé de modifier ce mot de passe après la première connexion.
                            </p>

                            <p style="margin:28px 0 0; font-size:15px; line-height:1.8;">
                                Cordialement,<br>
                                <strong>ANEAQ</strong>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#0f1e4a; padding:18px 38px; text-align:center;">
                            <p style="margin:0; font-size:12px; color:#b8c7e6;">
                                © 2026 ANEAQ - Division de l’Évaluation des Établissements
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>