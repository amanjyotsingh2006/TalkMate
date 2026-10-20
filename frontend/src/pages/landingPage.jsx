
import React, { useState } from "react";
import {
    ArrowRight,
    Play,
    Menu,
    X,
    Video,
    MessageCircle,
    Users,
    Trophy,
    Check,
    Globe,
    ShieldCheck,
    Mic,
    Star,
    Languages,
    Sparkles,
} from "lucide-react";
import { Link } from "react-router";

const img = (id) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

const partners = [
    {
        name: "Zéna Moreau",
        location: "Paris, France",
        role: "Literature & Music",
        languages: ["French (Native)", "English (B2)"],
        image: "photo-1534528741775-53994a69daeb",
    },
    {
        name: "Matteo Silva",
        location: "Madrid, Spain",
        role: "Architect & Travel Photographer",
        languages: ["Spanish (Native)", "English (C1)"],
        image: "photo-1500648767791-00dcc994a43e",
        featured: true,
    },
    {
        name: "Yuki Tanaka",
        location: "Tokyo, Japan",
        role: "Product Designer & Tea Specialist",
        languages: ["Japanese (Native)", "Spanish (B1)"],
        image: "photo-1531123897727-8f129e1688ce",
    },
];

const features = [
    {
        number: "PILLAR 01",
        icon: Video,
        title: "Real-Time 1-on-1 Video Calling",
        description:
            "Practice with native speakers through high-quality video calls, synchronized transcripts, subtitles, and interactive feedback.",
        footer: "Global 1-on-1 sessions",
    },
    {
        number: "PILLAR 02",
        icon: MessageCircle,
        title: "Smart AI-Assisted Chat",
        description:
            "Get grammar suggestions, contextual sentence prompts, and real-time translation to make every conversation productive.",
        footer: "AI sentence coach",
    },
    {
        number: "PILLAR 03",
        icon: Users,
        title: "Intelligent Partner Matching",
        description:
            "Find compatible language partners based on your interests, target language, proficiency level, and learning goals.",
        footer: "Personalized matching",
    },
    {
        number: "PILLAR 04",
        icon: Trophy,
        title: "Gamified Progress & Streaks",
        description:
            "Track your speaking hours, daily practice, vocabulary progress, and achievements as your confidence grows.",
        footer: "Progress tracking",
    },
];

const testimonials = [
    {
        quote:
            "After years of language apps, I finally started speaking Italian confidently. My weekly conversations helped me improve faster than I expected.",
        name: "Claire Montgomery",
        detail: "English → Italian",
        image: "photo-1544005313-94ddf0286df2",
    },
    {
        quote:
            "The conversation prompts make speaking German less intimidating. I can learn naturally without constantly interrupting the flow of a conversation.",
        name: "Julian Reinhardt",
        detail: "English → German",
        image: "photo-1506794778202-cad84cf45f1d",
    },
    {
        quote:
            "Streamify helped me connect with people around the world. I have improved my Korean and made genuine friendships along the way.",
        name: "Daniel K. Chen",
        detail: "English → Korean",
        image: "photo-1507003211169-0a1dd7228f2d",
    },
];

const container = "mx-auto w-full  px-5 sm:px-8 lg:px-10";

const buttonGreen =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#91e98a] px-5 py-3 text-xs font-bold text-[#111a10] transition hover:bg-[#adf5a5] hover:-translate-y-0.5";

