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

interface TrackingResult {
  trackingNumber: string;
  type: string;
  status: string;
  surname: string;
  givenNames: string;
  createdAt: string;
  updatedAt: string;
  paymentStatus: string;
  paymentAmount: number;
  dateIssued: string | null;
  dateExpires: string | null;
  certificateNumber: string | null;
}

/* ------------------------------------------------------------------ */
/*  SHIELD BADGE SVG                                                    */
/* ------------------------------------------------------------------ */

function PoliceShieldBadge({
  className = "",
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M32 2L4 14v16c0 14.4 11.8 27.8 28 32 16.2-4.2 28-17.6 28-32V14L32 2z"
        fill="#009B3A"
        stroke="#FFD100"
        strokeWidth="2"
      />
      <path
        d="M32 8L10 18v12c0 12.2 9.4 23.4 22 27 12.6-3.6 22-14.8 22-27V18L32 8z"
        fill="#0C1B2A"
      />
      <path
        d="M26 36l-6-6 2-2 4 4 10-10 2 2-12 12z"
        fill="#FFD100"
        stroke="#FFD100"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <text
        x="32"
        y="56"
        textAnchor="middle"
        fill="#FFD100"
        fontSize="6"
        fontWeight="bold"
        fontFamily="serif"
      >
        BVI
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  HEADER                                                             */
/* ------------------------------------------------------------------ */

function Header({
  currentView,
  setView,
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  currentView: ViewType;
  setView: (v: ViewType) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-50">
      {/* Top green bar */}
      <div
        className="w-full text-white py-2 px-4 text-center text-xs sm:text-sm font-medium tracking-wide"
        style={{ backgroundColor: "#009B3A" }}
      >
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">
            Royal Virgin Islands Police Force — Certificate Services
          </span>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("home")}>
            <PoliceShieldBadge size={40} />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-[#0C1B2A] leading-tight">
                BVI Cert
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                Police Certificate Services
              </p>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { key: "home" as ViewType, label: "Home", icon: Home },
              { key: "apply" as ViewType, label: "Apply Now", icon: FileText },
              { key: "track" as ViewType, label: "Track Application", icon: Search },
              { key: "info" as ViewType, label: "Information", icon: Info },
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={currentView === key ? "default" : "ghost"}
                size="sm"
                onClick={() => setView(key)}
                className={
                  currentView === key
                    ? "bg-[#009B3A] hover:bg-[#007a2e] text-white"
                    : "text-[#0C1B2A]"
                }
              >
                <Icon className="w-4 h-4 mr-1" />
                {label}
              </Button>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile nav menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
            {[
              { key: "home" as ViewType, label: "Home", icon: Home },
              { key: "apply" as ViewType, label: "Apply Now", icon: FileText },
              { key: "track" as ViewType, label: "Track Application", icon: Search },
              { key: "info" as ViewType, label: "Information", icon: Info },
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={currentView === key ? "default" : "ghost"}
                className={`w-full justify-start ${
                  currentView === key
                    ? "bg-[#009B3A] hover:bg-[#007a2e] text-white"
                    : "text-[#0C1B2A]"
                }`}
                onClick={() => {
                  setView(key);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
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
    <footer
      className="mt-auto"
      style={{ backgroundColor: "#0C1B2A" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8 text-gray-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PoliceShieldBadge size={28} />
              <span className="text-white font-bold text-sm">
                BVI Cert
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Official online portal for Police Certificate and Character
              Certificate applications in the British Virgin Islands.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setView("apply")}
                  className="text-gray-400 hover:text-[#FFD100] transition-colors"
                >
                  Apply for Certificate
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("track")}
                  className="text-gray-400 hover:text-[#FFD100] transition-colors"
                >
                  Track Application
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("info")}
                  className="text-gray-400 hover:text-[#FFD100] transition-colors"
                >
                  Information &amp; FAQ
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">
              Contact Information
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#FFD100]" />
                <span>
                  Road Town Police Station
                  <br />
                  Tortola, British Virgin Islands
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 flex-shrink-0 text-[#FFD100]" />
                <span>+1 (284) 468-3701</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 flex-shrink-0 text-[#FFD100]" />
                <span>certificates@rvipf.gov.vg</span>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-6 bg-gray-700" />
        <div className="text-center text-[10px] text-gray-500 space-y-1">
          <p>
            &copy; {new Date().getFullYear()} Royal Virgin Islands Police
            Force. All rights reserved.
          </p>
          <p>
            This is an official government service. Unauthorized use or
            falsification of records is a criminal offense under the laws of
            the Virgin Islands.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  HOME VIEW                                                          */
/* ------------------------------------------------------------------ */

function HomeView({
  setView,
  startApplication,
}: {
  setView: (v: ViewType) => void;
  startApplication: (type: "police" | "character") => void;
}) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-16 sm:py-24 px-4 text-white overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0C1B2A 0%, #009B3A 60%, #007a2e 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FFD100] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#FFD100] blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
              <PoliceShieldBadge size={72} />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            Certificate Services
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-2 font-medium">
            Royal Virgin Islands Police Force
          </p>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Apply for your Police Certificate or Character Certificate
            online. Track your application status in real-time. Official
            government service for the British Virgin Islands.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => startApplication("police")}
              className="bg-[#FFD100] text-[#0C1B2A] hover:bg-[#e6bc00] font-bold text-base px-8 py-6"
            >
              <FileText className="w-5 h-5 mr-2" />
              Police Certificate
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => startApplication("character")}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-bold text-base px-8 py-6"
            >
              <ClipboardList className="w-5 h-5 mr-2" />
              Character Certificate
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Track */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-[#009B3A]/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#009B3A]/10 rounded-full">
                  <Search className="w-5 h-5 text-[#009B3A]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0C1B2A]">
                    Track Your Application
                  </h2>
                  <p className="text-sm text-gray-500">
                    Enter your tracking number to check status
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. BVI-2026-ABC123"
                  className="flex-1"
                  id="home-tracking-input"
                />
                <Button
                  onClick={() => {
                    const input = document.getElementById(
                      "home-tracking-input"
                    ) as HTMLInputElement;
                    if (input) {
                      localStorage.setItem(
                        "pendingTrack",
                        input.value.trim()
                      );
                    }
                    setView("track");
                  }}
                  className="bg-[#009B3A] hover:bg-[#007a2e] text-white px-6"
                >
                  Track
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Certificate Type Cards */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0C1B2A] mb-3">
            Certificate Types
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">
            Choose the certificate that fits your needs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className="cursor-pointer border-2 hover:border-[#009B3A] transition-all group hover:shadow-lg"
              onClick={() => startApplication("police")}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#009B3A]/10 rounded-xl group-hover:bg-[#009B3A]/20 transition-colors">
                    <Shield className="w-7 h-7 text-[#009B3A]" />
                  </div>
                  <div>
                    <CardTitle className="text-[#0C1B2A]">
                      Police Certificate
                    </CardTitle>
                    <CardDescription>
                      Certificate of Police Character
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#009B3A] mt-0.5 flex-shrink-0" />
                    Required for employment applications
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#009B3A] mt-0.5 flex-shrink-0" />
                    Immigration and visa processing
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#009B3A] mt-0.5 flex-shrink-0" />
                    Official government-issued document
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <span className="text-sm font-medium text-[#009B3A] group-hover:underline flex items-center gap-1">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </span>
              </CardFooter>
            </Card>

            <Card
              className="cursor-pointer border-2 hover:border-[#FFD100] transition-all group hover:shadow-lg"
              onClick={() => startApplication("character")}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#FFD100]/10 rounded-xl group-hover:bg-[#FFD100]/20 transition-colors">
                    <ClipboardList className="w-7 h-7 text-[#b89500]" />
                  </div>
                  <div>
                    <CardTitle className="text-[#0C1B2A]">
                      Character Certificate
                    </CardTitle>
                    <CardDescription>
                      Certificate of Good Character
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#b89500] mt-0.5 flex-shrink-0" />
                    Required for adoption proceedings
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#b89500] mt-0.5 flex-shrink-0" />
                    Education and scholarship applications
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#b89500] mt-0.5 flex-shrink-0" />
                    Professional licensing and registration
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <span className="text-sm font-medium text-[#b89500] group-hover:underline flex items-center gap-1">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </span>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="py-12 px-4"
        style={{ backgroundColor: "#f8faf9" }}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0C1B2A] mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            Get your certificate in 4 simple steps
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                icon: FileText,
                title: "Complete Application",
                desc: "Fill out the online form with your personal details and upload required documents.",
                color: "#009B3A",
              },
              {
                step: 2,
                icon: CreditCard,
                title: "Pay Fee",
                desc: "Pay the certificate processing fee of $20.00 per certificate at the station.",
                color: "#FFD100",
              },
              {
                step: 3,
                icon: Clock,
                title: "Processing",
                desc: "Your application is reviewed and verified. Track progress with your tracking number.",
                color: "#009B3A",
              },
              {
                step: 4,
                icon: CheckCircle2,
                title: "Collect Certificate",
                desc: "Pick up your certificate at Road Town Police Station with valid photo ID.",
                color: "#FFD100",
              },
            ].map(({ step, icon: Icon, title, desc, color }) => (
              <div key={step} className="relative text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                  style={{ backgroundColor: color }}
                >
                  <Icon
                    className="w-7 h-7"
                    style={{ color: color === "#FFD100" ? "#0C1B2A" : "#fff" }}
                  />
                </div>
                <div className="absolute top-0 right-1/2 translate-x-6 w-8 h-8 rounded-full bg-[#0C1B2A] text-white flex items-center justify-center text-sm font-bold">
                  {step}
                </div>
                <h3 className="font-bold text-[#0C1B2A] mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <CreditCard className="w-8 h-8 mx-auto mb-3 text-[#009B3A]" />
            <h3 className="font-bold text-[#0C1B2A] mb-1">Processing Fee</h3>
            <p className="text-2xl font-bold text-[#009B3A]">$20.00</p>
            <p className="text-xs text-gray-500 mt-1">Per certificate</p>
          </Card>
          <Card className="text-center p-6">
            <Clock className="w-8 h-8 mx-auto mb-3 text-[#FFD100]" />
            <h3 className="font-bold text-[#0C1B2A] mb-1">Processing Time</h3>
            <p className="text-2xl font-bold text-[#0C1B2A]">3 Days</p>
            <p className="text-xs text-gray-500 mt-1">Working days</p>
          </Card>
          <Card className="text-center p-6">
            <MapPin className="w-8 h-8 mx-auto mb-3 text-[#009B3A]" />
            <h3 className="font-bold text-[#0C1B2A] mb-1">Collection Point</h3>
            <p className="text-lg font-bold text-[#0C1B2A]">Road Town</p>
            <p className="text-xs text-gray-500 mt-1">Police Station</p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-12 px-4 text-white text-center"
        style={{ backgroundColor: "#009B3A" }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Ready to Apply?
          </h2>
          <p className="text-green-100 mb-6">
            Start your certificate application now. The process is quick and
            straightforward.
          </p>
          <Button
            size="lg"
            onClick={() => setView("apply")}
            className="bg-[#FFD100] text-[#0C1B2A] hover:bg-[#e6bc00] font-bold px-8 py-6"
          >
            Start Application <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APPLICATION FORM WIZARD                                            */
/* ------------------------------------------------------------------ */

function ApplicationWizard({
  initialType,
  setView,
}: {
  initialType: "police" | "character" | "";
  setView: (v: ViewType) => void;
}) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem("rvipf_draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...initialFormData, ...parsed };
      } catch {
        // ignore
      }
    }
    return {
      ...initialFormData,
      type: initialType || "",
    };
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

  // Save to localStorage on change
  useEffect(() => {
    if (step < 5) {
      localStorage.setItem("rvipf_draft", JSON.stringify(formData));
    }
  }, [formData, step]);

  // Calculate age
  useEffect(() => {
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (!isNaN(dob.getTime())) {
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        setFormData((prev) => ({ ...prev, age: String(age) }));
      }
    }
  }, [formData.dateOfBirth]);

  const updateField = useCallback(
    (field: keyof FormData, value: string | number | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [errors]
  );

  const validateStep = useCallback(
    (s: number): boolean => {
      const e: Record<string, string> = {};

      if (s === 0) {
        if (!formData.type) e.type = "Please select certificate type.";
        if (!formData.surname.trim()) e.surname = "Surname is required.";
        if (!formData.givenNames.trim())
          e.givenNames = "Given names are required.";
        if (!formData.sex) e.sex = "Please select sex.";
        if (!formData.dateOfBirth)
          e.dateOfBirth = "Date of birth is required.";
        if (!formData.placeOfBirth.trim())
          e.placeOfBirth = "Place of birth is required.";
        if (!formData.nationality.trim())
          e.nationality = "Nationality is required.";
        if (!formData.occupation.trim())
          e.occupation = "Occupation is required.";
      }

      if (s === 1) {
        if (!formData.physicalAddress.trim())
          e.physicalAddress = "Physical address is required.";
        if (!formData.contactNumber.trim())
          e.contactNumber = "Contact number is required.";
      }

      if (s === 2) {
        if (!formData.purpose) e.purpose = "Please select a purpose.";
        if (formData.purpose === "Other" && !formData.purposeOther.trim()) {
          e.purposeOther = "Please specify the purpose.";
        }
      }

      if (s === 4) {
        if (!formData.declaration1)
          e.declaration1 =
            "You must declare that all information is true and correct.";
        if (!formData.declaration2)
          e.declaration2 =
            "You must acknowledge that providing false information is an offense.";
      }

      setErrors(e);
      return Object.keys(e).length === 0;
    },
    [formData]
  );

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => s + 1);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleFileChange = (
    field: "passportPhoto" | "passportCopy",
    file: File | null
  ) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Only JPEG, PNG, and WebP images are accepted.",
        variant: "destructive",
      });
      return;
    }
    if (field === "passportPhoto") {
      setPassportPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPassportPhotoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPassportCopy(file);
      const reader = new FileReader();
      reader.onload = (e) => setPassportCopyPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setIsSubmitting(true);

    try {
      const data = new FormData();
      // Append all form fields
      for (const [key, value] of Object.entries(formData)) {
        if (key !== "declaration1" && key !== "declaration2" && key !== "isOwner") {
          data.append(key, String(value));
        }
      }
      if (passportPhoto) data.append("passportPhoto", passportPhoto);
      if (passportCopy) data.append("passportCopy", passportCopy);

      const response = await fetch("/api/submit-application", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setSubmittedTracking(result.trackingNumber);
        localStorage.removeItem("rvipf_draft");
        setStep(5);
        toast({
          title: "Application Submitted!",
          description: `Your tracking number is ${result.trackingNumber}`,
        });
      } else {
        const msg =
          result.errors?.map((e: { field: string; message: string }) => e.message).join(". ") ||
          result.error ||
          "Submission failed. Please try again.";
        toast({
          title: "Submission Failed",
          description: msg,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Step renderers */

  const renderStep0 = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0C1B2A]">
        Certificate Type &amp; Personal Information
      </h3>

      {/* Certificate type */}
      <div className="space-y-2">
        <Label className="font-semibold">Certificate Type *</Label>
        <RadioGroup
          value={formData.type}
          onValueChange={(v) => updateField("type", v)}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Label
            htmlFor="type-police"
            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              formData.type === "police"
                ? "border-[#009B3A] bg-[#009B3A]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <RadioGroupItem value="police" id="type-police" />
            <Shield className="w-5 h-5 text-[#009B3A]" />
            <div>
              <span className="font-medium">Police Certificate</span>
              <p className="text-xs text-gray-500">
                Certificate of Police Character
              </p>
            </div>
          </Label>
          <Label
            htmlFor="type-character"
            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              formData.type === "character"
                ? "border-[#FFD100] bg-[#FFD100]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <RadioGroupItem value="character" id="type-character" />
            <ClipboardList className="w-5 h-5 text-[#b89500]" />
            <div>
              <span className="font-medium">Character Certificate</span>
              <p className="text-xs text-gray-500">
                Certificate of Good Character
              </p>
            </div>
          </Label>
        </RadioGroup>
        {errors.type && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.type}
          </p>
        )}
      </div>

      <Separator />

      {/* Name fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="surname">
            Surname / Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="surname"
            placeholder="e.g. Smith"
            value={formData.surname}
            onChange={(e) => updateField("surname", e.target.value)}
          />
          {errors.surname && (
            <p className="text-sm text-red-500">{errors.surname}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="givenNames">
            Given Names / First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="givenNames"
            placeholder="e.g. John William"
            value={formData.givenNames}
            onChange={(e) => updateField("givenNames", e.target.value)}
          />
          {errors.givenNames && (
            <p className="text-sm text-red-500">{errors.givenNames}</p>
          )}
        </div>
      </div>

      {/* Sex & DOB */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>
            Sex <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.sex}
            onValueChange={(v) => updateField("sex", v)}
            className="flex gap-4 pt-2"
          >
            <Label className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="Male" />
              Male
            </Label>
            <Label className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="Female" />
              Female
            </Label>
          </RadioGroup>
          {errors.sex && (
            <p className="text-sm text-red-500">{errors.sex}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dateOfBirth">
            Date of Birth <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateField("dateOfBirth", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            value={formData.age}
            readOnly
            className="bg-gray-50"
            placeholder="Auto-calculated"
          />
        </div>
      </div>

      {/* Place of birth, nationality, occupation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="placeOfBirth">
            Place of Birth <span className="text-red-500">*</span>
          </Label>
          <Input
            id="placeOfBirth"
            placeholder="e.g. Road Town, Tortola"
            value={formData.placeOfBirth}
            onChange={(e) => updateField("placeOfBirth", e.target.value)}
          />
          {errors.placeOfBirth && (
            <p className="text-sm text-red-500">{errors.placeOfBirth}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nationality">
            Nationality <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nationality"
            placeholder="e.g. British Virgin Islander"
            value={formData.nationality}
            onChange={(e) => updateField("nationality", e.target.value)}
          />
          {errors.nationality && (
            <p className="text-sm text-red-500">{errors.nationality}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="occupation">
            Occupation <span className="text-red-500">*</span>
          </Label>
          <Input
            id="occupation"
            placeholder="e.g. Teacher"
            value={formData.occupation}
            onChange={(e) => updateField("occupation", e.target.value)}
          />
          {errors.occupation && (
            <p className="text-sm text-red-500">{errors.occupation}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0C1B2A]">
        Contact &amp; Residence Information
      </h3>

      <div className="space-y-1.5">
        <Label htmlFor="physicalAddress">
          Physical Address <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="physicalAddress"
          placeholder="e.g. 12 Main Street, Road Town, Tortola, BVI"
          rows={2}
          value={formData.physicalAddress}
          onChange={(e) => updateField("physicalAddress", e.target.value)}
        />
        {errors.physicalAddress && (
          <p className="text-sm text-red-500">{errors.physicalAddress}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Checkbox
            id="isOwner"
            checked={formData.isOwner}
            onCheckedChange={(v) => updateField("isOwner", !!v)}
          />
          <Label htmlFor="isOwner" className="cursor-pointer">
            I am the owner of the premises
          </Label>
        </div>
        {!formData.isOwner && (
          <div className="mt-2">
            <Label htmlFor="premisesOwner">Name of Premises Owner</Label>
            <Input
              id="premisesOwner"
              placeholder="Name of property owner"
              value={formData.premisesOwner}
              onChange={(e) => updateField("premisesOwner", e.target.value)}
              className="mt-1"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="contactNumber">
            Contact Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contactNumber"
            type="tel"
            placeholder="+1 (284) XXX-XXXX"
            value={formData.contactNumber}
            onChange={(e) => updateField("contactNumber", e.target.value)}
          />
          {errors.contactNumber && (
            <p className="text-sm text-red-500">{errors.contactNumber}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address (Optional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="countriesBefore">
          Countries lived in before BVI (Optional)
        </Label>
        <Textarea
          id="countriesBefore"
          placeholder="List countries and duration of residence, if applicable"
          rows={3}
          value={formData.countriesBefore}
          onChange={(e) => updateField("countriesBefore", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dateArrivedBVI">Date arrived in BVI (Optional)</Label>
        <Input
          id="dateArrivedBVI"
          type="date"
          value={formData.dateArrivedBVI}
          onChange={(e) => updateField("dateArrivedBVI", e.target.value)}
          max={new Date().toISOString().split("T")[0]}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0C1B2A]">
        Certificate Details
      </h3>

      <div className="space-y-1.5">
        <Label htmlFor="purpose">
          Purpose of Certificate <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.purpose}
          onValueChange={(v) => updateField("purpose", v)}
        >
          <SelectTrigger id="purpose">
            <SelectValue placeholder="Select purpose..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Employment">Employment</SelectItem>
            <SelectItem value="Immigration">Immigration</SelectItem>
            <SelectItem value="Adoption">Adoption</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Travel">Travel</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.purpose && (
          <p className="text-sm text-red-500">{errors.purpose}</p>
        )}
      </div>

      {formData.purpose === "Other" && (
        <div className="space-y-1.5">
          <Label htmlFor="purposeOther">
            Please specify purpose <span className="text-red-500">*</span>
          </Label>
          <Input
            id="purposeOther"
            placeholder="Specify the purpose..."
            value={formData.purposeOther}
            onChange={(e) => updateField("purposeOther", e.target.value)}
          />
          {errors.purposeOther && (
            <p className="text-sm text-red-500">{errors.purposeOther}</p>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="certCount">Number of Certificates</Label>
        <Select
          value={String(formData.certificateCount)}
          onValueChange={(v) => updateField("certificateCount", parseInt(v, 10))}
        >
          <SelectTrigger id="certCount">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 ($20.00)</SelectItem>
            <SelectItem value="2">2 ($40.00)</SelectItem>
            <SelectItem value="3">3 ($60.00)</SelectItem>
            <SelectItem value="4">4 ($80.00)</SelectItem>
            <SelectItem value="5">5 ($100.00)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Fee: ${formData.certificateCount * 20}.00 total
        </p>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="font-semibold">
          Have you ever been convicted in the British Virgin Islands?{" "}
          <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.convicted}
          onValueChange={(v) => updateField("convicted", v)}
          className="flex gap-4"
        >
          <Label className="flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="Yes" />
            Yes
          </Label>
          <Label className="flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="No" />
            No
          </Label>
        </RadioGroup>
        {errors.convicted && (
          <p className="text-sm text-red-500">{errors.convicted}</p>
        )}
      </div>

      {formData.convicted === "Yes" && (
        <div className="space-y-1.5 p-4 bg-red-50 rounded-lg border border-red-200">
          <Label htmlFor="convictionDetails">
            Conviction Details (Year(s) and nature of conviction)
          </Label>
          <Textarea
            id="convictionDetails"
            placeholder="Please provide details of the conviction(s)..."
            rows={3}
            value={formData.convictionDetails}
            onChange={(e) =>
              updateField("convictionDetails", e.target.value)
            }
          />
          <Alert className="mt-2">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>
              Convictions will be verified during processing.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0C1B2A]">
        Document Upload
      </h3>
      <p className="text-sm text-gray-500">
        Upload a passport-size photograph and a copy or photo of your
        passport. Accepted formats: JPEG, PNG, WebP. Maximum file size: 5MB.
      </p>

      {/* Passport Photo */}
      <div className="space-y-2">
        <Label className="font-semibold">
          Passport-Size Photograph <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-[#009B3A] hover:bg-[#009B3A]/5 transition-all"
            onClick={() => passportPhotoRef.current?.click()}
          >
            {passportPhotoPreview ? (
              <div className="relative">
                <img
                  src={passportPhotoPreview}
                  alt="Passport Photo Preview"
                  className="w-32 h-40 object-cover mx-auto rounded-lg border"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Click to change photo
                </p>
              </div>
            ) : (
              <>
                <Camera className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-600">
                  Upload Passport Photo
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Click or tap to select
                </p>
              </>
            )}
            <input
              ref={passportPhotoRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file) handleFileChange("passportPhoto", file);
              }}
            />
          </div>
          <div className="space-y-2 text-sm text-gray-500">
            <p className="font-medium text-[#0C1B2A]">Requirements:</p>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#009B3A] mt-0.5" />
                Recent passport-size photograph
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#009B3A] mt-0.5" />
                White or light background
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#009B3A] mt-0.5" />
                Clear face, no sunglasses or hats
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#009B3A] mt-0.5" />
                JPEG, PNG, or WebP format
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#009B3A] mt-0.5" />
                Maximum 5MB file size
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      {/* Passport Copy */}
      <div className="space-y-2">
        <Label className="font-semibold">
          Passport Copy / Photo
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-[#009B3A] hover:bg-[#009B3A]/5 transition-all"
            onClick={() => passportCopyRef.current?.click()}
          >
            {passportCopyPreview ? (
              <div className="relative">
                <img
                  src={passportCopyPreview}
                  alt="Passport Copy Preview"
                  className="max-w-full max-h-48 object-contain mx-auto rounded-lg border"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Click to change file
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-600">
                  Upload Passport Copy
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Click or tap to select
                </p>
              </>
            )}
            <input
              ref={passportCopyRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file) handleFileChange("passportCopy", file);
              }}
            />
          </div>
          <div className="space-y-2 text-sm text-gray-500">
            <p className="font-medium text-[#0C1B2A]">Requirements:</p>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#009B3A] mt-0.5" />
                Clear photo or scan of passport
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#009B3A] mt-0.5" />
                Must show photo page with details
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#009B3A] mt-0.5" />
                All text must be legible
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#009B3A] mt-0.5" />
                JPEG, PNG, or WebP format
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#009B3A] mt-0.5" />
                Maximum 5MB file size
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0C1B2A]">
        Review &amp; Submit
      </h3>
      <p className="text-sm text-gray-500">
        Please review all information before submitting your application.
      </p>

      <div className="space-y-4">
        {/* Certificate Type */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  formData.type === "police"
                    ? "border-[#009B3A] text-[#009B3A]"
                    : "border-[#b89500] text-[#b89500]"
                }
              >
                {formData.type === "police"
                  ? "Police Certificate"
                  : "Character Certificate"}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Personal Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#0C1B2A]">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Full Name:</span>{" "}
                <span className="font-medium">
                  {formData.givenNames} {formData.surname}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Sex:</span>{" "}
                <span className="font-medium">{formData.sex}</span>
              </div>
              <div>
                <span className="text-gray-500">Date of Birth:</span>{" "}
                <span className="font-medium">{formData.dateOfBirth}</span>
              </div>
              <div>
                <span className="text-gray-500">Age:</span>{" "}
                <span className="font-medium">{formData.age || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-500">Place of Birth:</span>{" "}
                <span className="font-medium">{formData.placeOfBirth}</span>
              </div>
              <div>
                <span className="text-gray-500">Nationality:</span>{" "}
                <span className="font-medium">{formData.nationality}</span>
              </div>
              <div>
                <span className="text-gray-500">Occupation:</span>{" "}
                <span className="font-medium">{formData.occupation}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#0C1B2A]">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="sm:col-span-2">
                <span className="text-gray-500">Address:</span>{" "}
                <span className="font-medium">{formData.physicalAddress}</span>
              </div>
              {formData.premisesOwner && (
                <div>
                  <span className="text-gray-500">Premises Owner:</span>{" "}
                  <span className="font-medium">
                    {formData.premisesOwner}
                  </span>
                </div>
              )}
              <div>
                <span className="text-gray-500">Contact:</span>{" "}
                <span className="font-medium">{formData.contactNumber}</span>
              </div>
              {formData.email && (
                <div>
                  <span className="text-gray-500">Email:</span>{" "}
                  <span className="font-medium">{formData.email}</span>
                </div>
              )}
              {formData.countriesBefore && (
                <div className="sm:col-span-2">
                  <span className="text-gray-500">
                    Countries before BVI:
                  </span>{" "}
                  <span className="font-medium">
                    {formData.countriesBefore}
                  </span>
                </div>
              )}
              {formData.dateArrivedBVI && (
                <div>
                  <span className="text-gray-500">Arrived in BVI:</span>{" "}
                  <span className="font-medium">
                    {formData.dateArrivedBVI}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Certificate Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#0C1B2A]">
              Certificate Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Purpose:</span>{" "}
                <span className="font-medium">
                  {formData.purpose === "Other"
                    ? formData.purposeOther
                    : formData.purpose}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Quantity:</span>{" "}
                <span className="font-medium">
                  {formData.certificateCount} (
                  ${formData.certificateCount * 20}.00)
                </span>
              </div>
              <div>
                <span className="text-gray-500">Convicted in BVI:</span>{" "}
                <Badge
                  variant={formData.convicted === "No" ? "default" : "destructive"}
                  className={
                    formData.convicted === "No"
                      ? "bg-[#009B3A]"
                      : ""
                  }
                >
                  {formData.convicted}
                </Badge>
              </div>
              {formData.convicted === "Yes" && formData.convictionDetails && (
                <div className="sm:col-span-2">
                  <span className="text-gray-500">Conviction Details:</span>{" "}
                  <span className="font-medium">
                    {formData.convictionDetails}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#0C1B2A]">
              Uploaded Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                {passportPhotoPreview ? (
                  <CheckCircle2 className="w-4 h-4 text-[#009B3A]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                )}
                <span>Passport Photo</span>
              </div>
              <div className="flex items-center gap-2">
                {passportCopyPreview ? (
                  <CheckCircle2 className="w-4 h-4 text-[#009B3A]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                )}
                <span>Passport Copy</span>
              </div>
            </div>
            {!passportPhotoPreview && (
              <p className="text-xs text-orange-500 mt-1">
                It is recommended to upload a passport photo before submitting.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Declarations */}
      <Separator />
      <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
        <h4 className="font-semibold text-[#0C1B2A] text-sm">Declarations</h4>

        <div className="flex items-start gap-3">
          <Checkbox
            id="declaration1"
            checked={formData.declaration1}
            onCheckedChange={(v) => updateField("declaration1", !!v)}
            className="mt-1"
          />
          <Label htmlFor="declaration1" className="text-sm leading-relaxed cursor-pointer">
            I hereby declare that all information provided in this application
            is true and correct to the best of my knowledge and belief.
          </Label>
        </div>
        {errors.declaration1 && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.declaration1}
          </p>
        )}

        <div className="flex items-start gap-3">
          <Checkbox
            id="declaration2"
            checked={formData.declaration2}
            onCheckedChange={(v) => updateField("declaration2", !!v)}
            className="mt-1"
          />
          <Label htmlFor="declaration2" className="text-sm leading-relaxed cursor-pointer">
            I understand that providing false information or making a false
            declaration is a criminal offense under the laws of the Virgin
            Islands and may result in prosecution.
          </Label>
        </div>
        {errors.declaration2 && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.declaration2}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center space-y-6 py-6">
      <div className="flex justify-center">
        <div className="p-6 bg-[#009B3A]/10 rounded-full">
          <CheckCircle2 className="w-20 h-20 text-[#009B3A]" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#0C1B2A] mb-2">
          Application Submitted Successfully!
        </h2>
        <p className="text-gray-500">
          Your application has been received and is being processed.
        </p>
      </div>

      <Card className="max-w-md mx-auto border-2 border-[#009B3A]/30">
        <CardContent className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Tracking Number</p>
            <p className="text-2xl font-bold text-[#009B3A] font-mono tracking-wider">
              {submittedTracking}
            </p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Applicant</p>
              <p className="font-medium">
                {formData.givenNames} {formData.surname}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Certificate Type</p>
              <p className="font-medium capitalize">{formData.type}</p>
            </div>
            <div>
              <p className="text-gray-500">Fee Amount</p>
              <p className="font-medium">
                ${formData.certificateCount * 20}.00
              </p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <Badge className="bg-[#FFD100] text-[#0C1B2A]">Pending</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="max-w-md mx-auto">
        <Info className="w-4 h-4" />
        <AlertTitle>Next Steps</AlertTitle>
        <AlertDescription className="text-sm">
          <ol className="list-decimal list-inside space-y-1 mt-1">
            <li>
              Pay the processing fee of{" "}
              <strong>${formData.certificateCount * 20}.00</strong> at the
              Road Town Police Station.
            </li>
            <li>
              Your certificate will be ready in{" "}
              <strong>3 working days</strong>.
            </li>
            <li>
              Collect your certificate at the Road Town Police Station with
              valid photo ID.
            </li>
            <li>
              Save your tracking number:{" "}
              <strong className="text-[#009B3A]">{submittedTracking}</strong>
            </li>
          </ol>
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={() => {
            localStorage.setItem("pendingTrack", submittedTracking);
            setView("track");
          }}
          className="bg-[#009B3A] hover:bg-[#007a2e] text-white"
        >
          <Search className="w-4 h-4 mr-2" />
          Track This Application
        </Button>
        <Button variant="outline" onClick={() => setView("home")}>
          Return to Home
        </Button>
      </div>

      <Button
        variant="ghost"
        className="text-gray-400"
        onClick={() => window.print()}
      >
        <PrinterIcon className="w-4 h-4 mr-2" />
        Print This Page
      </Button>
    </div>
  );

  const stepRenderers = [
    renderStep0,
    renderStep1,
    renderStep2,
    renderStep3,
    renderStep4,
    renderStep5,
  ];

  const progressValue = Math.round((step / (steps.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("home")}
              className="text-gray-500"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Home
            </Button>
            <span className="text-sm text-gray-500">
              Step {step + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progressValue} className="h-2" />
          {/* Step indicators */}
          <div className="hidden sm:flex justify-between mt-3">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  i < step
                    ? "text-[#009B3A] font-medium"
                    : i === step
                    ? "text-[#0C1B2A] font-bold"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i < step
                      ? "bg-[#009B3A] text-white"
                      : i === step
                      ? "bg-[#009B3A]/20 text-[#009B3A]"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i < step ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className="hidden md:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {stepRenderers[step]()}
          </CardContent>
          {/* Navigation buttons */}
          {step < 5 && (
            <CardFooter className="px-6 pb-6 pt-0 flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              {step < 4 ? (
                <Button onClick={handleNext} className="bg-[#009B3A] hover:bg-[#007a2e] text-white">
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#009B3A] hover:bg-[#007a2e] text-white min-w-[140px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TRACK VIEW                                                         */
/* ------------------------------------------------------------------ */

function TrackView() {
  const { toast } = useToast();
  const [trackingInput, setTrackingInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const pending = localStorage.getItem("pendingTrack");
    if (pending) {
      setTrackingInput(pending);
      localStorage.removeItem("pendingTrack");
    }
  }, []);

  const handleTrack = async () => {
    const trimmed = trackingInput.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a tracking number.");
      return;
    }
    if (!/^BVI-\d{4}-[A-Z0-9]{6}$/.test(trimmed)) {
      setError("Format should be BVI-YYYY-XXXXXX");
      return;
    }

    setError("");
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/track?tracking=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (data.success) {
        setResult(data.application);
      } else {
        setError(data.error || "Application not found.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: React.ElementType; desc: string }
  > = {
    pending: {
      label: "Pending",
      color: "bg-orange-100 text-orange-700 border-orange-200",
      icon: Clock,
      desc: "Your application has been received and is awaiting processing.",
    },
    processing: {
      label: "Processing",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: Loader2,
      desc: "Your application is being reviewed and verified.",
    },
    ready: {
      label: "Ready for Collection",
      color: "bg-green-100 text-green-700 border-green-200",
      icon: CheckCircle2,
      desc: "Your certificate is ready. Please collect it at Road Town Police Station.",
    },
    collected: {
      label: "Collected",
      color: "bg-gray-100 text-gray-700 border-gray-200",
      icon: CheckCircle2,
      desc: "Your certificate has been collected.",
    },
    rejected: {
      label: "Rejected",
      color: "bg-red-100 text-red-700 border-red-200",
      icon: AlertCircle,
      desc: "Your application was not approved. Please contact the police station for details.",
    },
  };

  const timelineSteps = [
    { key: "pending", label: "Application Received" },
    { key: "processing", label: "Under Review" },
    { key: "ready", label: "Ready for Collection" },
    { key: "collected", label: "Collected" },
  ];

  const getStatusIndex = (status: string) => {
    const idx = timelineSteps.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : status === "rejected" ? -1 : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#009B3A]/10 rounded-full">
              <Search className="w-8 h-8 text-[#009B3A]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#0C1B2A]">
            Track Your Application
          </h2>
          <p className="text-gray-500 mt-1">
            Enter your tracking number to check the status of your certificate
            application
          </p>
        </div>

        {/* Search */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-1">
                <Label htmlFor="track-input">Tracking Number</Label>
                <Input
                  id="track-input"
                  placeholder="e.g. BVI-2026-ABC123"
                  value={trackingInput}
                  onChange={(e) => {
                    setTrackingInput(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  className="font-mono uppercase"
                />
                {error && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </p>
                )}
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleTrack}
                  disabled={isLoading}
                  className="bg-[#009B3A] hover:bg-[#007a2e] text-white w-full sm:w-auto px-8"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Track
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="shadow-lg border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#0C1B2A]">
                  Application Status
                </CardTitle>
                <Badge
                  variant="outline"
                  className={
                    statusConfig[result.status]?.color || "bg-gray-100"
                  }
                >
                  {(() => {
                    const cfg = statusConfig[result.status];
                    if (!cfg) return result.status;
                    const Icon = cfg.icon;
                    return (
                      <span className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                    );
                  })()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <p className="text-sm text-gray-600">
                {statusConfig[result.status]?.desc || ""}
              </p>

              {/* Timeline */}
              {result.status !== "rejected" && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#0C1B2A]">
                    Progress Timeline
                  </h4>
                  <div className="space-y-0">
                    {timelineSteps.map((s, i) => {
                      const currentIdx = getStatusIndex(result.status);
                      const isCompleted = i <= currentIdx;
                      const isCurrent = i === currentIdx;
                      return (
                        <div key={s.key} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            {isCompleted ? (
                              <CircleCheckBig className="w-6 h-6 text-[#009B3A]" />
                            ) : isCurrent ? (
                              <CircleDot className="w-6 h-6 text-[#009B3A] animate-pulse" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-300" />
                            )}
                            {i < timelineSteps.length - 1 && (
                              <div
                                className={`w-0.5 h-8 ${
                                  i < currentIdx ? "bg-[#009B3A]" : "bg-gray-200"
                                }`}
                              />
                            )}
                          </div>
                          <div className="pt-0.5">
                            <p
                              className={`text-sm font-medium ${
                                isCompleted
                                  ? "text-[#0C1B2A]"
                                  : "text-gray-400"
                              }`}
                            >
                              {s.label}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Details */}
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Tracking Number:</span>
                  <p className="font-mono font-bold text-[#009B3A]">
                    {result.trackingNumber}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Applicant:</span>
                  <p className="font-medium">
                    {result.givenNames} {result.surname}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Certificate Type:</span>
                  <p className="font-medium capitalize">{result.type}</p>
                </div>
                <div>
                  <span className="text-gray-500">Payment Status:</span>
                  <Badge
                    variant={
                      result.paymentStatus === "paid"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      result.paymentStatus === "paid" ? "bg-[#009B3A]" : ""
                    }
                  >
                    {result.paymentStatus}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-500">Fee Amount:</span>
                  <p className="font-medium">
                    ${result.paymentAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Date Submitted:</span>
                  <p className="font-medium">
                    {new Date(result.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {result.certificateNumber && (
                  <div>
                    <span className="text-gray-500">Certificate No.:</span>
                    <p className="font-mono font-medium">
                      {result.certificateNumber}
                    </p>
                  </div>
                )}
                {result.dateIssued && (
                  <div>
                    <span className="text-gray-500">Date Issued:</span>
                    <p className="font-medium">
                      {new Date(result.dateIssued).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>

              {result.status === "ready" && (
                <Alert className="border-[#009B3A]">
                  <MapPin className="w-4 h-4 text-[#009B3A]" />
                  <AlertTitle>Ready for Collection</AlertTitle>
                  <AlertDescription className="text-sm">
                    Your certificate is ready for collection at the Road Town
                    Police Station. Please bring valid photo ID and your
                    tracking number.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!result && !isLoading && !error && (
          <div className="text-center py-12 text-gray-400">
            <Shield className="w-16 h-16 mx-auto mb-3 opacity-30" />
            <p>Enter your tracking number above to view your application status</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  INFORMATION VIEW                                                   */
/* ------------------------------------------------------------------ */

function InfoView({ setView }: { setView: (v: ViewType) => void }) {
  const faqs = [
    {
      q: "What is a Police Certificate?",
      a: "A Police Certificate (Certificate of Police Character) is an official document issued by the Royal Virgin Islands Police Force that confirms whether a person has any criminal record in the British Virgin Islands. It is commonly required for employment, immigration, and other official purposes.",
    },
    {
      q: "What is the difference between a Police Certificate and a Character Certificate?",
      a: "A Police Certificate specifically confirms your criminal record status in the BVI. A Character Certificate attests to your general character and conduct in the community. Both are official documents issued by the BVI Police Force but serve different purposes.",
    },
    {
      q: "How long does processing take?",
      a: "Applications are typically processed within 3 working days, provided all required documents have been submitted and the processing fee has been paid. Complex cases may take longer.",
    },
    {
      q: "What is the processing fee?",
      a: "The fee is $20.00 (Eastern Caribbean Dollars) per certificate. Payment is made at the Road Town Police Station when submitting your application or during processing.",
    },
    {
      q: "What documents do I need to provide?",
      a: "You will need: a completed application form, a recent passport-size photograph, and a copy of your passport (photo page). Additional documents may be required depending on your application.",
    },
    {
      q: "Can someone else apply on my behalf?",
      a: "Yes, a representative may submit the application on your behalf, but they will need your completed form, original documents, and a signed authorization letter. The certificate must still be collected by the applicant with valid photo ID.",
    },
    {
      q: "What if I have a criminal conviction?",
      a: "You must declare any convictions in your application. The certificate will accurately reflect your criminal record status. Failure to disclose convictions is an offense under Virgin Islands law.",
    },
    {
      q: "How long is the certificate valid?",
      a: "Police Certificates and Character Certificates are typically valid for 6 months from the date of issue, though this may vary depending on the requesting organization's requirements.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#009B3A]/10 rounded-full">
              <Info className="w-8 h-8 text-[#009B3A]" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0C1B2A]">
            Information &amp; Help
          </h2>
          <p className="text-gray-500 mt-2">
            Everything you need to know about applying for certificates
          </p>
        </div>

        {/* Process Steps */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-[#0C1B2A] flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#009B3A]" />
              How to Obtain a Certificate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Complete Online Application",
                  desc: "Fill out the application form with your personal details, contact information, and certificate requirements. Upload a passport-size photograph and a copy of your passport.",
                },
                {
                  step: 2,
                  title: "Pay Processing Fee",
                  desc: "Visit the Road Town Police Station to pay the processing fee of $20.00 per certificate. Bring your tracking number for reference.",
                },
                {
                  step: 3,
                  title: "Application Review",
                  desc: "The BVI Police Force will review your application and verify your information. This includes checking your identity and any relevant records. You can track your application status online.",
                },
                {
                  step: 4,
                  title: "Certificate Issuance",
                  desc: "Once approved, your certificate will be ready for collection at the Road Town Police Station within 3 working days. Bring valid photo ID and your tracking number.",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#009B3A] text-white flex items-center justify-center font-bold text-sm">
                    {step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0C1B2A] mb-1">
                      {title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-[#0C1B2A] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#009B3A]" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                {
                  icon: Camera,
                  title: "Passport-Size Photograph",
                  desc: "Recent photograph with white/light background, clear face, no sunglasses or headwear.",
                },
                {
                  icon: Upload,
                  title: "Passport Copy",
                  desc: "Clear copy or photo of your passport photo page showing your details.",
                },
                {
                  icon: CreditCard,
                  title: "Processing Fee",
                  desc: "$20.00 per certificate, payable at Road Town Police Station.",
                },
                {
                  icon: Building2,
                  title: "Valid Photo ID",
                  desc: "Required for collection: passport, driver's license, or national ID.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-3">
                  <div className="p-2 bg-[#009B3A]/10 rounded-lg flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#009B3A]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#0C1B2A]">
                      {title}
                    </p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Fees */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-[#0C1B2A] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#FFD100]" />
              Fees &amp; Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-[#FFD100]/10 rounded-lg border border-[#FFD100]/30">
              <div className="text-center">
                <p className="text-sm text-gray-600">Processing Fee Per Certificate</p>
                <p className="text-3xl font-bold text-[#0C1B2A]">$20.00</p>
                <p className="text-xs text-gray-500 mt-1">Eastern Caribbean Dollars (XCD)</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Payment Location:</strong> Road Town Police Station,
                Tortola, British Virgin Islands
              </p>
              <p>
                <strong>Payment Methods:</strong> Cash, debit card, or credit
                card accepted at the station.
              </p>
              <p>
                <strong>Multiple Certificates:</strong> If you need more than
                one certificate, each additional copy costs $20.00.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-[#0C1B2A] flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#009B3A]" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-[#009B3A] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-[#0C1B2A]">Address</p>
                  <p className="text-sm text-gray-600">
                    Road Town Police Station
                    <br />
                    Tortola, British Virgin Islands
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-[#009B3A] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-[#0C1B2A]">Phone</p>
                  <p className="text-sm text-gray-600">+1 (284) 468-3701</p>
                  <p className="text-xs text-gray-400">
                    Mon-Fri: 8:00 AM - 4:30 PM
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-[#009B3A] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-[#0C1B2A]">Email</p>
                  <p className="text-sm text-gray-600">
                    certificates@rvipf.gov.vg
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-[#009B3A] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-[#0C1B2A]">
                    Office Hours
                  </p>
                  <p className="text-sm text-gray-600">
                    Monday - Friday
                    <br />
                    8:00 AM - 4:30 PM
                  </p>
                  <p className="text-xs text-gray-400">
                    Closed on public holidays
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#0C1B2A] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#009B3A]" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Find answers to common questions about certificate applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-sm text-left hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-8">
          <p className="text-gray-500 mb-3">
            Ready to apply? Start your application now.
          </p>
          <Button
            onClick={() => setView("apply")}
            className="bg-[#009B3A] hover:bg-[#007a2e] text-white px-8"
          >
            Start Application <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [initialType, setInitialType] = useState<"police" | "character" | "">("");

  const startApplication = useCallback(
    (type: "police" | "character") => {
      setInitialType(type);
      setCurrentView("apply");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    []
  );

  const handleSetView = useCallback((view: ViewType) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        currentView={currentView}
        setView={handleSetView}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="flex-1">
        {currentView === "home" && (
          <HomeView setView={handleSetView} startApplication={startApplication} />
        )}
        {currentView === "apply" && (
          <ApplicationWizard initialType={initialType} setView={handleSetView} />
        )}
        {currentView === "track" && <TrackView />}
        {currentView === "info" && <InfoView setView={handleSetView} />}
      </main>

      <Footer setView={handleSetView} />
    </div>
  );
}
