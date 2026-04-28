import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    ChevronDown,
    Globe,
    Layers3,
    LogOut,
    Save,
    User,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Create() {
    const { props } = usePage();
    const auth = props.auth || {};
    const locale = props.locale || 'fr';
    const isArabic = locale === 'ar';

    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const form = useForm({
        annee: new Date().getFullYear().toString(),
        vocation: '',
        observation: '',
    });

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
            arabic: 'العربية',
            french: 'Français',
            profile: 'Voir le profil',
            logout: 'Se déconnecter',
            dashboard: 'Dashboard DEE',

            pageBadge: "Vagues d’évaluation",
            pageTitle: 'Créer une nouvelle vague',
            pageDesc:
                "Renseignez les informations principales afin de créer une vague d’évaluation et organiser les établissements concernés.",

            year: 'Année',
            vocation: 'Vocation des établissements',
            observation: 'Observation',

            yearPlaceholder: 'Ex : 2026',
            vocationPlaceholder: "Ex : Universités publiques, écoles d’ingénieurs...",
            observationPlaceholder:
                'Contexte de la vague, objectifs, consignes DEE, remarques générales...',

            formBadge: 'Formulaire principal',
            formTitle: 'Informations de la vague',
            formDesc:
                'Ces informations seront utilisées pour identifier la vague et suivre son processus d’évaluation.',

            createWave: 'Créer la vague',
            backToList: 'Retour aux vagues',

            selectedYear: 'Année sélectionnée',
            initialStatus: 'Statut initial',
            activeAfterCreation: 'Active après création',

            footerNavigation: 'Navigation',
            footerContact: 'Contact',
            rights: '© 2026 ANEAQ - Division de l’Evaluation des Etablissements. Tous droits réservés.',
        };

        const ar = {
            about: 'حول المنصة',
            universities: 'الجامعات',
            guides: 'الأدلة',
            arabic: 'العربية',
            french: 'Français',
            profile: 'الملف الشخصي',
            logout: 'تسجيل الخروج',
            dashboard: 'لوحة القيادة',

            pageBadge: 'حملات التقييم',
            pageTitle: 'إنشاء حملة تقييم جديدة',
            pageDesc:
                'قم بإدخال المعلومات الأساسية لإنشاء حملة تقييم وتنظيم المؤسسات المعنية.',

            year: 'السنة',
            vocation: 'طبيعة المؤسسات',
            observation: 'ملاحظة',

            yearPlaceholder: 'مثال: 2026',
            vocationPlaceholder: 'مثال: الجامعات العمومية، مدارس المهندسين...',
            observationPlaceholder:
                'سياق الحملة، الأهداف، التعليمات، والملاحظات العامة...',

            formBadge: 'الاستمارة الرئيسية',
            formTitle: 'معلومات الحملة',
            formDesc:
                'سيتم استخدام هذه المعلومات لتحديد الحملة وتتبع مراحل التقييم.',

            createWave: 'إنشاء الحملة',
            backToList: 'العودة إلى الحملات',

            selectedYear: 'السنة المختارة',
            initialStatus: 'الحالة الأولية',
            activeAfterCreation: 'نشطة بعد الإنشاء',

            footerNavigation: 'التنقل',
            footerContact: 'اتصل بنا',
            rights: '© 2026 الوكالة الوطنية - مديرية تقييم المؤسسات. جميع الحقوق محفوظة.',
        };

        return isArabic ? ar : fr;
    }, [isArabic]);

    const universities = [
        { name: 'Université Mohammed V – Rabat', link: 'http://www.um5.ac.ma/um5/' },
        { name: 'Université Hassan II – Casablanca', link: 'http://www.uh2c.ac.ma/' },
        { name: 'Université Cadi Ayyad – Marrakech', link: 'http://www.uca.ma' },
        { name: 'Université Sidi Mohammed Ben Abdellah – Fès', link: 'http://www.usmba.ac.ma/' },
        { name: 'Université Moulay Ismail – Meknès', link: 'http://www.umi.ac.ma' },
        { name: 'Université Abdelmalek Essaadi – Tétouan', link: 'http://www.uae.ma/' },
    ];

    const submit = (e) => {
        e.preventDefault();

        form.post('/campagnes', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Nouvelle vague - ANEAQ" />

            <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-[#f6f8fc] text-slate-800">
                {/* HEADER */}
                <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-4">
                                <img
                                    src="/images/logo-ministere.png"
                                    alt="Ministère"
                                    className="h-11 rounded-xl bg-white p-1.5 shadow-sm"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />

                                <div className="h-9 w-px bg-slate-200" />

                                <img
                                    src="/images/logo-aneaq.png"
                                    alt="ANEAQ"
                                    className="h-11 rounded-xl bg-white p-1.5 shadow-sm"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </Link>

                            <div className="hidden items-center gap-8 text-sm font-semibold text-slate-700 xl:flex">
                                <Link href="/" className="transition hover:text-blue-600">
                                    {t.about}
                                </Link>

                                <div className="relative group">
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 transition hover:text-blue-600"
                                    >
                                        {t.universities}
                                        <ChevronDown size={16} />
                                    </button>

                                    <div className="absolute left-0 top-full hidden w-[620px] rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl group-hover:block">
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                            {universities.map((u, i) => (
                                                <a
                                                    key={i}
                                                    href={u.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-xl border-b border-slate-50 p-2.5 text-sm font-medium transition hover:bg-blue-50 hover:text-blue-700"
                                                >
                                                    {u.name}
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
                                className="hidden items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white md:flex"
                            >
                                <Globe size={16} />
                                {isArabic ? t.french : t.arabic}
                            </button>

                            {auth?.user && (
                                <>
                                    <div className="relative" ref={menuRef}>
                                        <button
                                            type="button"
                                            onClick={() => setProfileMenuOpen((prev) => !prev)}
                                            className="hidden items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 lg:flex"
                                        >
                                            {auth.user.name}
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
                                        href="/dashboard"
                                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                                    >
                                        {t.dashboard}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    {/* HERO */}
                    <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2636c9] via-[#2673e8] to-[#0ea5c6] p-8 text-white shadow-2xl shadow-blue-900/20 md:p-10">
                        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.32em] text-blue-100">
                                    {t.pageBadge}
                                </p>

                                <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                                    {t.pageTitle}
                                </h1>

                                <p className="mt-5 max-w-3xl text-sm font-medium leading-8 text-blue-50/90">
                                    {t.pageDesc}
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <button
                                        type="button"
                                        onClick={() => router.visit('/campagnes')}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#223270] transition hover:bg-blue-50"
                                    >
                                        <ArrowLeft size={18} />
                                        {t.backToList}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={submit}
                                        disabled={form.processing}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-60"
                                    >
                                        <Save size={18} />
                                        {t.createWave}
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <HeroCard
                                    icon={CalendarDays}
                                    label={t.selectedYear}
                                    value={form.data.annee || '—'}
                                />

                                <HeroCard
                                    icon={Layers3}
                                    label={t.initialStatus}
                                    value={t.activeAfterCreation}
                                />

                                <div className="rounded-[1.5rem] bg-white/12 p-5 backdrop-blur sm:col-span-2">
                                    <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-100">
                                        {t.vocation}
                                    </p>

                                    <p className="mt-3 break-words text-sm font-black leading-6 text-white">
                                        {form.data.vocation || '—'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FORMULAIRE */}
                    <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 px-7 py-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <Layers3 size={26} />
                                </div>

                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-600">
                                        {t.formBadge}
                                    </p>

                                    <h2 className="mt-1 text-2xl font-black text-blue-950">
                                        {t.formTitle}
                                    </h2>

                                    <p className="mt-1 text-sm leading-7 text-slate-500">
                                        {t.formDesc}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="p-7">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <Label>{t.year}</Label>
                                    <Input
                                        type="text"
                                        value={form.data.annee}
                                        onChange={(e) => form.setData('annee', e.target.value)}
                                        placeholder={t.yearPlaceholder}
                                    />
                                    <Error message={form.errors.annee} />
                                </div>

                                <div>
                                    <Label>{t.vocation}</Label>
                                    <Input
                                        type="text"
                                        value={form.data.vocation}
                                        onChange={(e) => form.setData('vocation', e.target.value)}
                                        placeholder={t.vocationPlaceholder}
                                    />
                                    <Error message={form.errors.vocation} />
                                </div>

                                <div className="md:col-span-2">
                                    <Label>{t.observation}</Label>
                                    <Textarea
                                        rows={7}
                                        value={form.data.observation}
                                        onChange={(e) => form.setData('observation', e.target.value)}
                                        placeholder={t.observationPlaceholder}
                                    />
                                    <Error message={form.errors.observation} />
                                </div>
                            </div>

                            <div className="mt-8 flex flex-wrap justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.visit('/campagnes')}
                                    className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
                                >
                                    {t.backToList}
                                </button>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-[#223270] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#1b285a] disabled:opacity-60"
                                >
                                    <Save size={18} />
                                    {form.processing ? '...' : t.createWave}
                                </button>
                            </div>
                        </form>
                    </section>
                </main>

                {/* FOOTER */}
                <footer className="mt-10 bg-blue-950 pb-8 pt-20 text-white md:pt-24">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="mb-16 grid gap-12 border-b border-white/10 pb-16 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <span className="mb-6 flex items-center gap-3 text-3xl font-black tracking-tighter">
                                    <img
                                        src="/images/logo-aneaq.png"
                                        alt="ANEAQ"
                                        className="h-10 rounded bg-white p-1"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                    ANEAQ
                                </span>

                                <p className="text-sm leading-relaxed text-blue-200/70">
                                    Agence Nationale d’Evaluation et d’Assurance Qualité de
                                    l’Enseignement Supérieur et de la Recherche Scientifique.
                                </p>
                            </div>

                            <div>
                                <h4 className="mb-6 text-lg font-bold text-white">
                                    {t.footerNavigation}
                                </h4>

                                <ul className="space-y-4 text-sm font-medium text-blue-200/70">
                                    <li>
                                        <Link href="/dashboard" className="transition hover:text-white">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/campagnes" className="transition hover:text-white">
                                            Vagues
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/etablissements" className="transition hover:text-white">
                                            Établissements
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/experts" className="transition hover:text-white">
                                            Experts
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/dossiers" className="transition hover:text-white">
                                            Dossiers
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/workflow/visites" className="transition hover:text-white">
                                            Visites
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div className="lg:col-span-2">
                                <h4 className="mb-6 text-lg font-bold text-white">
                                    {t.footerContact}
                                </h4>

                                <div className="grid gap-8 sm:grid-cols-2">
                                    <div className="space-y-5 text-sm text-blue-200/70">
                                        <p>
                                            05 Street Abou Inan Hassan,
                                            <br />
                                            Rabat - Morocco
                                        </p>
                                        <p>contact@aneaq.ma</p>
                                    </div>

                                    <div className="space-y-5 text-sm text-blue-200/70">
                                        <p dir="ltr">+212 537 27 16 08</p>
                                        <p dir="ltr">+212 537 27 16 07</p>
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

function HeroCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-[1.5rem] bg-white/12 p-5 backdrop-blur">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Icon size={22} />
            </div>

            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-100">
                {label}
            </p>

            <p className="mt-3 break-words text-sm font-black leading-6 text-white">
                {value}
            </p>
        </div>
    );
}

function Label({ children }) {
    return (
        <label className="mb-2 block text-sm font-bold text-slate-700">
            {children}
        </label>
    );
}

function Input(props) {
    return (
        <input
            {...props}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
    );
}

function Textarea(props) {
    return (
        <textarea
            {...props}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
    );
}

function Error({ message }) {
    if (!message) return null;

    return (
        <p className="mt-2 text-sm font-semibold text-red-600">
            {message}
        </p>
    );
}