const buttonOutline =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-[#30382c] bg-white/[0.02] px-5 py-3 text-xs font-medium text-[#efefe9] transition hover:border-[#91e98a]/50 hover:bg-white/[0.05]";

function Brand() {
    return (
        <a href="#home" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-[#35432e] bg-[#192019] text-[#91e98a]">
                <Globe size={20} />
            </span>
            <span>
                <span className="block text-base font-bold leading-tight tracking-tight text-[#91e98a]">
                    Streamify
                </span>
                <span className="block text-[8px] tracking-[1.2px] text-[#a4aa9b]">
                    Connect. Talk. Share.
                </span>
            </span>
        </a>
    );
}

function Navbar() {
    const [open, setOpen] = useState(false);

    const links = [
        ["How It Works", "#how-it-works"],
        ["Features", "#features"],
        ["Community", "#community"],
        ["Stories", "#stories"],
        ["Pricing", "#join"],
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0c0e0a]/95 backdrop-blur-xl">
            <nav className={`${container} flex min-h-[72px] items-center justify-between gap-5`}>
                <Brand />

                <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-xl border border-[#30382c] text-white md:hidden"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle navigation"
                    aria-expanded={open}
                >
                    {open ? <X size={21} /> : <Menu size={21} />}
                </button>

                <div
                    className={`${open ? "flex" : "hidden"
                        } absolute left-0 right-0 top-full flex-col gap-1 border-b border-[#30382c] bg-[#10130e] p-5 shadow-2xl md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
                >
                    {links.map(([label, href]) => (
                        <a
                            key={label}
                            href={href}
                            onClick={() => setOpen(false)}
                            className="rounded-lg px-3 py-2.5 text-xs text-[#d0d2c8] transition hover:text-[#91e98a] md:px-0"
                        >
                            {label}
                        </a>
                    ))}

                    {/* <a
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="px-3 py-2.5 text-xs text-[#d0d2c8] hover:text-white md:px-0"
                    >
                        Log in
                    </a> */}

                    <a
                        href="/login"
                        onClick={() => setOpen(false)}
                        className={`${buttonGreen} md:mt-0 md:rounded-full md:px-4 md:py-2.5 w-16 flex items-center justify-center`}
                    >
                        Login
                    </a>

                    <a
                        href="/signup"
                        onClick={() => setOpen(false)}
                        className={`${buttonGreen} mt-2 md:mt-0 md:rounded-full md:px-4 md:py-2.5`}
                    >
                        Get Started Free <ArrowRight size={14} />
                    </a>
                </div>
            </nav>
        </header>
    );
}

function VideoPreview() {
    return (
        <div className="relative mx-auto w-full max-w-[550px]">
            <div className="rounded-2xl border border-[#374532] bg-gradient-to-br from-[#20281d] to-[#11150f] p-3 shadow-2xl shadow-black/30 sm:p-5">
                <div className="flex items-center justify-between gap-3 pb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={img("photo-1534528741775-53994a69daeb")}
                            alt="Language partner"
                            className="h-10 w-10 rounded-xl object-cover"
                        />
                        <div>
                            <p className="text-xs font-semibold text-white">Elena Rossi</p>
                            <p className="mt-1 text-[10px] text-[#a5ac9d]">
                                Italian · B2 to C1
                            </p>
                        </div>
                    </div>

                    <span className="flex items-center gap-2 text-[10px] text-white">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-[#91e98a]" />
                        LIVE SESSION
                    </span>
                </div>

                <div className="relative aspect-[1.2/1] overflow-hidden rounded-xl border border-[#343d2e] bg-[#20281d] sm:aspect-[1.35/1]">
                    <img
                        src={img("photo-1521737711867-e3b97375f902")}
                        alt="People practising a language together"
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70" />

                    <div className="absolute left-3 right-3 top-3 rounded-lg border border-[#91e98a]/30 bg-[#0c100c]/85 p-3 backdrop-blur-md sm:left-4 sm:right-4 sm:top-4">
                        <span className="text-[9px] font-bold tracking-wider text-[#91e98a]">
                            AI LIVE TRANSLATION
                        </span>
                        <p className="mt-1 text-xs text-white">
                            Let's practice speaking naturally.
                        </p>
                    </div>

                    <div className="absolute bottom-14 right-3 h-24 w-[25%] overflow-hidden rounded-lg border border-[#91e98a] bg-[#172018] p-0.5 sm:bottom-16 sm:right-4 sm:h-32">
                        <img
                            src={img("photo-1534528741775-53994a69daeb")}
                            alt="Video call participant"
                            className="h-full w-full rounded-md object-cover"
                        />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 sm:bottom-4 sm:left-4 sm:right-4 sm:gap-2">
                        <span className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/70 px-2 py-2 text-[9px] text-white sm:px-3">
                            <Mic size={12} /> Mic
                        </span>
                        <span className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/70 px-2 py-2 text-[9px] text-white sm:px-3">
                            <Video size={12} /> Camera
                        </span>
                        <span className="ml-auto rounded-lg bg-[#69312f] px-2 py-2 text-[9px] text-white sm:px-3">
                            End Call
                        </span>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] text-[#c6cbbd] sm:text-[10px]">
                    <span className="flex items-center gap-1.5">
                        <Languages size={13} className="text-[#91e98a]" />
                        Italian · English
                    </span>
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-[#91e98a]" />
                        AI Assistance
                    </span>
                    <span className="ml-auto text-[#91e98a]">98% Match</span>
                </div>
            </div>

            <div className="absolute -bottom-7 right-0 flex items-center gap-3 rounded-xl border border-[#374532] bg-[#191f16] p-3 shadow-xl sm:-right-5 sm:p-4">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#293b26] text-[#91e98a]">
                    <Check size={18} />
                </span>
                <div>
                    <p className="text-[10px] font-semibold text-white">
                        You're improving!
                    </p>
                    <p className="mt-1 text-[9px] text-[#a4aa9b]">
                        12 minutes of speaking today
                    </p>
                </div>
            </div>
        </div>
    );
}

function Hero() {
    return (
        <section
            id="home"
            className="relative overflow-hidden bg-[radial-gradient(ellipse_at_78%_45%,rgba(55,82,45,0.15),transparent_38%)]"
        >
            <div
                className={`${container} grid items-center gap-16 py-20 sm:py-24 lg:grid-cols-2 lg:gap-14 lg:py-32`}
            >
                <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#34412d] bg-[#182017]/70 px-3 py-2 text-[9px] font-semibold tracking-wide text-[#91e98a]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#91e98a]" />
                        LIVE GLOBAL LANGUAGE EXCHANGE
                    </span>

                    <h1 className="mt-7 max-w-2xl font-serif text-[clamp(2.6rem,5.2vw,4.5rem)] font-semibold leading-[1.08] tracking-tight text-[#f2f1eb]">
                        Master Any Language Through{" "}
                        <span className="italic text-[#91e98a]">
                            Genuine Human Connection.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-sm leading-8 text-[#b5b8ad] sm:text-[15px]">
                        Ditch the robotic flashcards. Practice speaking with native
                        partners worldwide via crystal-clear HD video, live translated
                        messaging, and AI pronunciation insights.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <a href="#join" className={buttonGreen}>
                            Start Practicing Free <ArrowRight size={15} />
                        </a>
                        <a href="#how-it-works" className={buttonOutline}>
                            <Play size={14} /> Watch How It Works
                        </a>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <div className="flex -space-x-3">
                            {[
                                "photo-1534528741775-53994a69daeb",
                                "photo-1500648767791-00dcc994a43e",
                                "photo-1531123897727-8f129e1688ce",
                                "photo-1506794778202-cad84cf45f1d",
                            ].map((id) => (
                                <img
                                    key={id}
                                    src={img(id)}
                                    alt=""
                                    className="h-9 w-9 rounded-full border-2 border-[#0c0e0a] object-cover"
                                />
                            ))}
                            <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#0c0e0a] bg-[#273424] text-[9px] font-bold text-[#91e98a]">
                                +140
                            </span>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <span className="tracking-[2px] text-[#91e98a]">★★★★★</span>
                                <span className="text-[11px] font-bold text-white">4.9/5</span>
                            </div>
                            <p className="mt-1 text-[10px] text-[#a5a99d]">
                                Trusted by learners across 40+ countries
                            </p>
                        </div>
                    </div>
                </div>

                <div id="how-it-works" className="py-5">
                    <VideoPreview />
                </div>
            </div>
        </section>
    );
}

function SectionHeading({ eyebrow, title, description }) {
    return (
        <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-[10px] font-bold tracking-[1.5px] text-[#91e98a]">
                {eyebrow}
            </span>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#f0efe9] sm:text-4xl">
                {title}
            </h2>
            {description && (
                <p className="mx-auto mt-4 max-w-xl text-xs leading-7 text-[#a6aa9e] sm:text-sm">
                    {description}
                </p>
            )}
        </div>
    );
}

function Features() {
    return (
        <section id="features" className="border-y border-white/[0.03] bg-[#0a0c08] py-20 sm:py-24">
            <div className={container}>
                <SectionHeading
                    eyebrow="THE STREAMIFY METHOD"
                    title="Engineered for Fluency, Built for Real Connection"
                    description="Traditional tools treat languages like vocabulary lists. Streamify treats languages like living, breathing conversations between cultured minds."
                />

                <div className="grid gap-5 md:grid-cols-2">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <article
                                key={feature.number}
                                className="group flex min-w-0 flex-col rounded-2xl border border-[#292e25] bg-[#151812] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#45533d] sm:p-8"
                            >
                                <div className="grid h-11 w-11 place-items-center rounded-xl border border-[#343d2e] bg-[#242c20] text-[#91e98a]">
                                    <Icon size={20} />
                                </div>

                                <span className="mt-6 text-[9px] font-bold tracking-wider text-[#91e98a]">
                                    {feature.number}
                                </span>

                                <h3 className="mt-2 font-serif text-xl font-semibold text-[#f1f0e9] sm:text-2xl">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 text-xs leading-7 text-[#adb0a5] sm:text-sm">
                                    {feature.description}
                                </p>

                                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[#2a3026] pt-5 text-[10px] text-[#d0d9ca]">
                                    <Check size={14} className="text-[#91e98a]" />
                                    {feature.footer}
                                    <span className="ml-auto rounded-full bg-[#253222] px-3 py-1.5 text-[9px] text-[#91e98a]">
                                        Streamify
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function Partners() {
    return (
        <section id="community" className="border-b border-white/[0.04] bg-[#11140f] py-20 sm:py-24">
            <div className={container}>
                <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#35412d] px-3 py-1.5 text-[9px] font-semibold text-[#91e98a]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#91e98a]" />
                            OUR COMMUNITY
                        </span>
                        <h2 className="mt-4 max-w-xl font-serif text-3xl font-semibold leading-tight text-[#f0efe9] sm:text-4xl">
                            Meet Active Exchange Partners Right Now
                        </h2>
                    </div>

                    <p className="max-w-sm text-xs leading-7 text-[#a5a99d] sm:text-sm">
                        Hundreds of native speakers are waiting to connect, exchange
                        cultures, and help you become a more confident speaker.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {partners.map((partner) => (
                        <article
                            key={partner.name}
                            className={`relative flex min-w-0 flex-col rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 ${partner.featured
                                    ? "border-[#45563c] bg-gradient-to-br from-[#20291d] to-[#151812]"
                                    : "border-[#292e25] bg-[#171a14] hover:border-[#45533d]"
                                }`}
                        >
                            {partner.featured && (
                                <span className="absolute right-4 top-4 rounded-full bg-[#293d27] px-2.5 py-1 text-[8px] font-bold text-[#91e98a]">
                                    TOP MATCH
                                </span>
                            )}

                            <div className="flex items-start justify-between gap-3">
                                <div className="relative">
                                    <img
                                        src={img(partner.image)}
                                        alt={partner.name}
                                        className="h-14 w-14 rounded-xl border border-[#45533d] object-cover"
                                    />
                                    <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#171a14] bg-[#91e98a]" />
                                </div>
                                <span className="pt-1 text-right text-[9px] text-[#b8baaf]">
                                    {partner.location}
                                </span>
                            </div>

                            <h3 className="mt-5 font-serif text-xl font-semibold text-white">
                                {partner.name}
                            </h3>
                            <p className="mt-1 min-h-5 text-[11px] text-[#a5a99d]">
                                {partner.role}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {partner.languages.map((language) => (
                                    <span
                                        key={language}
                                        className="rounded-md border border-[#35432e] bg-[#20291d] px-2.5 py-1.5 text-[9px] text-[#c3e6b9]"
                                    >
                                        {language}
                                    </span>
                                ))}
                            </div>

                            <p className="my-5 flex-1 border-t border-[#2a3026] pt-4 text-xs leading-6 text-[#b4b7ac]">
                                <Sparkles size={13} className="mr-1 inline text-[#91e98a]" />
                                Looking to practise naturally, exchange culture, and build
                                meaningful connections.
                            </p>

                            <a
                                href="/login"
                                className={`${partner.featured ? buttonGreen : buttonOutline} w-full`}
                            >
                                {partner.featured ? <Play size={14} /> : <MessageCircle size={14} />}
                                {partner.featured
                                    ? "Start Call Now"
                                    : `Connect with ${partner.name.split(" ")[0]}`}
                            </a>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Testimonials() {
    return (
        <section id="stories" className="bg-[#0c0e0a] py-20 sm:py-24">
            <div className={container}>
                <SectionHeading
                    eyebrow="MEMBER JOURNEYS"
                    title="From Hesitant Stutter to Effortless Fluency"
                />

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((item) => (
                        <article
                            key={item.name}
                            className="flex min-w-0 flex-col rounded-2xl border border-[#292e25] bg-[#151812] p-6 transition hover:-translate-y-1 hover:border-[#45533d] sm:p-7"
                        >
                            <div className="flex items-center gap-1 text-[#91e98a]">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={13} fill="currentColor" />
                                ))}
                            </div>

                            <blockquote className="mt-5 flex-1 text-xs leading-7 text-[#d0d2c9] sm:text-sm">
                                “{item.quote}”
                            </blockquote>

                            <div className="mt-6 flex items-center gap-3 border-t border-[#2a3026] pt-5">
                                <img
                                    src={img(item.image)}
                                    alt={item.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-xs font-semibold text-white">{item.name}</p>
                                    <p className="mt-1 text-[10px] text-[#91e98a]">
                                        {item.detail}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function JoinSection() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setMessage("Please enter a valid email address.");
            return;
        }

        setMessage("Email validated! Connect this form to your registration API.");
    }

    return (
        <section id="join" className="bg-[#0c0e0a] px-5 pb-20 sm:px-8 sm:pb-24">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#3b4d34] bg-[radial-gradient(ellipse_at_5%_5%,rgba(115,174,101,0.20),transparent_45%),radial-gradient(ellipse_at_100%_100%,rgba(73,110,120,0.19),transparent_45%),#171b15] px-5 py-12 text-center sm:px-10 sm:py-16 lg:py-20">
                <span className="text-[10px] font-bold tracking-[1.5px] text-[#91e98a]">
                    YOUR JOURNEY BEGINS TODAY
                </span>

                <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#f2f1eb] sm:text-4xl lg:text-5xl">
                    Ready to speak like a native?
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-xs leading-7 text-[#c0c4b8] sm:text-sm">
                    Join Streamify today. Free to get started, no credit card required.
                    Connect with your first language partner and start practising.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-7 w-full flex justify-center items-center"
                >
                    {/* <label className="min-w-0 flex-1">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage("");
              }}
              placeholder="Enter your email address"
              required
              className="h-full min-h-12 w-full rounded-xl border border-[#363d31] bg-[#10130e] px-4 py-3 text-xs text-white outline-none placeholder:text-[#858b7e] focus:border-[#91e98a]"
            />
          </label> */}

                    <Link to={"/signup"}>
                    <button type="submit" className='flex gap-2 justify-center items-center w-60 h-10 rounded-full bg-green-500'>
                        Create Free Account <ArrowRight size={15} />
                    </button>
                    </Link>
                </form>

                {message && (
                    <p role="status" className="mt-4 text-xs text-[#91e98a]">
                        {message}
                    </p>
                )}

                <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[10px] text-[#c0c9b9]">
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-[#91e98a]" />
                        Instant matching
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Check size={13} className="text-[#91e98a]" />
                        No credit card
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Check size={13} className="text-[#91e98a]" />
                        Cancel anytime
                    </span>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    const columns = [
        {
            title: "PRODUCT",
            links: [
                ["How Video Works", "#how-it-works"],
                ["Live AI Subtitles", "#features"],
                ["Smart Partner Matching", "#community"],
                ["Mobile iOS & Android", "#features"],
            ],
        },
        {
            title: "COMMUNITY",
            links: [
                ["Global Lounge", "#community"],
                ["Member Stories", "#stories"],
                ["Culture Exchange", "#community"],
                ["Community Guidelines", "#community"],
            ],
        },
        {
            title: "RESOURCES",
            links: [
                ["Help & Documentation", "#join"],
                ["FAQs & Guidelines", "#join"],
                ["Privacy Policy", "#join"],
                ["Terms of Service", "#join"],
            ],
        },
    ];

    return (
        <footer className="border-t border-[#20231c] bg-[#090b08] pt-12">
            <div className={container}>
                <div className="grid gap-10 border-b border-[#252920] pb-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-12">
                    <div>
                        <Brand />
                        <p className="mt-5 max-w-xs text-xs leading-7 text-[#a3a79a]">
                            The premier global language-exchange platform where curiosity,
                            culture, and practice bridge borders. Build real-world skills
                            and lifelong friendships.
                        </p>
                        <div className="mt-5 flex gap-3">
                            {["◎", "𝕏", "◉"].map((icon, i) => (
                                <a
                                    key={i}
                                    href="#community"
                                    aria-label={`Social link ${i + 1}`}
                                    className="grid h-9 w-9 place-items-center rounded-full border border-[#30362a] text-sm text-[#c4c8bb] transition hover:border-[#91e98a] hover:text-[#91e98a]"
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {columns.map((column) => (
                        <div key={column.title}>
                            <h3 className="mb-5 text-[10px] font-bold tracking-[1.2px] text-white">
                                {column.title}
                            </h3>
                            <div className="flex flex-col items-start gap-3">
                                {column.links.map(([label, href]) => (
                                    <a
                                        key={label}
                                        href={href}
                                        className="text-[11px] text-[#a3a79a] transition hover:text-[#91e98a]"
                                    >
                                        {label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-4 py-5 text-[10px] text-[#a3a79a] sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 Streamify. All rights reserved.</p>

                    <div className="flex flex-wrap gap-4">
                        <a href="#join" className="hover:text-white">Privacy</a>
                        <a href="#join" className="hover:text-white">Terms</a>
                        <a href="#join" className="hover:text-white">Accessibility</a>
                    </div>

                    <span className="flex items-center gap-2 text-[#91e98a]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#91e98a]" />
                        All systems operational
                    </span>
                </div>
            </div>
        </footer>
    );
}

export default function LandingPage() {
    return (
        <main className="min-h-screen overflow-x-hidden bg-[#0c0e0a] font-sans text-[#f2f1eb]">
            <Navbar />
            <Hero />
            <Features />
            <Partners />
            <Testimonials />
            <JoinSection />
            <Footer />
        </main>
    );
}
