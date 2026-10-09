/**
 * English legal page content. TEMPLATE — must be reviewed by the operator
 * (and ideally a legal adviser) before launch. Placeholders: {operator},
 * {site}, {age}, {retention}, {contact}.
 */
export type LegalBlock = { h: string; p?: string[]; ul?: string[] };
export type LegalDoc = { title: string; description: string; intro: string; sections: LegalBlock[] };

export const privacyEn: LegalDoc = {
  title: "Privacy Policy",
  description:
    "Read how this website collects and uses {site} agent application details, including access, security, retention, consent and your privacy choices.",
  intro:
    "This policy explains what information {operator} collects when you apply through this website, why it is collected and the choices you have.",
  sections: [
    {
      h: "Information we collect",
      p: ["When you submit the application form we collect:"],
      ul: [
        "Your full name, country and city.",
        "Your phone number, Telegram username and, if you provide it, your WhatsApp number.",
        "Your preferred agent type, and optionally your estimated starting capital, previous experience and any message you write.",
        "Your confirmation that you are {age} or older and your agreement to this policy, with the time you gave it.",
        "Technical data needed to protect the form from abuse: a one-way, salted hash of your IP address (we do not store the IP address itself) and your browser’s user-agent string.",
      ],
    },
    {
      h: "How we use it",
      ul: [
        "To review your application and decide whether to contact you.",
        "To contact you about your application by Telegram, phone or WhatsApp.",
        "To prevent spam, duplicate and abusive submissions.",
      ],
      p: ["We do not sell your information and we do not use it for unrelated marketing."],
    },
    {
      h: "Legal basis",
      p: [
        "We process your information on the basis of the consent you give when submitting the form and our legitimate interest in reviewing applications and keeping the form secure. You can withdraw consent at any time by contacting us.",
      ],
    },
    {
      h: "Who can see it",
      ul: [
        "Staff of {operator} who review applications.",
        "Service providers that host this website and its database, under appropriate confidentiality obligations.",
        "If staff notifications are enabled, a summary of new applications is sent to a private Telegram chat used by the review team, so Telegram processes that message.",
        "If your application proceeds, details needed for onboarding may be shared with the payment program you are applying to. We will tell you before this happens.",
      ],
    },
    {
      h: "How long we keep it",
      p: [
        "Applications are kept for up to {retention} months after submission, or for as long as you work with us as an agent, and are then deleted. You can ask us to delete your application sooner.",
      ],
    },
    {
      h: "Your rights",
      p: [
        "Depending on where you live, you may have the right to access, correct or delete your information, object to or restrict its use, and withdraw consent. To make a request, contact us using the details below. You may also complain to your local data protection authority.",
      ],
    },
    {
      h: "Security",
      p: [
        "Applications are sent over an encrypted connection and stored in a database that is not publicly accessible. Credentials for the database and any notification service are kept on the server and never sent to your browser. No system is perfectly secure, but we take reasonable measures to protect your information.",
      ],
    },
    {
      h: "Age requirement",
      p: [
        "This website and the agent program are only for people aged {age} and over. We do not knowingly collect information from anyone younger.",
      ],
    },
    {
      h: "Contact",
      p: ["{contact}"],
    },
    {
      h: "Changes",
      p: ["We may update this policy. The date at the top of the page shows when it last changed."],
    },
  ],
};

export const termsEn: LegalDoc = {
  title: "Terms of Use",
  description:
    "Read the terms for using this {site} agent application website, including eligibility, application review, local laws, trademarks and responsibilities.",
  intro: "By using this website you agree to these terms. If you do not agree, please do not use the website.",
  sections: [
    {
      h: "About this website",
      p: [
        "This website is operated by {operator} to provide information about becoming a payment agent and to collect applications.",
      ],
    },
    {
      h: "Applications",
      ul: [
        "You must be at least {age} years old to apply.",
        "The information you provide must be accurate and your own.",
        "Submitting an application does not create an agent relationship, employment or any other contract, and does not guarantee approval.",
        "Agent types, requirements, operating balances and commission terms are confirmed individually during onboarding and only apply once agreed in writing.",
      ],
    },
    {
      h: "No guaranteed earnings",
      p: [
        "Nothing on this website is a promise of income. Your results depend on the terms you agree, your location and your own work.",
      ],
    },
    {
      h: "Your responsibility for local laws",
      p: [
        "Gambling and payment services are regulated differently in each country and may be prohibited in some. You are responsible for making sure that acting as a payment agent is lawful where you live and work. We do not accept applications where this would be unlawful.",
      ],
    },
    {
      h: "Acceptable use",
      ul: [
        "Do not submit false, misleading or someone else’s information.",
        "Do not attempt to disrupt the website, bypass its security or submit automated or bulk applications.",
      ],
    },
    {
      h: "Trademarks",
      p: [
        "Melbet and related names and marks belong to their respective owner. Their use on this website is for identification only.",
      ],
    },
    {
      h: "Liability",
      p: [
        "The website is provided “as is”. To the extent permitted by law, {operator} is not liable for losses arising from your use of the website or reliance on its general information. Nothing in these terms limits liability that cannot be limited by law.",
      ],
    },
    {
      h: "Contact",
      p: ["{contact}"],
    },
    {
      h: "Changes",
      p: ["We may update these terms. The date at the top of the page shows when they last changed."],
    },
  ],
};
