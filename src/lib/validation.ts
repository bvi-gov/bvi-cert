import { z } from "zod/v4";

const purposeOptions = [
  "Employment",
  "Immigration",
  "Adoption",
  "Education",
  "Travel",
  "Other",
] as const;

export const certificateApplicationSchema = z.object({
  type: z.enum(["police", "character"], {
    error: "Please select a certificate type.",
  }),
  // Personal Information
  surname: z
    .string()
    .min(2, "Surname must be at least 2 characters.")
    .max(100, "Surname must be under 100 characters."),
  givenNames: z
    .string()
    .min(2, "Given names must be at least 2 characters.")
    .max(200, "Given names must be under 200 characters."),
  sex: z.enum(["Male", "Female"], {
    error: "Please select sex.",
  }),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required.")
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date < new Date();
      },
      { error: "Please enter a valid date of birth." }
    ),
  age: z.string().optional(),
  placeOfBirth: z
    .string()
    .min(2, "Place of birth is required.")
    .max(200, "Place of birth must be under 200 characters."),
  nationality: z
    .string()
    .min(2, "Nationality is required.")
    .max(100, "Nationality must be under 100 characters."),
  occupation: z
    .string()
    .min(2, "Occupation is required.")
    .max(200, "Occupation must be under 200 characters."),

  // Contact & Residence
  physicalAddress: z
    .string()
    .min(5, "Physical address must be at least 5 characters.")
    .max(500, "Physical address must be under 500 characters."),
  premisesOwner: z.string().max(200).optional(),
  contactNumber: z
    .string()
    .min(7, "Please enter a valid contact number.")
    .max(20, "Contact number is too long."),
  email: z
    .union([
      z.string().email("Please enter a valid email address."),
      z.literal(""),
    ])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  countriesBefore: z.string().max(2000).optional(),
  dateArrivedBVI: z.string().optional(),

  // Certificate Details
  purpose: z.enum(purposeOptions, {
    error: "Please select a purpose.",
  }),
  purposeOther: z.string().optional(),
  certificateCount: z
    .number()
    .int()
    .min(1, "At least 1 certificate required.")
    .max(10, "Maximum 10 certificates per application."),
  convicted: z.enum(["Yes", "No"], {
    error: "Please select an option.",
  }),
  convictionDetails: z.string().max(2000).optional(),
});

// For partial updates / tracking lookup
export const trackingSchema = z.object({
  trackingNumber: z
    .string()
    .regex(
      /^BVI-\d{4}-[A-Z0-9]{6}$/,
      "Tracking number must be in format BVI-YYYY-XXXXXX"
    ),
});

export type CertificateApplicationInput = z.infer<
  typeof certificateApplicationSchema
>;
export type TrackingInput = z.infer<typeof trackingSchema>;
