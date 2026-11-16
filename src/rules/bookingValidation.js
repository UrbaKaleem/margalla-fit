// Booking form validation. Returns an object of field -> message (empty object = valid).

export const EMPTY_FORM = {
  fullName: "",
  phone: "",
  email: "",
  membership: "", // "member" | "dropin"
  memberId: "",
  experience: "",
  agree: false,
};

const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]{1,48}[A-Za-z.]$/;
const PHONE_PATTERN = /^03\d{2}-?\d{7}$/; // Pakistani mobile: 03XX-XXXXXXX
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MEMBER_ID_PATTERN = /^MF-\d{4}$/;

export function validateBookingForm(values) {
  const errors = {};
  const name = values.fullName.trim();

  if (!name) errors.fullName = "Enter your full name.";
  else if (!NAME_PATTERN.test(name)) errors.fullName = "Use 3–50 letters (spaces, apostrophes and hyphens are allowed).";

  if (!values.phone.trim()) errors.phone = "Enter a mobile number so we can reach you about schedule changes.";
  else if (!PHONE_PATTERN.test(values.phone.trim())) errors.phone = "Use the format 03XX-XXXXXXX (11 digits starting with 03).";

  if (!values.email.trim()) errors.email = "Enter an email address for your booking confirmation.";
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Enter an email like name@example.com.";

  if (!values.membership) errors.membership = "Choose member or drop-in.";

  if (values.membership === "member") {
    if (!values.memberId.trim()) errors.memberId = "Enter your member ID to get the member price.";
    else if (!MEMBER_ID_PATTERN.test(values.memberId.trim().toUpperCase()))
      errors.memberId = "Member IDs look like MF-1234 (printed on your card).";
  }

  if (!values.experience) errors.experience = "Choose your training experience.";

  if (!values.agree) errors.agree = "Please confirm you understand payment is taken at the front desk.";

  return errors;
}
