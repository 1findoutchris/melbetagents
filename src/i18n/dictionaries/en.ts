/**
 * English copy. Every visitor-facing string lives here so the site can be
 * translated (Amharic next) by adding a dictionary with the same shape.
 * Placeholders like {age} are filled with `fmt()` from src/i18n/index.ts.
 */
export const en = {
  meta: {
    title: "Melbet Agents | Apply to Become an Agent",
    description:
      "Apply to become a Melbet payment agent and help eligible players make deposits and withdrawals. Requirements, onboarding and commission terms are discussed with you before you start.",
    ogAlt: "Become an agent. Build your payment business.",
  },
  a11y: {
    skipToContent: "Skip to main content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainNav: "Main navigation",
    footerNav: "Footer navigation",
    home: "Melbet Agents home",
    logoAlt: "Melbet",
  },
  nav: {
    about: "About",
    benefits: "Benefits",
    agentTypes: "Agent Types",
    howItWorks: "How It Works",
    faq: "FAQ",
    apply: "Become an Agent",
    applyShort: "Apply",
  },
  hero: {
    eyebrow: "Melbet agent program",
    titleLines: ["Become an agent.", "Build your"],
    titleAccent: "Payment business.",
    lead: "Help eligible players make deposits and withdrawals. Apply today to discuss agent requirements, onboarding, and commission terms.",
    primaryCta: "Apply Now",
    secondaryCta: "How It Works",
  },
  about: {
    eyebrow: "About the role",
    titleLines: ["The local link between"],
    titleAccent: "players and payments.",
    lead: "A payment agent is a trusted local contact who helps eligible players fund their accounts and receive withdrawals, following agreed procedures and using an operating balance.",
    columns: [
      {
        title: "What agents do",
        body: "Process deposits and pay out withdrawals for eligible players, in cash or through approved payment methods, and keep accurate records of every transaction.",
      },
      {
        title: "Who it suits",
        body: "Reliable people with a strong local network, such as shop owners, mobile money agents and cashiers, as well as newcomers ready to follow clear procedures.",
      },
      {
        title: "How onboarding works",
        body: "You only fill in the application form. Our team reviews it, contacts you to discuss requirements and terms, and guides you through verification and setup.",
      },
    ],
    cta: "Become an Agent",
  },
  benefits: {
    eyebrow: "Benefits",
    titleLines: ["Everything you need", "to start"],
    titleAccent: "your agency.",
    lead: "Agents handle real money for real players, so the program is built around clear terms, practical tools and support from the start.",
    items: [
      {
        title: "Commission under agreed terms",
        body: "Earn commission on the transactions you process, at rates set out in your agent agreement before you begin.",
      },
      {
        title: "Mobile-friendly operations",
        body: "Handle deposits, withdrawals and balance checks from your phone, wherever you serve players.",
      },
      {
        title: "Onboarding guidance",
        body: "Step-by-step help with verification, setup and daily procedures before your first transaction.",
      },
      {
        title: "Transaction tracking",
        body: "A clear record of every transaction and your operating balance makes reconciliation straightforward.",
      },
      {
        title: "Support communication",
        body: "Know who to contact when you have a question about a transaction, your balance or your terms.",
      },
      {
        title: "Room to grow",
        body: "Where the program permits it, experienced agents may expand to more locations or coordinate a team.",
      },
    ],
  },
  agentTypes: {
    eyebrow: "Agent types",
    titleLines: ["Choose the role that"],
    titleAccent: "fits how you work.",
    lead: "Which roles are offered depends on your country and current needs. Our team confirms availability and terms with you before you commit to anything.",
    badgeOpen: "Accepting applications",
    badgeConfirm: "Availability confirmed during onboarding",
    cta: "Apply Now",
    items: {
      cash: {
        title: "Cash agent",
        summary: "Helps eligible players with local deposits and withdrawals in cash.",
        points: [
          "Serve players in your local area",
          "Process deposits and pay out withdrawals",
          "Maintain an operating balance",
        ],
      },
      online: {
        title: "Online payment agent",
        summary: "Supports deposits and withdrawals through approved digital payment methods.",
        points: [
          "Work with approved mobile money or e-wallets",
          "Assist players remotely",
          "Follow verification and record-keeping procedures",
        ],
      },
      network: {
        title: "Network agent",
        summary: "Coordinates a team of agents where the program permits it.",
        points: [
          "Recruit and support agents in your area",
          "Help your team follow procedures",
          "Usually suited to experienced agents",
        ],
      },
    },
  },
  sports: {
    eyebrow: "The platform",
    titleLines: ["A world of sports."],
    titleAccent: "A stronger connection.",
    lead: "Players use Melbet to follow the sports they love. As an agent, you are the trusted local connection that helps eligible players move money in and out.",
    panels: [
      {
        tag: "Football",
        title: "Matchday, every day",
        text: "Football is followed in every neighbourhood. Agents help eligible local players with deposits and withdrawals around the games they care about.",
        alt: "A football on a floodlit pitch at night",
      },
      {
        tag: "Local",
        title: "Close to your players",
        text: "A reliable agent nearby makes the platform easier to use for players who prefer cash or local payment methods.",
        alt: "A football resting in a goal net",
      },
      {
        tag: "And more",
        title: "More than football",
        text: "The platform covers a wide range of sports and other products.",
        alt: "",
      },
    ],
    note: "Product availability varies by country. Agent commission is based on your agreed terms, not on individual products.",
  },
  howItWorks: {
    eyebrow: "How it works",
    titleLines: ["Five steps to"],
    titleAccent: "your first transaction.",
    lead: "You will know the requirements and the terms before you are asked to commit.",
    steps: [
      { title: "Apply", body: "Complete the application form. No account or password needed, just your details." },
      {
        title: "Eligibility review",
        body: "Our team reviews your application and contacts you to discuss requirements and agent types.",
      },
      {
        title: "Verification and terms",
        body: "Complete identity verification and review the agent agreement, including commission terms.",
      },
      {
        title: "Setup and operating balance",
        body: "After approval, our team sets up your agent tools with you and you fund the agreed operating balance.",
      },
      {
        title: "Begin operations",
        body: "Start processing authorized deposits and withdrawals for eligible players, with support available.",
      },
    ],
  },
  form: {
    eyebrow: "Application",
    titleLines: ["Apply to become"],
    titleAccent: "an agent.",
    lead: "It takes about three minutes. No account or password is needed. Our team reviews every application and contacts you using the details you provide.",
    sideTitle: "Before you apply",
    sidePoints: [
      "You must be {age} or older.",
      "Applying is free and does not commit you to anything.",
      "Requirements and commission terms are confirmed with you directly.",
    ],
    sideContactTitle: "Questions first?",
    required: "Required",
    optional: "Optional",
    sections: {
      about: "About you",
      contact: "Contact details",
      role: "Your agency",
    },
    fields: {
      fullName: { label: "Full name", placeholder: "As shown on your ID" },
      country: { label: "Country", placeholder: "Select your country" },
      city: { label: "City", placeholder: "e.g. Addis Ababa" },
      phone: {
        label: "Phone number",
        hint: "Include your country code, e.g. +251 91 234 5678",
        placeholder: "+251 91 234 5678",
      },
      telegram: { label: "Telegram username", hint: "5–32 characters, e.g. @yourname", placeholder: "@yourname" },
      whatsapp: {
        label: "WhatsApp number",
        hint: "With country code. Leave empty if same as phone or not used.",
        placeholder: "+251 91 234 5678",
      },
      agentType: { label: "Preferred agent type", placeholder: "Select an option", unsure: "Not sure yet" },
      capital: {
        label: "Estimated starting capital",
        hint: "Helps us suggest a suitable role. It does not commit you to any amount.",
        amountLabel: "Amount",
        currencyLabel: "Currency",
        placeholder: "e.g. 500",
      },
      experience: {
        label: "Previous agent or payment experience",
        placeholder: "e.g. mobile money agent for 2 years, shop owner, cashier…",
      },
      message: { label: "Additional message", placeholder: "Anything else we should know?" },
      ageConfirmed: { label: "I confirm that I am {age} years of age or older." },
      privacyConsent: {
        before: "I agree to the",
        link: "Privacy Policy",
        after: "and to be contacted about my application.",
      },
    },
    errors: {
      required: "This field is required.",
      tooShort: "This is too short.",
      tooLong: "This is too long.",
      invalidPhone: "Enter a number with country code, starting with +, e.g. +251912345678.",
      invalidTelegram: "Enter a valid username: 5–32 letters, numbers or underscores.",
      invalidChoice: "Choose one of the available options.",
      invalidAmount: "Enter a number without letters, e.g. 500 or 1500.50.",
      currencyRequired: "Choose a currency for the amount.",
      mustConfirm: "Please confirm to continue.",
    },
    errorSummary: "Please correct {count} field(s) below.",
    submit: "Submit application",
    submitting: "Submitting…",
    privacyNote: "Your details are sent securely and stored by the site operator. They are never shown publicly.",
    status: {
      successTitle: "Application received",
      successBody: "Your application has been received. Our team will contact you using the details you provided.",
      duplicateTitle: "We already have your application",
      duplicateBody:
        "An application with these contact details was received recently, so we have not created a second one. Our team will contact you using the details you provided.",
      reference: "Reference",
      rateLimited: "Too many applications have been sent from your connection. Please wait a while and try again.",
      rejected: "Your submission could not be accepted. Please reload the page and try again.",
      unavailable: "Applications cannot be received right now. Nothing was saved. Please try again later.",
      server: "Something went wrong and your application was not saved. Please try again.",
      network: "We could not reach the server. Check your connection and try again — nothing was saved.",
      tooFast: "That was quick! Please review your details, then submit again.",
      newApplication: "Submit another application",
    },
  },
  faq: {
    eyebrow: "FAQ",
    titleLines: ["Questions"],
    titleAccent: "applicants ask.",
    items: [
      {
        q: "What does a payment agent do?",
        a: "A payment agent helps eligible customers fund their accounts and receive withdrawals, either in cash or through approved digital payment methods. Agents follow set procedures for verification and record-keeping and maintain an operating balance used to process transactions.",
      },
      {
        q: "What do I need to apply?",
        a: "To apply you need to be at least {age} years old and provide your name, location and contact details. During onboarding you will be asked to complete identity verification. Any further requirements for your country and agent type are explained before you commit.",
      },
      {
        q: "How much starting capital is required?",
        a: "The required operating balance depends on your country, agent type and expected transaction volume. It is discussed and confirmed with you during onboarding. Sharing an estimate in the form is optional and does not commit you to anything.",
      },
      {
        q: "How are commissions determined?",
        a: "Commission terms are set out in your agent agreement and depend on factors such as agent type and location. They are explained in full before you start, and you do not need to agree to anything until you have reviewed them.",
      },
      {
        q: "Which countries are supported?",
        a: "Availability changes over time and differs between countries. After you apply, our team confirms whether agents are currently being onboarded in your area.",
      },
      {
        q: "Which payment methods can agents use?",
        a: "Agents work with cash or with digital payment methods approved for their country, such as mobile money where available. The approved methods for your area are confirmed during onboarding.",
      },
      {
        q: "Can I apply without previous experience?",
        a: "Yes, you can apply. Experience with mobile money, retail or cash handling can help, and we take it into account, but onboarding guidance is provided for new agents.",
      },
      {
        q: "Can I manage other agents?",
        a: "In some areas the program permits network agents who coordinate a team. This is usually considered for experienced agents and is confirmed case by case. Select “Network agent” in the form if you are interested.",
      },
      {
        q: "What happens after I apply?",
        a: "Your application is saved and reviewed by our team. If it fits current needs in your area, we contact you on Telegram or by phone to discuss eligibility, requirements and terms. Submitting an application does not guarantee approval.",
      },
      {
        q: "Do I need to create an account or password?",
        a: "No. Applying only requires the form on this page. Our team handles review and onboarding afterwards using the contact details you provide.",
      },
    ],
  },
  finalCta: {
    titleLines: ["Ready to become"],
    titleAccent: "a Melbet agent?",
    body: "Send your application today. Our team will walk you through the requirements and terms before you commit to anything.",
    cta: "Apply Now",
  },
  footer: {
    tagline: "Recruitment and onboarding for payment agents.",
    contactTitle: "Contact",
    contactEmail: "Email",
    contactTelegram: "Telegram",
    contactWhatsapp: "WhatsApp",
    supportHours: "Support hours",
    contactPending: "Use the application form and we will contact you.",
    linksTitle: "Explore",
    legalTitle: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    relationshipTitle: "About this website",
    relationship: {
      independent:
        "This website is operated independently by {operator} to recruit payment agents. It is not owned or operated by Melbet, and it is not an official Melbet website. Melbet and related names are trademarks of their respective owner. Applications are reviewed by the site operator.",
      authorized:
        "This website is operated by {operator}, which is authorized by Melbet to recruit payment agents. It is not owned by Melbet. Melbet and related names are trademarks of their respective owner.",
      official: "This website is operated by Melbet to recruit payment agents.",
    },
    rgTitle: "{age}+ · Play responsibly",
    rg: "Gambling services are only for people aged {age} and over and may not be legal in every country. Gambling can be addictive — if it stops being fun, take a break or get free, confidential help from",
    copyright: "© {year} {site}. All rights reserved.",
  },
  stickyCta: "Apply Now",
  legal: {
    backHome: "Back to home",
    lastUpdated: "Last updated",
    reviewNotice:
      "This document is a template prepared for the site operator. It must be reviewed by the operator and, where appropriate, a legal adviser before launch.",
  },
  notFound: {
    title: "Page not found",
    body: "The page you are looking for does not exist or has moved.",
    cta: "Back to home",
  },
};

export type Dictionary = typeof en;
