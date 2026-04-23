import { Link, router, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    ExternalLink,
    Globe,
    LogOut,
    Mail,
    MapPin,
    Phone,
    Printer,
    User,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function DashboardShell({ title, subtitle, action, children }) {
    const { props } = usePage();
    const locale = props.locale || 'fr';
    const auth = props.auth || {};
    const isArabic = locale === 'ar';

    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const t = useMemo(() => {
        const fr = {
            about: 'À propos',
            universities: 'Universités',
            guides: 'Guides',
            backHome: "Retour à l'accueil",
            arabic: 'العربية',
            french: 'Français',
            quickLinks: 'Liens rapides',
            adminDashboard: 'Dashboard administrateur',
            campagnes: 'Vagues d’évaluation',
            dossiers: 'Dossiers',
            onboarding: 'Espace établissement',
            contactUs: 'Contactez-nous',
            rights:
                '© 2026 ANEAQ - Division de l Evaluation des Etablissements. Tous droits réservés.',
            profile: 'Voir le profil',
            logout: 'Se déconnecter',
        };

        const ar = {
            about: 'حول المنصة',
            universities: 'الجامعات',
            guides: 'الأدلة',
            backHome: 'العودة إلى الرئيسية',
            arabic: 'العربية',
            french: 'Français',
            quickLinks: 'روابط سريعة',
            adminDashboard: 'لوحة الإدارة',
            campagnes: 'حملات التقييم',
            dossiers: 'الملفات',
            onboarding: 'فضاء المؤسسة',
            contactUs: 'اتصل بنا',
            rights:
                '© 2026 الوكالة الوطنية - مديرية تقييم المؤسسات. جميع الحقوق محفوظة.',
            profile: 'عرض الملف الشخصي',
            logout: 'تسجيل الخروج',
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
                                <button type="button" className="flex items-center gap-1 transition hover:text-blue-600">
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
                                                <ExternalLink size={14} className="shrink-0 text-blue-400" />
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

                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setProfileMenuOpen((prev) => !prev)}
                                className="hidden lg:flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600"
                            >
                                {auth?.user?.name || 'Administrateur'}
                                <ChevronDown size={16} />
                            </button>

                            {profileMenuOpen && (
                                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <User size={18} />
                                        {t.profile}
                                    </Link>

                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                    >
                                        <LogOut size={18} />
                                        {t.logout}
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/"
                            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                        >
                            {t.backHome}
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {(title || subtitle || action) && (
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <div>
                            {subtitle && (
                                <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-600">
                                    {subtitle}
                                </p>
                            )}
                            {title && (
                                <h1 className="mt-2 text-3xl font-black text-slate-900">
                                    {title}
                                </h1>
                            )}
                        </div>
                        {action}
                    </div>
                )}

                {children}
            </main>

            <footer className="bg-blue-950 pb-8 pt-20 text-white md:pt-24">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-16 grid gap-12 border-b border-white/10 pb-16 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="lg:col-span-1">
                            <span className="mb-6 flex items-center gap-3 text-3xl font-black tracking-tighter">
                                <img
                                    src="/images/logo-aneaq.png"
                                    alt="ANEAQ"
                                    className="h-10 rounded bg-white p-1"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                                ANEAQ
                            </span>
                            <p className="text-sm leading-relaxed text-blue-200/70">
                                Agence Nationale d Evaluation et d Assurance Qualite de
                                l Enseignement Superieur et de la Recherche Scientifique.
                            </p>
                        </div>

                        <div>
                            <h4 className="mb-6 text-lg font-bold text-white">{t.quickLinks}</h4>
                            <ul className="space-y-4 text-sm font-medium text-blue-200/70">
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => router.visit('/dashboard')}
                                        className="transition hover:text-white"
                                    >
                                        {t.adminDashboard}
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => router.visit('/campagnes')}
                                        className="transition hover:text-white"
                                    >
                                        {t.campagnes}
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => router.visit('/dossiers')}
                                        className="transition hover:text-white"
                                    >
                                        {t.dossiers}
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => router.visit('/etablissement/premier-formulaire')}
                                        className="transition hover:text-white"
                                    >
                                        {t.onboarding}
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="lg:col-span-2">
                            <h4 className="mb-6 text-lg font-bold text-white">{t.contactUs}</h4>
                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="space-y-5">
                                    <div className="flex items-start gap-4 text-sm text-blue-200/70">
                                        <MapPin className="mt-0.5 shrink-0 text-blue-400" size={20} />
                                        <span className="leading-relaxed">
                                            05 Street Abou Inan Hassan,
                                            <br />
                                            Rabat - Morocco
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-blue-200/70">
                                        <Mail className="shrink-0 text-blue-400" size={20} />
                                        <a href="mailto:contact@aneaq.ma" className="transition hover:text-white">
                                            contact@aneaq.ma
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex items-center gap-4 text-sm text-blue-200/70">
                                        <Phone className="shrink-0 text-blue-400" size={20} />
                                        <span dir="ltr">+212 537 27 16 08</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-blue-200/70">
                                        <Printer className="shrink-0 text-blue-400" size={20} />
                                        <span dir="ltr">+212 537 27 16 07</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-xs font-semibold uppercase tracking-wider text-blue-200/40">
                        <p>{t.rights}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
