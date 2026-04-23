import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, ExternalLink, Globe } from 'lucide-react';
import { useMemo } from 'react';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth, locale } = usePage().props;
    const user = auth?.user;
    const isArabic = locale === 'ar';

    const t = useMemo(() => {
        const fr = {
            about: 'À propos',
            universities: 'Universités',
            guides: 'Guides',
            backHome: "Retour à l'accueil",
            dashboard: 'Dashboard',
            profile: 'Profil',
            arabic: 'العربية',
            french: 'Français',
            profileTitle: 'Mon profil',
            profileDesc: 'Gérez vos informations personnelles et la sécurité de votre compte.',
        };

        const ar = {
            about: 'حول المنصة',
            universities: 'الجامعات',
            guides: 'الأدلة',
            backHome: 'العودة إلى الرئيسية',
            dashboard: 'لوحة القيادة',
            profile: 'الملف الشخصي',
            arabic: 'العربية',
            french: 'Français',
            profileTitle: 'ملفي الشخصي',
            profileDesc: 'قم بإدارة معلوماتك الشخصية وأمان حسابك.',
        };

        return isArabic ? ar : fr;
    }, [isArabic]);

    const universities = [
        { name: 'Université Mohammed V – Rabat', link: 'http://www.um5.ac.ma/um5/' },
        { name: 'Université Hassan II – Casablanca', link: 'http://www.uh2c.ac.ma/' },
        { name: 'Université Cadi Ayyad – Marrakech', link: 'http://www.uca.ma' },
        { name: 'Université Sidi Mohammed Ben Abdellah – Fès', link: 'http://www.usmba.ac.ma/' },
        { name: 'Université Al Quaraouiyine – Fès', link: 'http://www.uaq.ma' },
        { name: 'Université Moulay Ismail – Meknès', link: 'http://www.umi.ac.ma' },
        { name: 'Université Hassan Premier – Settat', link: 'http://www.uh1.ac.ma/' },
        { name: 'Université Abdelmalek Essaadi – Tétouan', link: 'http://www.uae.ma/' },
        { name: 'Université Ibn Zohr – Agadir', link: 'http://www.uiz.ac.ma' },
        { name: 'Université Chouaïb Doukkali - El Jadida', link: 'http://www.ucd.ac.ma' },
        { name: 'Université Mohammed Premier – Oujda', link: 'http://www.ump.ma/' },
        { name: 'Université Ibn Tofail – Kénitra', link: 'http://www.univ-ibntofail.ac.ma' },
        { name: 'Université Sultan Moulay Slimane – Béni Mellal', link: 'http://www.usms.ac.ma/' },
        { name: 'Université Al Akhawayn – Ifrane', link: 'http://www.aui.ma/en/' },
    ];

    return (
        <>
            <Head title={t.profile} />

            <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-[#f6f8fc]">
                <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-4">
                                <img
                                    src="/images/logo-ministere.png"
                                    alt="Ministère"
                                    className="h-11 rounded-xl bg-white p-1.5 shadow-sm"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                                <div className="h-9 w-px bg-slate-200"></div>
                                <img
                                    src="/images/logo-aneaq.png"
                                    alt="ANEAQ"
                                    className="h-11 rounded-xl bg-white p-1.5 shadow-sm"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </Link>

                            <div className="hidden xl:flex items-center gap-8 text-sm font-semibold text-slate-700">
                                <Link href="/" className="transition hover:text-blue-600">
                                    {t.about}
                                </Link>

                                <div className="relative group">
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 transition hover:text-blue-600"
                                    >
                                        {t.universities} <ChevronDown size={16} />
                                    </button>

                                    <div className="absolute left-0 top-full hidden w-[640px] rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl group-hover:block">
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                            {universities.map((u, i) => (
                                                <a
                                                    key={i}
                                                    href={u.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between rounded-xl border-b border-slate-50 p-2.5 text-sm font-medium transition hover:bg-blue-50 hover:text-blue-700"
                                                >
                                                    <span className="truncate pr-2">{u.name}</span>
                                                    <ExternalLink
                                                        size={14}
                                                        className="shrink-0 text-blue-400"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Link href="/" className="transition hover:text-blue-600">
                                    {t.guides}
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => router.post(`/language/${isArabic ? 'fr' : 'ar'}`)}
                                className="hidden md:flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                            >
                                <Globe size={16} />
                                {isArabic ? t.french : t.arabic}
                            </button>

                            <div className="hidden lg:flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                                {user?.name || 'Utilisateur'}
                            </div>

                            <Link
                                href="/dashboard"
                                className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                            >
                                {t.dashboard}
                            </Link>

                            <Link
                                href="/"
                                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                            >
                                {t.backHome}
                            </Link>
                        </div>
                    </div>
                </header>

                <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] bg-gradient-to-r from-[#13255c] to-[#223983] p-8 text-white shadow-xl shadow-blue-950/10">
                        <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-200">
                            {t.profile}
                        </p>
                        <h1 className="mt-3 text-3xl font-black">{t.profileTitle}</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">
                            {t.profileDesc}
                        </p>
                    </div>
                </section>

                <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>

                        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                            <UpdatePasswordForm />
                        </div>

                        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                            <DeleteUserForm />
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}