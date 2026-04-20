'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ShieldCheck,
  Shield,
  FileText,
  Search,
  ChevronRight,
  ChevronLeft,
  Check,
  Camera,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  HelpCircle,
  CreditCard,
  Users,
  Building2,
  Info,
  Loader2,
  Home,
  Menu,
  X,
  Download,
  ClipboardList,
  CircleCheckBig,
  CircleDot,
  Circle,
  Star,
  Eye,
  PrinterIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type ViewType = "home" | "apply" | "track" | "info";

interface FormData {
  type: "police" | "character" | "";
  surname: string;
  givenNames: string;
  sex: string;
  dateOfBirth: string;
  age: string;
  placeOfBirth: string;
  nationality: string;
  occupation: string;
  physicalAddress: string;
  premisesOwner: string;
  isOwner: boolean;
  contactNumber: string;
  email: string;
  countriesBefore: string;
  dateArrivedBVI: string;
  purpose: string;
  purposeOther: string;
  certificateCount: number;
  convicted: string;
  convictionDetails: string;
  declaration1: boolean;
  declaration2: boolean;
}

const initialFormData: FormData = {
  type: "",
  surname: "",
  givenNames: "",
  sex: "",
  dateOfBirth: "",
  age: "",
  placeOfBirth: "",
  nationality: "",
  occupation: "",
  physicalAddress: "",
  premisesOwner: "",
  isOwner: false,
  contactNumber: "",
  email: "",
  countriesBefore: "",
  dateArrivedBVI: "",
  purpose: "",
  purposeOther: "",
  certificateCount: 1,
  convicted: "No",
  convictionDetails: "",
  declaration1: false,
  declaration2: false,
};

/* ------------------------------------------------------------------ */
/*  SHIELD BADGE SVG                                                    */
/* ------------------------------------------------------------------ */

