export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, 1000);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^\+?[\d\s\-().]{7,20}$/.test(phone);
}

export interface InquiryInput {
  name: string;
  email: string;
  phone?: string;
  product?: string;
  message: string;
}

export function validateInquiry(data: InquiryInput): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) errors.push("Name must be at least 2 characters.");
  if (!data.email || !validateEmail(data.email)) errors.push("Valid email is required.");
  if (data.phone && !validatePhone(data.phone)) errors.push("Invalid phone number format.");
  if (!data.message || data.message.trim().length < 10) errors.push("Message must be at least 10 characters.");

  return { valid: errors.length === 0, errors };
}
