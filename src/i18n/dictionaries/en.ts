/**
 * English copy. Every visitor-facing string lives here so the site can be
 * translated (Amharic next) by adding a dictionary with the same shape.
 * Placeholders like {age} are filled with `fmt()` from src/i18n/index.ts.
 */
export const en = {
  meta: {
    title: "Become a Melbet Payment Agent | Apply Online",
    description:
      "Apply to become a payment agent and help eligible players with deposits and withdrawals. Requirements, onboarding and commission terms are explained before you start.",
    ogAlt: "Melbet Agents — build your payment agency",
  },
  a11y: {
    skipToContent: "Skip to main content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainNav: "Main navigation",
    footerNav: "Footer navigation",
    home: "Melbet Agents home",
  },
  nav: {
    about: "About",
    benefits: "Benefits",
    agentTypes: "Agent Types",
    howItWorks: "How It Works",
    faq: "FAQ",
    apply: "Become an Agent",
    applyShort: "Apply Now",
  },
  hero: {
    eyebrow: "Payment agent recruitment",
    titleLead: "Become a Melbet Agent.",
    titleAccent: "Build Your Payment Business.",
    lead: "Apply to help eligible players process deposits and withdrawals, with onboarding support and commission terms agreed before you start.",
    primaryCta: "Become an Agent",
    secondaryCta: "How It Works",
    points: ["Free to apply", "No account or password needed", "{age}+ only"],
  },
  dashboard: {
    label: "Illustrative example",
    labelNote: "Sample figures for illustration only. Not real earnings or balances.",
    title: "Transaction overview",
    balance: "Operating balance",
    balanceTrend: "Updated after each transaction",
    activity: "Recent activity",
    commission: "Commission tracking",
    commissionNote: "Per agreed terms",
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    completed: "Completed",
    pending: "Pending",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    ariaDescription:
      "Illustrative transaction overview showing how an agent might see their operating balance, recent deposits and withdrawals, and commission tracking. All figures are examples, not real data.",
  },
  about: {
    eyebrow: "About the role",
    title: "Payment agents keep local deposits and withdrawals moving",
    lead: "A payment agent is a trusted local contact who helps eligible players fund their accounts and receive withdrawals, following agreed procedures and using an operating balance.",
    columns: [
      {
        title: "What agents do",
        body: "Process deposits and pay out withdrawals for eligible players, in cash or through approved payment methods, and keep accurate records of every transaction.",
      },
      {
        title: "Who it suits",
        body: "Reliable people with a good local network, such as shop owners, mobile money agents and cashiers, as well as newcomers who are ready to follow clear procedures.",
      },
      {
        title: "How onboarding works",
        body: "You only fill in the application form. Our team reviews it, contacts you to discuss requirements and terms, and guides you through verification and setup.",
      },
    ],
    cta: "Become an Agent",
  },
  benefits: {
    eyebrow: "Why become an agent",
    title: "A structured way to run a payment agency",
    lead: "Agents handle real money for real customers, so the program is built around clear terms, practical tools and support while you get started.",
    items: [
      {
        title: "Commission under agreed terms",
        body: "Earn commission on the transactions you process, at rates set out in your agent agreement before you begin. Nothing is assumed or promised in advance.",
      },
      {
        title: "Mobile-friendly operations",
        body: "Handle deposits, withdrawals and balance checks from your phone, so you can serve customers wherever you work.",
      },
      {
        title: "Onboarding assistance",
        body: "Get guidance on verification, setup and day-to-day procedures, so you understand how everything works before your first transaction.",
      },
      {
        title: "Transaction & balance tracking",
        body: "Keep a clear record of every transaction and your operating balance, making reconciliation and planning straightforward.",
      },
      {
        title: "Direct support contacts",
        body: "Know who to reach when you have a question about a transaction, your account or your terms.",
      },
      {
        title: "Room to grow",
        body: "Where the program permits it, experienced agents may be able to expand into additional locations or coordinate a team.",
      },
    ],
  },
  agentTypes: {
    eyebrow: "Agent types",
    title: "Choose the role that fits how you work",
    lead: "Which roles are offered depends on your country and the program’s current needs. We confirm availability and terms with you before you commit to anything.",
    badgeOpen: "Accepting applications",
    badgeConfirm: "Availability confirmed during onboarding",
    items: {
      cash: {
        title: "Cash agent",
        summary: "Helps eligible customers with local deposits and withdrawals in cash.",
        points: [
          "Serve customers in your local area",
          "Process deposits and pay out withdrawals",
          "Maintain an operating balance for transactions",
        ],
      },
      online: {
        title: "Online payment agent",
        summary: "Supports deposits and withdrawals through approved digital payment methods.",
        points: [
          "Work with approved mobile money or e-wallet methods",
          "Assist customers remotely",
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
  howItWorks: {
    eyebrow: "How it works",
    title: "From application to your first transaction",
    lead: "Five clear steps. You will know the requirements and the terms before you are asked to commit.",
    steps: [
      { title: "Apply", body: "Complete the application form. No account or password is needed, just your details." },
      {
        title: "Eligibility review",
        body: "Our team reviews your application and contacts you to discuss requirements and available agent types.",
      },
      {
        title: "Verification and terms",
        body: "Complete identity verification and review the agent agreement, including commission terms.",
      },
      {
        title: "Account setup and funding",
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
    title: "Apply to become an agent",
    lead: "It takes about three minutes. Required fields are marked. We will only use your details to review and discuss your application.",
    sideTitle: "Before you apply",
    sidePoints: [
      "You must be {age} or older.",
      "Applying is free and does not commit you to anything.",
      "Requirements, starting balance and commission terms are confirmed with you directly.",
      "We will contact you on Telegram or by phone.",
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
    title: "Questions applicants often ask",
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
    title: "Ready to start your agency?",
    body: "Send your application today. We will walk you through the requirements and terms before you commit to anything.",
    cta: "Become an Agent",
  },
  footer: {
    tagline: "Recruitment and onboarding for payment agents.",
    contactTitle: "Contact",
    contactEmail: "Email",
    contactTelegram: "Telegram",
    contactWhatsapp: "WhatsApp",
    supportHours: "Support hours",
    contactPending: "Use the application form and we will contact you.",
    linksTitle: "Information",
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
  stickyCta: "Become an Agent",
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