function PoliceShieldBadge({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M32 2L4 14v16c0 14.4 11.8 27.8 28 32 16.2-4.2 28-17.6 28-32V14L32 2z" fill="#009B3A" stroke="#FFD100" strokeWidth="2" />
      <path d="M32 8L10 18v12c0 12.2 9.4 23.4 22 27 12.6-3.6 22-14.8 22-27V18L32 8z" fill="#0C1B2A" />
      <path d="M26 36l-6-6 2-2 4 4 10-10 2 2-12 12z" fill="#FFD100" stroke="#FFD100" strokeWidth="1" strokeLinejoin="round" />
      <text x="32" y="56" textAnchor="middle" fill="#FFD100" fontSize="6" fontWeight="bold" fontFamily="serif">BVI</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  OCEAN WAVES ANIMATION COMPONENT                                     */
/* ------------------------------------------------------------------ */

function OceanWaves({ variant = "hero" }: { variant?: "hero" | "dark" | "green" | "white" }) {
  const configs = {
    hero: {
      waves: [
        { d1: "M0 120C180 80 360 160 540 120C720 80 900 140 1080 100C1260 60 1380 90 1440 80L1440 180L0 180Z", fill: "rgba(0,155,58,0.12)", className: "ocean-wave ocean-wave-1" },
        { d1: "M0 140C200 100 400 170 600 130C800 90 1000 160 1200 120C1350 90 1420 110 1440 100L1440 180L0 180Z", fill: "rgba(255,209,0,0.08)", className: "ocean-wave ocean-wave-2" },
        { d1: "M0 150C160 120 320 170 480 140C640 110 800 165 960 135C1120 105 1280 155 1440 130L1440 180L0 180Z", fill: "rgba(0,155,58,0.06)", className: "ocean-wave ocean-wave-3" },
        { d1: "M0 160C240 130 480 175 720 150C960 125 1200 170 1440 145L1440 180L0 180Z", fill: "rgba(255,209,0,0.05)", className: "ocean-wave ocean-wave-4" },
        { d1: "M0 165C180 145 360 178 540 158C720 138 900 172 1080 155C1260 138 1380 162 1440 152L1440 180L0 180Z", fill: "rgba(12,27,42,0.08)", className: "ocean-wave ocean-wave-5" },
      ],
      transitionFill: "white",
    },
    dark: {
      waves: [
        { d1: "M0 130C200 100 400 160 600 120C800 80 1000 150 1200 110C1350 80 1420 100 1440 90L1440 180L0 180Z", fill: "rgba(0,155,58,0.10)", className: "ocean-wave ocean-wave-1" },
        { d1: "M0 145C180 120 360 165 540 135C720 105 900 158 1080 128C1260 98 1380 122 1440 112L1440 180L0 180Z", fill: "rgba(255,209,0,0.06)", className: "ocean-wave ocean-wave-2" },
        { d1: "M0 155C240 135 480 172 720 148C960 124 1200 165 1440 142L1440 180L0 180Z", fill: "rgba(0,155,58,0.04)", className: "ocean-wave ocean-wave-3" },
      ],
      transitionFill: "#0C1B2A",
    },
    green: {
      waves: [
        { d1: "M0 130C200 100 400 160 600 120C800 80 1000 150 1200 110C1350 80 1420 100 1440 90L1440 180L0 180Z", fill: "rgba(255,209,0,0.10)", className: "ocean-wave ocean-wave-1" },
        { d1: "M0 145C180 120 360 165 540 135C720 105 900 158 1080 128C1260 98 1380 122 1440 112L1440 180L0 180Z", fill: "rgba(255,255,255,0.06)", className: "ocean-wave ocean-wave-2" },
        { d1: "M0 155C240 135 480 172 720 148C960 124 1200 165 1440 142L1440 180L0 180Z", fill: "rgba(12,27,42,0.06)", className: "ocean-wave ocean-wave-3" },
      ],
      transitionFill: "#009B3A",
    },
    white: {
      waves: [
        { d1: "M0 130C200 100 400 160 600 120C800 80 1000 150 1200 110C1350 80 1420 100 1440 90L1440 180L0 180Z", fill: "rgba(0,155,58,0.08)", className: "ocean-wave ocean-wave-1" },
        { d1: "M0 145C180 120 360 165 540 135C720 105 900 158 1080 128C1260 98 1380 122 1440 112L1440 180L0 180Z", fill: "rgba(12,27,42,0.06)", className: "ocean-wave ocean-wave-2" },
      ],
      transitionFill: "#f8fafc",
    },
  };

  const config = configs[variant];

  return (
    <div className="ocean-waves-container">
      {config.waves.map((wave, i) => (
        <div key={i} className={wave.className}>
          <svg viewBox="0 0 1440 180" preserveAspectRatio="none">
            <path d={wave.d1} fill={wave.fill} />
          </svg>
        </div>
      ))}
      {/* Transition to next section color */}
      <div className="absolute bottom-0 left-0 right-0 h-16 z-10">
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0 20C180 40 360 10 540 25C720 40 900 15 1080 30C1260 45 1380 20 1440 28V64H0Z"
            fill={config.transitionFill}
            opacity="0.95"
          />
          <path
            d="M0 35C240 50 480 25 720 38C960 50 1200 28 1440 40V64H0Z"
            fill={config.transitionFill}
          />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HEADER                                                             */
/* ------------------------------------------------------------------ */

function Header({ currentView, setView, mobileMenuOpen, setMobileMenuOpen }: {
  currentView: ViewType;
  setView: (v: ViewType) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-50">
      {/* Government top bar */}
      <div className="w-full py-1.5 px-4 text-center" style={{ backgroundColor: "#0C1B2A" }}>
        <p className="text-[11px] sm:text-xs font-medium tracking-widest uppercase text-white/70">
          Government of the Virgin Islands
        </p>
      </div>
      {/* Gold accent line */}
      <div className="h-0.5" style={{ backgroundColor: "#FFD100" }} />
      {/* Main navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView("home")}>
              <div className="relative">
                <PoliceShieldBadge size={40} />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold leading-tight" style={{ color: "#0C1B2A" }}>
                  BVI <span style={{ color: "#009B3A" }}>CERT</span>
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block tracking-wide">
                  Certificate Services Portal
                </p>
              </div>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { key: "home" as ViewType, label: "Home", icon: Home },
                { key: "apply" as ViewType, label: "Apply Now", icon: FileText },
                { key: "track" as ViewType, label: "Track", icon: Search },
                { key: "info" as ViewType, label: "Information", icon: Info },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentView === key
                      ? "text-white shadow-sm"
                      : "text-gray-600 hover:text-[#0C1B2A] hover:bg-gray-50"
                  }`}
                  style={currentView === key ? { backgroundColor: "#009B3A" } : undefined}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Right side: staff login */}
            <div className="hidden md:flex items-center">
              <Link href="/login" className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-[#0C1B2A] transition-colors">
                <ShieldCheck className="w-3.5 h-3.5" />
                Staff Login
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {[
                { key: "home" as ViewType, label: "Home", icon: Home },
                { key: "apply" as ViewType, label: "Apply Now", icon: FileText },
                { key: "track" as ViewType, label: "Track Application", icon: Search },
                { key: "info" as ViewType, label: "Information", icon: Info },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => { setView(key); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    currentView === key
                      ? "text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  style={currentView === key ? { backgroundColor: "#009B3A" } : undefined}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Staff Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                             */
/* ------------------------------------------------------------------ */

function Footer({ setView }: { setView: (v: ViewType) => void }) {
  return (
    <footer className="mt-auto" style={{ backgroundColor: "#0C1B2A" }}>
      {/* Government disclaimer bar */}
      <div className="h-1" style={{ backgroundColor: "#FFD100" }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <PoliceShieldBadge size={32} />
              <div>
                <span className="text-white font-bold text-sm block leading-tight">
                  BVI <span style={{ color: "#009B3A" }}>CERT</span>
                </span>
                <span className="text-[10px] text-gray-500 tracking-wide">Certificate Services</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Official online portal for Police Certificate and Character Certificate applications in the British Virgin Islands, operated by the Royal Virgin Islands Police Force.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase" style={{ backgroundColor: "#009B3A", color: "#FFD100" }}>
              <ShieldCheck className="w-3 h-3" />
              Official Government Service
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Services</h3>
            <ul className="space-y-3 text-xs">
              <li>
                <button onClick={() => setView("apply")} className="text-gray-400 hover:text-[#FFD100] transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 opacity-50" />
                  Apply for Police Certificate
                </button>
              </li>
              <li>
                <button onClick={() => setView("apply")} className="text-gray-400 hover:text-[#FFD100] transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 opacity-50" />
                  Apply for Character Certificate
                </button>
              </li>
              <li>
                <button onClick={() => setView("track")} className="text-gray-400 hover:text-[#FFD100] transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 opacity-50" />
                  Track Application
                </button>
              </li>
              <li>
                <button onClick={() => setView("info")} className="text-gray-400 hover:text-[#FFD100] transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 opacity-50" />
                  Information &amp; FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#FFD100" }} />
                <span>Road Town Police Station<br />Tortola, British Virgin Islands</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#FFD100" }} />
                <span>+1 (284) 468-3701</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#FFD100" }} />
                <span>certificates@rvipf.gov.vg</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3 text-xs text-gray-400">
              <li>
                <p className="leading-relaxed">This is an official government service of the Virgin Islands. Unauthorized use, falsification of records, or fraudulent applications is a criminal offense under VI law.</p>
              </li>
              <li>
                <p className="leading-relaxed">All applications are subject to verification by the Royal Virgin Islands Police Force.</p>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="text-center space-y-2">
          <p className="text-[11px] text-gray-500">
            &copy; {new Date().getFullYear()} Government of the Virgin Islands — Royal Virgin Islands Police Force. All rights reserved.
          </p>
          <p className="text-[10px] text-gray-600">
            Official Government Service &middot; Road Town, Tortola, British Virgin Islands
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  HOME VIEW                                                          */
/* ------------------------------------------------------------------ */

function HomeView({ setView, startApplication }: { setView: (v: ViewType) => void; startApplication: (type: "police" | "character") => void }) {
  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0C1B2A 0%, #0C1B2A 30%, #002868 50%, #0a4025 70%, #009B3A 100%)" }}>
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Subtle light accents - BVI flag inspired colors */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #FFD100 0%, transparent 60%)", transform: "translate(25%, -35%)" }} />
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #D4213D 0%, transparent 70%)" }} />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #002868 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #FFD100 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />
        {/* Gold sparkle overlay */}
        <div className="sparkle-overlay" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28">
          <div className="text-center">
            {/* Shield badge */}
            <div className="flex justify-center mb-8">
              <div className="relative float-gentle">
                <div className="p-5 rounded-full" style={{ backgroundColor: "rgba(255,209,0,0.1)", border: "2px solid rgba(255,209,0,0.2)" }}>
                  <PoliceShieldBadge size={80} />
                </div>
                {/* Glow ring around badge */}
                <div className="absolute inset-0 rounded-full shimmer-gold" style={{ boxShadow: "0 0 40px rgba(255,209,0,0.15), 0 0 80px rgba(255,209,0,0.05)" }} />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#FFD100" }}>
                  <Check className="w-4 h-4" style={{ color: "#0C1B2A" }} />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight text-white tracking-tight">
              BVI <span className="bvi-gradient-text">CERT</span>
            </h1>
            <p className="text-lg sm:text-xl font-medium mb-2" style={{ color: "#009B3A" }}>
              Official Certificate Services Portal
            </p>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Apply for your Police Certificate or Character Certificate online through the Royal Virgin Islands Police Force. Fast, secure, and official.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <Button
                size="lg"
                onClick={() => startApplication("police")}
                className="h-14 text-base font-bold px-8 rounded-lg shadow-xl transition-all duration-200 hover:shadow-2xl hover:scale-[1.02] border-0"
                style={{ backgroundColor: "#FFD100", color: "#0C1B2A" }}
              >
                <Shield className="w-5 h-5 mr-2" />
                Police Certificate
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => startApplication("character")}
                className="h-14 text-base font-bold px-8 rounded-lg border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-200"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <ClipboardList className="w-5 h-5 mr-2" />
                Character Certificate
              </Button>
            </div>
          </div>
        </div>

        {/* Animated Ocean Waves */}
        <OceanWaves variant="hero" />
      </section>

      {/* ===== QUICK ACTIONS BAR ===== */}
      <section className="relative z-10 -mt-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => startApplication("police")}
              className="group flex items-center gap-4 p-5 rounded-xl bg-white shadow-md border border-gray-100 hover:shadow-lg hover:border-[#009B3A]/20 transition-all duration-200 text-left"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200" style={{ backgroundColor: "#009B3A" }}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#0C1B2A]">Apply Online</p>
                <p className="text-xs text-gray-500">Start your application</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#009B3A] ml-auto transition-colors" />
            </button>

            <button
              onClick={() => setView("track")}
              className="group flex items-center gap-4 p-5 rounded-xl bg-white shadow-md border border-gray-100 hover:shadow-lg hover:border-[#009B3A]/20 transition-all duration-200 text-left"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200" style={{ backgroundColor: "#0C1B2A" }}>
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#0C1B2A]">Track Application</p>
                <p className="text-xs text-gray-500">Check your status</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#009B3A] ml-auto transition-colors" />
            </button>

            <button
              onClick={() => setView("info")}
              className="group flex items-center gap-4 p-5 rounded-xl bg-white shadow-md border border-gray-100 hover:shadow-lg hover:border-[#009B3A]/20 transition-all duration-200 text-left"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#FFD100" }}>
                <HelpCircle className="w-6 h-6" style={{ color: "#0C1B2A" }} />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#0C1B2A]">Information</p>
                <p className="text-xs text-gray-500">FAQs and guidance</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#009B3A] ml-auto transition-colors" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== TRACK SECTION ===== */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1" style={{ backgroundColor: "#009B3A" }} />
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#009B3A" }}>
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0C1B2A]">Track Your Application</h2>
                  <p className="text-sm text-gray-500">Enter your tracking number to check status</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="e.g. BVI-2026-ABC123" className="flex-1 h-11" id="home-tracking-input" />
                <Button
                  onClick={() => { const input = document.getElementById("home-tracking-input") as HTMLInputElement; if (input) localStorage.setItem("pendingTrack", input.value.trim()); setView("track"); }}
                  className="h-11 px-6 text-white font-semibold border-0 shadow-sm"
                  style={{ backgroundColor: "#009B3A" }}
                >
                  Track
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="py-14 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#f8fafc" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#009B3A" }}>Our Services</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C1B2A] mb-3">Certificate Types</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Choose the certificate that fits your needs. All certificates are officially issued by the Royal Virgin Islands Police Force.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Police Certificate */}
            <Card
              className="cursor-pointer border-2 border-transparent hover:border-[#009B3A] transition-all duration-300 group hover:shadow-xl overflow-hidden bg-white"
              onClick={() => startApplication("police")}
            >
              <div className="h-1 group-hover:h-1.5 transition-all duration-300" style={{ backgroundColor: "#009B3A" }} />
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow" style={{ backgroundColor: "#009B3A" }}>
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-[#0C1B2A] text-lg">Police Certificate</CardTitle>
                    <CardDescription className="text-xs mt-1">Certificate of Police Character</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2.5 text-sm text-gray-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#009B3A" }} />
                    Required for employment applications
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#009B3A" }} />
                    Immigration and visa processing
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#009B3A" }} />
                    Official government-issued document
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 border-t border-gray-100">
                <span className="text-sm font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200" style={{ color: "#009B3A" }}>
                  Apply Now <ArrowRight className="w-4 h-4" />
                </span>
              </CardFooter>
            </Card>

            {/* Character Certificate */}
            <Card
              className="cursor-pointer border-2 border-transparent hover:border-[#FFD100] transition-all duration-300 group hover:shadow-xl overflow-hidden bg-white"
              onClick={() => startApplication("character")}
            >
              <div className="h-1 group-hover:h-1.5 transition-all duration-300" style={{ backgroundColor: "#FFD100" }} />
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow" style={{ backgroundColor: "#FFD100" }}>
                    <ClipboardList className="w-7 h-7" style={{ color: "#0C1B2A" }} />
                  </div>
                  <div>
                    <CardTitle className="text-[#0C1B2A] text-lg">Character Certificate</CardTitle>
                    <CardDescription className="text-xs mt-1">Certificate of Good Character</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2.5 text-sm text-gray-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#b89500" }} />
                    Required for adoption proceedings
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#b89500" }} />
                    Education and scholarship applications
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#b89500" }} />
                    Professional licensing and registration
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 border-t border-gray-100">
                <span className="text-sm font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200" style={{ color: "#b89500" }}>
                  Apply Now <ArrowRight className="w-4 h-4" />
                </span>
              </CardFooter>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/certificates" className="text-sm font-medium inline-flex items-center gap-1.5 hover:gap-2.5 transition-all" style={{ color: "#009B3A" }}>
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#009B3A" }}>Simple Process</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C1B2A] mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Get your certificate in 4 straightforward steps</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200" />
            <div className="hidden lg:block absolute top-12 left-[12.5%] h-0.5 transition-all duration-1000" style={{ width: "0%", backgroundColor: "#009B3A" }} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: 1, icon: FileText, title: "Complete Application", desc: "Fill out the online form with your personal details and upload required documents.", accent: "#009B3A" },
                { step: 2, icon: CreditCard, title: "Pay Fee", desc: "Pay the certificate processing fee of $20.00 per certificate at the station.", accent: "#FFD100" },
                { step: 3, icon: Clock, title: "Processing", desc: "Your application is reviewed and verified. Track progress with your tracking number.", accent: "#009B3A" },
                { step: 4, icon: CheckCircle2, title: "Collect Certificate", desc: "Pick up your certificate at Road Town Police Station with valid photo ID.", accent: "#FFD100" },
              ].map(({ step, icon: Icon, title, desc, accent }) => (
                <div key={step} className="relative text-center group">
                  <div className="relative inline-flex mb-5">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow duration-300 mx-auto"
                      style={{ backgroundColor: accent === "#009B3A" ? "#009B3A" : "#FFD100" }}
                    >
                      <Icon className="w-8 h-8" style={{ color: accent === "#009B3A" ? "#fff" : "#0C1B2A" }} />
                    </div>
                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: "#0C1B2A" }}
                    >
                      {step}
                    </div>
                  </div>
                  <h3 className="font-bold text-[#0C1B2A] mb-2 text-sm">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-[200px] mx-auto">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative py-10 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundColor: "#0C1B2A" }}>
        {/* Subtle wave texture in background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="stats-wave" width="200" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20C50 5 100 35 150 20C175 12 190 25 200 20V40H0Z" fill="none" stroke="#009B3A" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stats-wave)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden">
            <div className="text-center p-8" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
              <CreditCard className="w-7 h-7 mx-auto mb-3" style={{ color: "#FFD100" }} />
              <h3 className="font-bold text-white mb-1">Processing Fee</h3>
              <p className="text-3xl font-bold" style={{ color: "#FFD100" }}>$20<span className="text-lg">.00</span></p>
              <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider">Per certificate</p>
            </div>
            <div className="text-center p-8" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
              <Clock className="w-7 h-7 mx-auto mb-3" style={{ color: "#009B3A" }} />
              <h3 className="font-bold text-white mb-1">Processing Time</h3>
              <p className="text-3xl font-bold text-white">3 <span className="text-lg">Days</span></p>
              <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider">Working days</p>
            </div>
            <div className="text-center p-8" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
              <MapPin className="w-7 h-7 mx-auto mb-3" style={{ color: "#FFD100" }} />
              <h3 className="font-bold text-white mb-1">Collection Point</h3>
              <p className="text-xl font-bold text-white">Road Town</p>
              <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider">Police Station</p>
            </div>
          </div>
        </div>
        {/* Animated wave transition out of dark section */}
        <OceanWaves variant="dark" />
      </section>

      {/* ===== TRUST / OFFICIAL SECTION ===== */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full" style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <ShieldCheck className="w-5 h-5" style={{ color: "#009B3A" }} />
              <span className="text-sm font-semibold" style={{ color: "#009B3A" }}>Official Government Service</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0C1B2A] mb-4">Trusted &amp; Secure</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            BVI CERT is the official online portal operated by the Royal Virgin Islands Police Force. All applications are processed securely and certificates are verified government documents.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: "#009B3A" }}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-sm text-[#0C1B2A] mb-1">Government Issued</h3>
              <p className="text-xs text-gray-500">Official certificates from the RVIPF</p>
            </div>
            <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: "#0C1B2A" }}>
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-sm text-[#0C1B2A] mb-1">Verified &amp; Secure</h3>
              <p className="text-xs text-gray-500">All documents are authenticated</p>
            </div>
            <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: "#FFD100" }}>
                <Clock className="w-5 h-5" style={{ color: "#0C1B2A" }} />
              </div>
              <h3 className="font-bold text-sm text-[#0C1B2A] mb-1">Fast Processing</h3>
              <p className="text-xs text-gray-500">Ready in 3 working days</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundColor: "#009B3A" }}>
        <div className="absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cta-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>
        {/* Gold sparkle dots */}
        <div className="sparkle-overlay" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)" }} />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Apply?</h2>
          <p className="text-green-100 mb-8">Start your certificate application now. It&apos;s quick and easy.</p>
          <Button
            size="lg"
            onClick={() => setView("apply")}
            className="h-14 px-10 font-bold text-base rounded-lg shadow-xl border-0 transition-all duration-200 hover:shadow-2xl hover:scale-[1.02]"
            style={{ backgroundColor: "#FFD100", color: "#0C1B2A" }}
          >
            Start Application <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
        {/* Animated wave transition to footer */}
        <OceanWaves variant="green" />
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APPLICATION FORM WIZARD                                            */
/* ------------------------------------------------------------------ */

function ApplicationWizard({ initialType, setView }: { initialType: "police" | "character" | ""; setView: (v: ViewType) => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem("rvipf_draft");
    if (saved) { try { return { ...initialFormData, ...JSON.parse(saved) }; } catch {} }
    return { ...initialFormData, type: initialType || "" };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTracking, setSubmittedTracking] = useState("");
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [passportPhotoPreview, setPassportPhotoPreview] = useState<string | null>(null);
  const [passportCopy, setPassportCopy] = useState<File | null>(null);
  const [passportCopyPreview, setPassportCopyPreview] = useState<string | null>(null);
  const passportPhotoRef = useRef<HTMLInputElement>(null);
  const passportCopyRef = useRef<HTMLInputElement>(null);

  const steps = [
    { label: "Personal Info", icon: Users },
    { label: "Contact", icon: MapPin },
    { label: "Certificate", icon: FileText },
    { label: "Documents", icon: Upload },
    { label: "Review", icon: Eye },
    { label: "Confirmation", icon: CheckCircle2 },
  ];

  useEffect(() => { if (step < 5) localStorage.setItem("rvipf_draft", JSON.stringify(formData)); }, [formData, step]);
  // Age calculation is handled inline via updateField to avoid setState-in-effect

  const updateField = useCallback((field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'dateOfBirth' && typeof value === 'string') {
        const dob = new Date(value); const today = new Date();
        if (!isNaN(dob.getTime())) { let age = today.getFullYear() - dob.getFullYear(); const m = today.getMonth() - dob.getMonth(); if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--; next.age = String(age); }
      }
      return next;
    });
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  }, [errors]);

  const validateStep = useCallback((s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!formData.type) e.type = "Please select certificate type.";
      if (!formData.surname.trim()) e.surname = "Surname is required.";
      if (!formData.givenNames.trim()) e.givenNames = "Given names are required.";
      if (!formData.sex) e.sex = "Please select sex.";
      if (!formData.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
      if (!formData.placeOfBirth.trim()) e.placeOfBirth = "Place of birth is required.";
      if (!formData.nationality.trim()) e.nationality = "Nationality is required.";
      if (!formData.occupation.trim()) e.occupation = "Occupation is required.";
    }
    if (s === 1) { if (!formData.physicalAddress.trim()) e.physicalAddress = "Physical address is required."; if (!formData.contactNumber.trim()) e.contactNumber = "Contact number is required."; }
    if (s === 2) { if (!formData.purpose) e.purpose = "Please select a purpose."; if (formData.purpose === "Other" && !formData.purposeOther.trim()) e.purposeOther = "Please specify the purpose."; }
    if (s === 4) { if (!formData.declaration1) e.declaration1 = "You must declare that all information is true and correct."; if (!formData.declaration2) e.declaration2 = "You must acknowledge that providing false information is an offense."; }
    setErrors(e); return Object.keys(e).length === 0;
  }, [formData]);

  const handleNext = () => { if (validateStep(step)) setStep((s) => s + 1); else toast({ title: "Validation Error", description: "Please fill in all required fields correctly.", variant: "destructive" }); };
  const handleBack = () => setStep((s) => s - 1);

  const handleFileChange = (field: "passportPhoto" | "passportCopy", file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast({ title: "File Too Large", description: "Maximum file size is 5MB.", variant: "destructive" }); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { toast({ title: "Invalid File Type", description: "Only JPEG, PNG, and WebP images are accepted.", variant: "destructive" }); return; }
    if (field === "passportPhoto") { setPassportPhoto(file); const reader = new FileReader(); reader.onload = (e) => setPassportPhotoPreview(e.target?.result as string); reader.readAsDataURL(file); }
    else { setPassportCopy(file); const reader = new FileReader(); reader.onload = (e) => setPassportCopyPreview(e.target?.result as string); reader.readAsDataURL(file); }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setIsSubmitting(true);
    try {
      const data = new FormData();
      for (const [key, value] of Object.entries(formData)) { if (key !== "declaration1" && key !== "declaration2" && key !== "isOwner") data.append(key, String(value)); }
      if (passportPhoto) data.append("passportPhoto", passportPhoto);
      if (passportCopy) data.append("passportCopy", passportCopy);
      const response = await fetch("/api/submit-application", { method: "POST", body: data });
      const result = await response.json();
      if (result.success) { setSubmittedTracking(result.trackingNumber); localStorage.removeItem("rvipf_draft"); setStep(5); toast({ title: "Application Submitted!", description: `Your tracking number is ${result.trackingNumber}` }); }
      else { const msg = result.errors?.map((e: { field: string; message: string }) => e.message).join(". ") || result.error || "Submission failed. Please try again."; toast({ title: "Submission Failed", description: msg, variant: "destructive" }); }
    } catch { toast({ title: "Error", description: "Network error. Please check your connection and try again.", variant: "destructive" }); }
    finally { setIsSubmitting(false); }
  };

  const renderStep0 = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0C1B2A]">Certificate Type &amp; Personal Information</h3>
      <div className="space-y-2">
        <Label className="font-semibold">Certificate Type *</Label>
        <RadioGroup value={formData.type} onValueChange={(v) => updateField("type", v)} className="flex flex-col sm:flex-row gap-3">
          <Label htmlFor="type-police" className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.type === "police" ? "border-[#009B3A] bg-[#009B3A]/5" : "border-gray-200 hover:border-gray-300"}`}>
            <RadioGroupItem value="police" id="type-police" /><Shield className="w-5 h-5 text-[#009B3A]" />
            <div><span className="font-medium">Police Certificate</span><p className="text-xs text-gray-500">Certificate of Police Character</p></div>
          </Label>
          <Label htmlFor="type-character" className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.type === "character" ? "border-[#FFD100] bg-[#FFD100]/5" : "border-gray-200 hover:border-gray-300"}`}>
            <RadioGroupItem value="character" id="type-character" /><ClipboardList className="w-5 h-5 text-[#b89500]" />
            <div><span className="font-medium">Character Certificate</span><p className="text-xs text-gray-500">Certificate of Good Character</p></div>
          </Label>
        </RadioGroup>
        {errors.type && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.type}</p>}
      </div>
      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5"><Label htmlFor="surname">Surname / Last Name <span className="text-red-500">*</span></Label><Input id="surname" placeholder="e.g. Smith" value={formData.surname} onChange={(e) => updateField("surname", e.target.value)} />{errors.surname && <p className="text-sm text-red-500">{errors.surname}</p>}</div>
        <div className="space-y-1.5"><Label htmlFor="givenNames">Given Names / First Name <span className="text-red-500">*</span></Label><Input id="givenNames" placeholder="e.g. John William" value={formData.givenNames} onChange={(e) => updateField("givenNames", e.target.value)} />{errors.givenNames && <p className="text-sm text-red-500">{errors.givenNames}</p>}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5"><Label>Sex <span className="text-red-500">*</span></Label><RadioGroup value={formData.sex} onValueChange={(v) => updateField("sex", v)} className="flex gap-4 pt-2"><Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="Male" />Male</Label><Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="Female" />Female</Label></RadioGroup>{errors.sex && <p className="text-sm text-red-500">{errors.sex}</p>}</div>
        <div className="space-y-1.5"><Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label><Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} max={new Date().toISOString().split("T")[0]} />{errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}</div>
        <div className="space-y-1.5"><Label htmlFor="age">Age</Label><Input id="age" value={formData.age} readOnly className="bg-gray-50" placeholder="Auto-calculated" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5"><Label htmlFor="placeOfBirth">Place of Birth <span className="text-red-500">*</span></Label><Input id="placeOfBirth" placeholder="e.g. Road Town, Tortola" value={formData.placeOfBirth} onChange={(e) => updateField("placeOfBirth", e.target.value)} />{errors.placeOfBirth && <p className="text-sm text-red-500">{errors.placeOfBirth}</p>}</div>
        <div className="space-y-1.5"><Label htmlFor="nationality">Nationality <span className="text-red-500">*</span></Label><Input id="nationality" placeholder="e.g. British Virgin Islander" value={formData.nationality} onChange={(e) => updateField("nationality", e.target.value)} />{errors.nationality && <p className="text-sm text-red-500">{errors.nationality}</p>}</div>
        <div className="space-y-1.5"><Label htmlFor="occupation">Occupation <span className="text-red-500">*</span></Label><Input id="occupation" placeholder="e.g. Teacher" value={formData.occupation} onChange={(e) => updateField("occupation", e.target.value)} />{errors.occupation && <p className="text-sm text-red-500">{errors.occupation}</p>}</div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0C1B2A]">Contact &amp; Residence Information</h3>
      <div className="space-y-1.5"><Label htmlFor="physicalAddress">Physical Address <span className="text-red-500">*</span></Label><Textarea id="physicalAddress" placeholder="Full residential address in the BVI" value={formData.physicalAddress} onChange={(e) => updateField("physicalAddress", e.target.value)} rows={3} />{errors.physicalAddress && <p className="text-sm text-red-500">{errors.physicalAddress}</p>}</div>
      <div className="space-y-1.5"><Label htmlFor="premisesOwner">If renting, name of premises owner</Label><Input id="premisesOwner" placeholder="e.g. John Doe" value={formData.premisesOwner} onChange={(e) => updateField("premisesOwner", e.target.value)} /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5"><Label htmlFor="contactNumber">Contact Number <span className="text-red-500">*</span></Label><Input id="contactNumber" placeholder="+1 (284) XXX-XXXX" value={formData.contactNumber} onChange={(e) => updateField("contactNumber", e.target.value)} />{errors.contactNumber && <p className="text-sm text-red-500">{errors.contactNumber}</p>}</div>
        <div className="space-y-1.5"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={(e) => updateField("email", e.target.value)} /></div>
      </div>
      <Separator />
      <h4 className="font-semibold text-[#0C1B2A]">Residency History</h4>
      <div className="space-y-1.5"><Label htmlFor="countriesBefore">Countries lived in before BVI (list all)</Label><Textarea id="countriesBefore" placeholder="e.g. Jamaica, St. Kitts, USA" value={formData.countriesBefore} onChange={(e) => updateField("countriesBefore", e.target.value)} rows={2} /></div>
      <div className="space-y-1.5"><Label htmlFor="dateArrivedBVI">Date arrived in BVI</Label><Input id="dateArrivedBVI" type="date" value={formData.dateArrivedBVI} onChange={(e) => updateField("dateArrivedBVI", e.target.value)} max={new Date().toISOString().split("T")[0]} /></div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0C1B2A]">Certificate Details</h3>
      <div className="space-y-2">
        <Label className="font-semibold">Purpose of Certificate <span className="text-red-500">*</span></Label>
        <Select value={formData.purpose} onValueChange={(v) => updateField("purpose", v)}>
          <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
          <SelectContent>
            {["Employment", "Immigration", "Adoption", "Education", "Travel", "Other"].map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.purpose && <p className="text-sm text-red-500">{errors.purpose}</p>}
      </div>
      {formData.purpose === "Other" && (
        <div className="space-y-1.5"><Label htmlFor="purposeOther">Please specify <span className="text-red-500">*</span></Label><Input id="purposeOther" placeholder="Specify your purpose" value={formData.purposeOther} onChange={(e) => updateField("purposeOther", e.target.value)} />{errors.purposeOther && <p className="text-sm text-red-500">{errors.purposeOther}</p>}</div>
      )}
      <div className="space-y-2"><Label className="font-semibold">Number of Certificates Needed</Label><Select value={String(formData.certificateCount)} onValueChange={(v) => updateField("certificateCount", parseInt(v))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[1, 2, 3, 4, 5].map((n) => (<SelectItem key={n} value={String(n)}>{n} {n === 1 ? "certificate" : "certificates"}</SelectItem>))}</SelectContent></Select></div>
      <Separator />
      <div className="space-y-2">
        <Label className="font-semibold">Have you ever been convicted of a criminal offense?</Label>
        <RadioGroup value={formData.convicted} onValueChange={(v) => updateField("convicted", v)} className="flex gap-4">
          <Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="No" />No</Label>
          <Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="Yes" />Yes</Label>
        </RadioGroup>
      </div>
      {formData.convicted === "Yes" && (<div className="space-y-1.5"><Label htmlFor="convictionDetails">Conviction Details <span className="text-red-500">*</span></Label><Textarea id="convictionDetails" placeholder="Please provide details of the conviction(s)" value={formData.convictionDetails} onChange={(e) => updateField("convictionDetails", e.target.value)} rows={3} /></div>)}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0C1B2A]">Document Upload</h3>
      <p className="text-sm text-gray-500">Upload a clear passport-size photo and a copy of your passport identification page.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="font-semibold">Passport Photo</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#009B3A] transition-colors" onClick={() => passportPhotoRef.current?.click()}>
            {passportPhotoPreview ? (
              <img src={passportPhotoPreview} alt="Passport photo" className="w-24 h-24 mx-auto rounded-lg object-cover" />
            ) : (
              <div><Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" /><p className="text-sm text-gray-500">Click to upload</p><p className="text-xs text-gray-400">Max 5MB, JPEG/PNG/WebP</p></div>
            )}
          </div>
          <input ref={passportPhotoRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFileChange("passportPhoto", e.target.files?.[0] || null)} />
        </div>
        <div className="space-y-3">
          <Label className="font-semibold">Passport Copy</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#009B3A] transition-colors" onClick={() => passportCopyRef.current?.click()}>
            {passportCopyPreview ? (
              <img src={passportCopyPreview} alt="Passport copy" className="w-32 h-20 mx-auto rounded-lg object-cover" />
            ) : (
              <div><Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" /><p className="text-sm text-gray-500">Click to upload</p><p className="text-xs text-gray-400">Max 5MB, JPEG/PNG/WebP</p></div>
            )}
          </div>
          <input ref={passportCopyRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFileChange("passportCopy", e.target.files?.[0] || null)} />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0C1B2A]">Review &amp; Submit</h3>
      <Card className="bg-gray-50">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-500">Type:</span><span className="font-medium">{formData.type === "police" ? "Police Certificate" : "Character Certificate"}</span>
            <span className="text-gray-500">Name:</span><span className="font-medium">{formData.surname}, {formData.givenNames}</span>
            <span className="text-gray-500">Sex:</span><span className="font-medium">{formData.sex}</span>
            <span className="text-gray-500">DOB:</span><span className="font-medium">{formData.dateOfBirth}</span>
            <span className="text-gray-500">Nationality:</span><span className="font-medium">{formData.nationality}</span>
            <span className="text-gray-500">Occupation:</span><span className="font-medium">{formData.occupation}</span>
            <span className="text-gray-500">Address:</span><span className="font-medium">{formData.physicalAddress}</span>
            <span className="text-gray-500">Contact:</span><span className="font-medium">{formData.contactNumber}</span>
            <span className="text-gray-500">Purpose:</span><span className="font-medium">{formData.purpose}</span>
            <span className="text-gray-500">Qty:</span><span className="font-medium">{formData.certificateCount}</span>
            <span className="text-gray-500">Convicted:</span><span className="font-medium">{formData.convicted}</span>
          </div>
        </CardContent>
      </Card>
      <Separator />
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox id="declaration1" checked={formData.declaration1} onCheckedChange={(c) => updateField("declaration1", !!c)} />
          <Label htmlFor="declaration1" className="text-sm leading-relaxed">I hereby declare that all information provided is true and correct to the best of my knowledge.</Label>
        </div>
        {errors.declaration1 && <p className="text-sm text-red-500">{errors.declaration1}</p>}
        <div className="flex items-start gap-3">
          <Checkbox id="declaration2" checked={formData.declaration2} onCheckedChange={(c) => updateField("declaration2", !!c)} />
          <Label htmlFor="declaration2" className="text-sm leading-relaxed">I acknowledge that providing false information is an offense under the laws of the Virgin Islands.</Label>
        </div>
        {errors.declaration2 && <p className="text-sm text-red-500">{errors.declaration2}</p>}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center py-8 space-y-6">
      <div className="flex justify-center"><div className="p-4 bg-green-100 rounded-full"><CheckCircle2 className="w-16 h-16 text-green-600" /></div></div>
      <div><h3 className="text-2xl font-bold text-[#0C1B2A] mb-2">Application Submitted!</h3><p className="text-gray-500">Your application has been received and is being processed.</p></div>
      <Card className="max-w-sm mx-auto border-2 border-[#009B3A]">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 mb-2">Your Tracking Number</p>
          <p className="text-2xl font-bold text-[#009B3A] font-mono">{submittedTracking}</p>
          <p className="text-xs text-gray-400 mt-2">Save this number to track your application status</p>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => { setView("track"); localStorage.setItem("pendingTrack", submittedTracking); }} className="bg-[#009B3A] hover:bg-[#007a2e] text-white">Track Application</Button>
        <Button variant="outline" onClick={() => setView("home")}>Back to Home</Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" style={{ background: "linear-gradient(180deg, #f0f9f4 0%, #f5f0ff 50%, #fefce8 100%)", minHeight: "calc(100vh - 180px)" }}>
      {step < 5 && (
        <div className="mb-8">
          <Progress value={(step / 5) * 100} className="h-2 mb-6" />
          <div className="flex justify-between">
            {steps.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i < step ? "bg-[#009B3A] text-white" : i === step ? "bg-[#FFD100] text-[#0C1B2A]" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                </div>
                <span className={`text-[10px] sm:text-xs ${i === step ? "font-medium text-[#0C1B2A]" : "text-gray-500"}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <Card className="shadow-lg border-0" style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)" }}>
        <CardContent className="p-6">
          {step === 0 && renderStep0()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </CardContent>
        {step < 5 && (
          <CardFooter className="flex justify-between border-t p-4">
            {step > 0 ? <Button variant="outline" onClick={handleBack}><ChevronLeft className="w-4 h-4 mr-1" />Back</Button> : <div />}
            {step < 4 ? (
              <Button onClick={handleNext} className="bg-[#009B3A] hover:bg-[#007a2e] text-white">Next<ChevronRight className="w-4 h-4 ml-1" /></Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#009B3A] hover:bg-[#007a2e] text-white">
                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : "Submit Application"}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TRACK VIEW                                                         */
/* ------------------------------------------------------------------ */

function TrackView() {
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState(() => localStorage.getItem("pendingTrack") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ trackingNumber: string; type: string; status: string; surname: string; givenNames: string; createdAt: string; updatedAt: string; paymentStatus: string; paymentAmount: number; dateIssued: string | null; dateExpires: string | null; certificateNumber: string | null } | null>(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!trackingNumber.trim()) { setError("Please enter a tracking number."); return; }
    setIsLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`/api/track?tracking=${encodeURIComponent(trackingNumber.trim())}`);
      const data = await res.json();
      if (data.success) { setResult(data.application); }
      else { setError(data.error || "Application not found."); }
    } catch { setError("Network error. Please try again."); }
    finally { setIsLoading(false); localStorage.removeItem("pendingTrack"); }
  };

  const statusColorMap: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    under_review: "bg-purple-100 text-purple-800",
    approved: "bg-green-100 text-green-800",
    issued: "bg-emerald-100 text-emerald-800",
    collected: "bg-gray-100 text-gray-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-[#0C1B2A] mb-6 text-center">Track Your Application</h2>
      <Card className="shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="flex gap-2">
            <Input placeholder="Enter tracking number (e.g. BVI-2026-ABC123)" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleTrack()} className="flex-1" />
            <Button onClick={handleTrack} disabled={isLoading} className="bg-[#009B3A] hover:bg-[#007a2e] text-white px-6">{isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track"}</Button>
          </div>
          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
        </CardContent>
      </Card>
      {result && (
        <Card className="shadow-lg border-2 border-[#009B3A]/20">
          <CardHeader><CardTitle className="text-lg text-[#0C1B2A]">Application Found</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className={statusColorMap[result.status] || "bg-gray-100"}>{result.status.replace(/_/g, " ").toUpperCase()}</Badge>
              <span className="text-sm text-gray-500">{result.type === "police" ? "Police Certificate" : "Character Certificate"}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Tracking #:</span><p className="font-mono font-medium">{result.trackingNumber}</p></div>
              <div><span className="text-gray-500">Applicant:</span><p className="font-medium">{result.surname}, {result.givenNames}</p></div>
              <div><span className="text-gray-500">Submitted:</span><p className="font-medium">{new Date(result.createdAt).toLocaleDateString()}</p></div>
              <div><span className="text-gray-500">Last Update:</span><p className="font-medium">{new Date(result.updatedAt).toLocaleDateString()}</p></div>
              <div><span className="text-gray-500">Payment:</span><p className="font-medium">{result.paymentStatus === "paid" ? `Paid ($${result.paymentAmount})` : "Pending"}</p></div>
              {result.certificateNumber && <div><span className="text-gray-500">Certificate #:</span><p className="font-mono font-medium">{result.certificateNumber}</p></div>}
            </div>
            <div className="flex items-center gap-2 pt-2">
              {["pending", "processing", "under_review", "approved", "issued", "collected"].filter((s, i, a) => a.indexOf(s) <= a.indexOf(result.status)).map((s, i, a) => (
                <React.Fragment key={s}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${a.indexOf(s) <= a.indexOf(result.status) ? "bg-[#009B3A] text-white" : "bg-gray-200 text-gray-500"}`}>
                    {i + 1}
                  </div>
                  {i < a.length - 1 && <div className={`h-0.5 flex-1 ${a.indexOf(s) < a.indexOf(result.status) ? "bg-[#009B3A]" : "bg-gray-200"}`} />}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  INFO VIEW                                                          */
/* ------------------------------------------------------------------ */

function InfoView() {
  const faqs = [
    { q: "What is a Police Certificate?", a: "A Police Certificate (Certificate of Police Character) is an official document issued by the RVIPF that confirms whether a person has a criminal record in the British Virgin Islands." },
    { q: "How long does processing take?", a: "Standard processing takes 3 working days. Complex cases may take longer. You will be notified if there are delays." },
    { q: "What documents do I need?", a: "You need a valid government-issued photo ID (passport or Belonger card), a passport-size photo, and completed application form." },
    { q: "How much does it cost?", a: "The processing fee is $20.00 per certificate. Payment is collected at the Road Town Police Station." },
    { q: "Can someone else collect my certificate?", a: "No. You must collect your certificate in person with valid photo ID at the Road Town Police Station." },
    { q: "What if my application is rejected?", a: "You will be notified of the reason. You may appeal by visiting the Road Town Police Station with additional supporting documents." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-[#0C1B2A] mb-2 text-center">Information & FAQ</h2>
      <p className="text-gray-500 text-center mb-8">Find answers to common questions about certificate services</p>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left font-medium hover:no-underline">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-gray-600 leading-relaxed">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [startType, setStartType] = useState<"police" | "character" | "">("");

  const startApplication = (type: "police" | "character") => {
    setStartType(type);
    setCurrentView("apply");
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header currentView={currentView} setView={setCurrentView} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      {currentView === "home" && <HomeView setView={setCurrentView} startApplication={startApplication} />}
      {currentView === "apply" && <ApplicationWizard initialType={startType} setView={setCurrentView} />}
      {currentView === "track" && <TrackView />}
      {currentView === "info" && <InfoView />}
      <Footer setView={setCurrentView} />
    </div>
  );
}
