import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Building2,
    CalendarDays,
    ChevronDown,
    ClipboardCheck,
    Clock3,
    ExternalLink,
    FileText,
    Globe,
    LogOut,
    Mail,
    MapPin,
    Phone,
    Printer,
    TrendingUp,
    User,
    Users,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function AdminDashboard({
    auth,
    stats = {},
    experts = [],
    etablissements = [],
    alerts = [],
    activities = [],
}) {
    const { props } = usePage();
    const locale = props.locale || 'fr';
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
            realTimeIndicators: 'Indicateurs en Temps Réel',
            realTimeOverview: "Vue d'ensemble des indicateurs en temps réel",
            etablissements: 'Etablissements',
            experts: 'Experts',
            dossiers: 'Dossiers',
            rapports: 'Rapports',
            visites: 'Visites',
            recommandations: 'Recommandations',
            structures: 'Structures engagees',
            evaluateurs: 'Evaluateurs mobilises',
            affectations: 'Affectations en cours',
            livrables: 'Livrables consolides',
            sessions: 'Sessions programmees',
            actionsSuivi: 'Actions de suivi',
            seeDetail: 'Voir le detail',
            pilotage: 'Pilotage',
            campaignTitle: 'Gestion des campagnes d evaluation',
            campaignDesc:
                'Accedez rapidement aux etapes cles du workflow DEE dans un espace plus clair, plus professionnel et plus moderne.',
            utilisateur: 'Utilisateur',
            activite: 'Activite',
            dashboardWorkflow: 'Workflow du dashboard',
            mainActions: 'Actions principales',
            quickNavigation: 'Navigation rapide',
            manageEtablissements: 'Gerer les etablissements',
            manageExperts: 'Gerer les experts',
            selectEtablissements: 'Selection des etablissements',
            selectExperts: 'Selection des experts',
            committee: 'Constitution du comite',
            assignDossiers: 'Affectation des dossiers',
            planVisits: 'Organisation des visites',
            followRecommendations: 'Suivi des recommandations',
            alerts: 'Alertes',
            pointsAttention: "Points d attention",
            activities: 'Activites',
            latestOperations: 'Dernieres operations',
            etabList: 'Liste des etablissements',
            expertList: 'Liste des experts',
            seeAll: 'Voir tous',
            name: 'Nom',
            city: 'Ville',
            university: 'Universite',
            email: 'Email',
            noEtab: 'Aucun etablissement trouve.',
            noExpert: 'Aucun expert trouve.',
            noHistory: 'Aucun historique disponible.',
            quickLinks: 'Liens rapides',
            adminDashboard: 'Dashboard administrateur',
            contactUs: 'Contactez-nous',
            rights: '© 2026 ANEAQ - Division de l Evaluation des Etablissements. Tous droits reserves.',
            profile: 'Voir le profil',
            logout: 'Se déconnecter',
            reportValid: 'Rapport valide pour un etablissement.',
            newExpert: 'Un nouvel expert a ete ajoute.',
            visitPlanned: 'Une visite a ete planifiee par le coordinateur.',
            alert1: '3 dossiers sont encore incomplets.',
            alert2: '2 experts n ont pas encore confirme leur participation.',
            alert3: '1 visite reste a programmer cette semaine.',
        };

        const ar = {
            about: 'حول المنصة',
            universities: 'الجامعات',
            guides: 'الأدلة',
            backHome: 'العودة إلى الرئيسية',
            arabic: 'العربية',
            french: 'Français',
            realTimeIndicators: 'مؤشرات آنية',
            realTimeOverview: 'نظرة عامة على المؤشرات الآنية',
            etablissements: 'المؤسسات',
            experts: 'الخبراء',
            dossiers: 'الملفات',
            rapports: 'التقارير',
            visites: 'الزيارات',
            recommandations: 'التوصيات',
            structures: 'المؤسسات المنخرطة',
            evaluateurs: 'الخبراء المعتمدون',
            affectations: 'الملفات الموزعة',
            livrables: 'التقارير المجمعة',
            sessions: 'الزيارات المبرمجة',
            actionsSuivi: 'إجراءات التتبع',
            seeDetail: 'عرض التفاصيل',
            pilotage: 'القيادة',
            campaignTitle: 'تدبير حملات التقييم',
            campaignDesc:
                'يمكنك الولوج بسرعة إلى أهم مراحل عمل مديرية تقييم المؤسسات داخل فضاء أوضح وأكثر مهنية وحداثة.',
            utilisateur: 'المستخدم',
            activite: 'الجهة',
            dashboardWorkflow: 'مسار لوحة القيادة',
            mainActions: 'الإجراءات الرئيسية',
            quickNavigation: 'تنقل سريع',
            manageEtablissements: 'تدبير المؤسسات',
            manageExperts: 'تدبير الخبراء',
            selectEtablissements: 'اختيار المؤسسات',
            selectExperts: 'اختيار الخبراء',
            committee: 'تشكيل اللجنة',
            assignDossiers: 'إسناد الملفات',
            planVisits: 'تنظيم الزيارات',
            followRecommendations: 'تتبع التوصيات',
            alerts: 'تنبيهات',
            pointsAttention: 'نقاط الانتباه',
            activities: 'الأنشطة',
            latestOperations: 'آخر العمليات',
            etabList: 'لائحة المؤسسات',
            expertList: 'لائحة الخبراء',
            seeAll: 'عرض الكل',
            name: 'الاسم',
            city: 'المدينة',
            university: 'الجامعة',
            email: 'البريد الإلكتروني',
            noEtab: 'لا توجد مؤسسات.',
            noExpert: 'لا يوجد خبراء.',
            noHistory: 'لا يوجد سجل متاح.',
            quickLinks: 'روابط سريعة',
            adminDashboard: 'لوحة الإدارة',
            contactUs: 'اتصل بنا',
            rights: '© 2026 الوكالة الوطنية - مديرية تقييم المؤسسات. جميع الحقوق محفوظة.',
            profile: 'عرض الملف الشخصي',
            logout: 'تسجيل الخروج',
            reportValid: 'تم اعتماد تقرير مؤسسة.',
            newExpert: 'تمت إضافة خبير جديد.',
            visitPlanned: 'تمت برمجة زيارة من طرف المنسق.',
            alert1: 'لا تزال 3 ملفات غير مكتملة.',
            alert2: 'هناك خبيران لم يؤكدا مشاركتهما بعد.',
            alert3: 'هناك زيارة واحدة يجب برمجتها هذا الأسبوع.',
        };

        return isArabic ? ar : fr;
    }, [isArabic]);

    const currentAlerts = alerts.length > 0 ? alerts : [t.alert1, t.alert2, t.alert3];

    const currentActivities =
        activities.length > 0
            ? activities
            : [
                  { id: 1, description: t.reportValid },
                  { id: 2, description: t.newExpert },
                  { id: 3, description: t.visitPlanned },
              ];

    const topExperts = experts.slice(0, 10);
    const topEtablissements = etablissements.slice(0, 10);

    const statCards = [
        {
            label: t.etablissements,
            value: stats.etablissements ?? 0,
            icon: Building2,
            iconTone: 'bg-blue-50 text-blue-600',
            accentTone: 'bg-blue-500',
            detail: t.structures,
            route: '/etablissements',
        },
        {
            label: t.experts,
            value: stats.experts ?? 0,
            icon: Users,
            iconTone: 'bg-blue-50 text-blue-600',
            accentTone: 'bg-blue-500',
            detail: t.evaluateurs,
            route: '/experts',
        },
        {
            label: t.dossiers,
            value: stats.dossiers ?? 0,
            icon: ClipboardCheck,
            iconTone: 'bg-blue-50 text-blue-600',
            accentTone: 'bg-blue-500',
            detail: t.affectations,
            route: '/dossiers',
        },
        {
            label: t.rapports,
            value: stats.rapports ?? 0,
            icon: FileText,
            iconTone: 'bg-blue-50 text-blue-600',
            accentTone: 'bg-blue-500',
            detail: t.livrables,
            route: '/dossiers?statut=Rapport%20re%C3%A7u',
        },
        {
            label: t.visites,
            value: stats.visites ?? 0,
            icon: CalendarDays,
            iconTone: 'bg-blue-50 text-blue-600',
            accentTone: 'bg-blue-500',
            detail: t.sessions,
            route: '/workflow/visites',
        },
        {
            label: t.recommandations,
            value: stats.recommandations ?? 0,
            icon: TrendingUp,
            iconTone: 'bg-blue-50 text-blue-600',
            accentTone: 'bg-blue-500',
            detail: t.actionsSuivi,
            route: '/workflow/recommandations',
        },
    ];

    const quickActions = [
        { label: t.manageEtablissements, route: '/etablissements' },
        { label: t.manageExperts, route: '/experts' },
        { label: t.selectEtablissements, route: '/workflow/selection-etablissements' },
        { label: t.selectExperts, route: '/workflow/selection-experts' },
        { label: t.committee, route: '/workflow/comites' },
        { label: t.assignDossiers, route: '/workflow/affectations' },
        { label: t.planVisits, route: '/workflow/visites' },
        { label: t.followRecommendations, route: '/workflow/recommandations' },
    ];

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
            <Head title="Dashboard Administrateur DEE" />
            <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-[#f6f8fc]">

                {/* ─── HEADER ─────────────────────────────────────────────── */}
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

                {/* ─── STATS ──────────────────────────────────────────────── */}
                <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-600">
                                {t.realTimeIndicators}
                            </p>
                            <h3 className="mt-2 text-2xl font-black text-blue-950">
                                {t.realTimeOverview}
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => (window.location.href = '/campagnes/create')}
                            className="group relative flex min-h-[58px] min-w-[280px] items-center justify-center overflow-hidden rounded-[1.3rem] bg-[#223270] px-6 py-4 text-base font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/30 active:scale-95"
                        >
                            <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                                Créer une vague d’évaluation
                            </span>
                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                        </button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {statCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={card.label}
                                    onClick={() => router.visit(card.route)}
                                    className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-50 to-transparent opacity-80" />
                                    <div className={`absolute bottom-0 left-0 h-1 w-full ${card.accentTone}`} />
                                    <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl ${card.iconTone}`}>
                                        <Icon size={30} />
                                    </div>
                                    <p className="relative mt-7 text-sm font-bold uppercase tracking-[0.28em] text-slate-400">
                                        {card.label}
                                    </p>
                                    <div className="relative mt-4">
                                        <p className="text-5xl font-black leading-none text-blue-950 sm:text-6xl">
                                            {card.value}
                                        </p>
                                    </div>
                                    <p className="relative mt-5 text-sm font-medium text-slate-600">
                                        {card.detail}
                                    </p>
                                    <div className="relative mt-6 flex items-center justify-between text-sm">
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                router.visit(card.route);
                                            }}
                                            className="font-semibold text-blue-700"
                                        >
                                            {t.seeDetail}
                                        </button>
                                        <ArrowRight size={18} className="text-blue-700 transition group-hover:translate-x-1" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ─── PILOTAGE / QUICK ACTIONS ───────────────────────────── */}
                <section className="border-y border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="grid gap-8 xl:grid-cols-[1.1fr_1.9fr]">
                            <div className="rounded-[2rem] bg-gradient-to-br from-[#13255c] to-[#223983] p-8 text-white shadow-xl shadow-blue-950/10">
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-100">
                                    {t.pilotage}
                                </p>
                                <h1 className="mt-4 text-3xl font-black leading-tight">
                                    {t.campaignTitle}
                                </h1>
                                <p className="mt-4 text-sm leading-7 text-blue-100">{t.campaignDesc}</p>
                                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                                    <div className="rounded-2xl bg-white/10 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-blue-100">
                                            {t.utilisateur}
                                        </p>
                                        <p className="mt-2 text-lg font-bold">
                                            {auth?.user?.name || 'Administrateur'}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-white/10 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-blue-100">
                                            {t.activite}
                                        </p>
                                        <p className="mt-2 text-lg font-bold">ANEAQ / DEE</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                                <div className="mb-5 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-600">
                                            {t.mainActions}
                                        </p>
                                        <h3 className="mt-2 text-2xl font-black text-blue-950">
                                            {t.dashboardWorkflow}
                                        </h3>
                                    </div>
                                    <div className="hidden md:flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm">
                                        <TrendingUp size={16} className="text-blue-600" />
                                        {t.quickNavigation}
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {quickActions.map((action) => (
                                        <button
                                            key={action.label}
                                            type="button"
                                            onClick={() => router.visit(action.route)}
                                            className="group flex min-h-[84px] items-center justify-between rounded-[1.6rem] bg-[#223270] px-6 py-5 text-left text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1b285a]"
                                        >
                                            <span className="pr-4 leading-6">{action.label}</span>
                                            <ArrowRight size={18} className="shrink-0 transition group-hover:translate-x-0.5" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── ALERTS & ACTIVITIES ────────────────────────────────── */}
                <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="grid gap-8 xl:grid-cols-2">
                        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="text-orange-500" size={22} />
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-500">
                                            {t.alerts}
                                        </p>
                                        <h3 className="mt-1 text-2xl font-black text-blue-950">
                                            {t.pointsAttention}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 p-8">
                                {currentAlerts.map((alert, index) => (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm font-medium text-slate-700"
                                    >
                                        {alert}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <Clock3 className="text-blue-600" size={22} />
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-600">
                                            {t.activities}
                                        </p>
                                        <h3 className="mt-1 text-2xl font-black text-blue-950">
                                            {t.latestOperations}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 p-8">
                                {currentActivities.length > 0 ? (
                                    currentActivities.map((activity, index) => (
                                        <div
                                            key={activity.id ?? index}
                                            className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4"
                                        >
                                            <p className="text-sm font-medium text-slate-700">
                                                {activity.description ?? activity}
                                            </p>
                                            {activity.created_at && (
                                                <p className="mt-2 text-xs text-slate-400">
                                                    {new Date(activity.created_at).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-500">
                                        {t.noHistory}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── ETABLISSEMENTS & EXPERTS TABLES ───────────────────── */}
                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="grid gap-8 xl:grid-cols-2">
                        {/* Etablissements */}
                        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
                                <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-600">
                                    {t.etablissements}
                                </p>
                                <h3 className="mt-2 text-2xl font-black text-blue-950">{t.etabList}</h3>
                            </div>
                            <div className="p-8 pb-4">
                                <div className="max-h-[420px] overflow-y-auto overflow-x-auto pr-2">
                                    <table className="min-w-full text-sm">
                                        <thead className="sticky top-0 z-10 bg-white">
                                            <tr className="border-b border-slate-100 text-left text-slate-400">
                                                <th className="pb-4 pr-4 font-bold">{t.name}</th>
                                                <th className="pb-4 pr-4 font-bold">{t.city}</th>
                                                <th className="pb-4 pr-4 font-bold">{t.university}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topEtablissements.length > 0 ? (
                                                topEtablissements.map((item) => (
                                                    <tr key={item.id} className="border-b border-slate-100 last:border-0">
                                                        <td className="py-4 pr-4 font-semibold text-blue-950">
                                                            {item.etablissement || '-'}
                                                        </td>
                                                        <td className="py-4 pr-4 text-slate-500">
                                                            <span className="inline-flex items-center gap-2">
                                                                <MapPin size={15} className="text-blue-500" />
                                                                {item.ville || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 pr-4 text-slate-500">
                                                            {item.universite || '-'}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="py-8 text-slate-500">
                                                        {t.noEtab}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="flex justify-center px-8 pb-8 pt-2">
                                <button
                                    type="button"
                                    onClick={() => router.visit('/etablissements')}
                                    className="group flex min-h-[58px] min-w-[260px] items-center justify-between rounded-[1.3rem] bg-[#223270] px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1b285a]"
                                >
                                    <span>{t.seeAll}</span>
                                    <ArrowRight size={18} className="shrink-0 transition group-hover:translate-x-0.5" />
                                </button>
                            </div>
                        </div>

                        {/* Experts */}
                        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
                                <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-600">
                                    {t.experts}
                                </p>
                                <h3 className="mt-2 text-2xl font-black text-blue-950">{t.expertList}</h3>
                            </div>
                            <div className="p-8 pb-4">
                                <div className="max-h-[420px] overflow-y-auto overflow-x-auto pr-2">
                                    <table className="min-w-full text-sm">
                                        <thead className="sticky top-0 z-10 bg-white">
                                            <tr className="border-b border-slate-100 text-left text-slate-400">
                                                <th className="pb-4 pr-4 font-bold">{t.name}</th>
                                                <th className="pb-4 pr-4 font-bold">{t.email}</th>
                                                <th className="pb-4 pr-4 font-bold">{t.city}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topExperts.length > 0 ? (
                                                topExperts.map((expert) => (
                                                    <tr key={expert.id} className="border-b border-slate-100 last:border-0">
                                                        <td className="py-4 pr-4 font-semibold text-blue-950">
                                                            {expert.nom} {expert.prenom}
                                                        </td>
                                                        <td className="py-4 pr-4 text-slate-500">
                                                            {expert.email || '-'}
                                                        </td>
                                                        <td className="py-4 pr-4 text-slate-500">
                                                            {expert.ville || '-'}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="py-8 text-slate-500">
                                                        {t.noExpert}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="flex justify-center px-8 pb-8 pt-2">
                                <button
                                    type="button"
                                    onClick={() => router.visit('/experts')}
                                    className="group flex min-h-[58px] min-w-[260px] items-center justify-between rounded-[1.3rem] bg-[#223270] px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1b285a]"
                                >
                                    <span>{t.seeAll}</span>
                                    <ArrowRight size={18} className="shrink-0 transition group-hover:translate-x-0.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── FOOTER ─────────────────────────────────────────────── */}
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
                                            {t.etablissements}
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => router.visit('/experts')}
                                            className="transition hover:text-white"
                                        >
                                            {t.experts}
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
        </>
    );
}
