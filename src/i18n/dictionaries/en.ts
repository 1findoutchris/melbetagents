/**
 * English copy. Every visitor-facing string lives here so the site can be
 * translated (Amharic next) by adding a dictionary with the same shape.
 * Placeholders like {age} are filled with `fmt()` from src/i18n/index.ts.
 */
export const en = {
  meta: {
    title: "Become a Melbet Agent | Apply at Melbet Agents",
    description:
      "Interested in becoming a Melbet payment agent? Learn about agent requirements, deposits and withdrawals, and submit your application at melbetagents.org.",
    ogAlt: "Become a Melbet payment agent. Build your payment business.",
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
    titleLines: ["Become a Melbet"],
    titleAccent: "Payment Agent.",
    tagline: "Build your payment business.",
    lead: "Help eligible players make deposits and withdrawals. Apply today to discuss agent requirements, onboarding, and commission terms.",
    primaryCta: "Apply Now",
    secondaryCta: "How It Works",
  },
  about: {
    eyebrow: "About the role",
    titleLines: ["What a Melbet"],
    titleAccent: "payment agent does.",
    lead: "A Melbet payment agent is a trusted local contact who helps eligible players fund their accounts and receive withdrawals, following agreed procedures and using an operating balance. If you are researching how to become a betting agent, these are the essentials to understand before you apply.",
    columns: [
      {
        title: "Responsibilities",
        body: "Process deposits and pay out withdrawals for eligible players, in cash or through approved payment methods. Keep an accurate record of every transaction, follow verification procedures, and handle players’ money and personal details with care.",
      },
      {
        title: "Eligibility",
        body: "You must be at least {age} years old and able to act as a payment agent lawfully where you live and work. Which countries and agent types are open is confirmed individually, so applying does not guarantee approval.",
      },
      {
        title: "What you need to apply",
        body: "Your name, country and city, a phone number and a Telegram username. A WhatsApp number, an estimate of your starting capital and details of past payment or agent experience are optional, but help our team review your application. No account or password is needed.",
      },
      {
        title: "Operating balance",
        body: "Agents fund player deposits from an operating balance that they top up themselves. The amount you need depends on your country, agent type and expected activity, and it is agreed with you before you start. There is no published fixed minimum.",
      },
      {
        title: "Onboarding",
        body: "After you submit your Melbet agent application, our team reviews it and contacts you to discuss eligibility, identity verification and the agent agreement, including commission terms. Your tools are set up only after you have agreed the terms.",
      },
    ],
    cta: "Apply Now",
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
        summary: "As a Melbet cash agent, you help eligible players with local deposits and withdrawals in cash.",
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
  partners: {
    heading: "The football your players follow",
    logoAlt: "{name} logo",
    disclaimer:
      "Club and league names and logos are trademarks of their respective owners. Their display here does not mean they partner with, sponsor or endorse this website or its agent program.",
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
    eyebrow: "Apply now",
    titleLines: ["Melbet agent"],
    titleAccent: "application.",
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
      fullName: { label: "Full name", placeholder: "Your full name" },
      country: { label: "Country", placeholder: "Select your country" },
      city: { label: "City", placeholder: "Your city" },
      phone: {
        label: "Phone number",
        codeLabel: "Country code",
        codePlaceholder: "Select country code",
        numberPlaceholder: "Enter phone number",
        examplePlaceholder: "e.g. {example}",
        hint: "Select your country code, then enter your number.",
        selectedHint: "Number for {country} (+{dial}). Enter it the way you would dial it locally.",
      },
      telegram: {
        label: "Telegram username",
        hint: "5–32 characters, e.g. @yourusername",
        placeholder: "@yourusername",
      },
      whatsapp: {
        label: "WhatsApp number",
        hint: "Optional. Select a country code, then enter the number you use on WhatsApp.",
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
      invalidPhone: "Enter a valid phone number for the selected country code.",
      selectCode: "Select a country code.",
      phoneCodeMismatch: "This number uses a different country code. Check the code or the number.",
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
        q: "How do I become a Melbet agent?",
        a: "Submit the Melbet agent application on this page. Our team reviews it and, if it fits current needs in your area, contacts you on Telegram or by phone to discuss eligibility, verification and terms. There is no account to create and no fee to apply.",
      },
      {
        q: "What does a Melbet payment agent do?",
        a: "A payment agent helps eligible players fund their accounts and receive withdrawals, either in cash or through approved digital payment methods. Agents follow set procedures for verification and record-keeping and maintain an operating balance used to process transactions.",
      },
      {
        q: "What do I need to apply?",
        a: "You need to be at least {age} years old and provide your name, country, city, phone number and Telegram username. During onboarding you will be asked to complete identity verification. Any further requirements for your country and agent type are explained before you commit.",
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
        q: "What is the difference between a Melbet cash agent and an online payment agent?",
        a: "A cash agent handles deposits and withdrawals in person using cash. An online payment agent supports players through approved digital payment methods, such as mobile money where available. Which agent types are open depends on your area.",
      },
      {
        q: "Is a payment agent the same as an affiliate?",
        a: "No. A payment agent processes player deposits and withdrawals and keeps an operating balance. A referral affiliate promotes a brand and refers new players, usually through tracked links, and does not handle player funds. This website accepts applications for Melbet payment agents only.",
        link: {
          href: "/guides/melbet-1xbet-payment-agents",
          label: "Read our guide to comparing payment agent opportunities",
        },
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
        a: "Yes. Experience with mobile money, retail or cash handling can help and is taken into account, but onboarding guidance is provided for new agents.",
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
    ] as { q: string; a: string; link?: { href: string; label: string } }[],
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
    guides: "Agent comparison guide",
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
