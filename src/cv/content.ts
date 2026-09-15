// Content for the interactive résumé page, in German and English.
// Ported verbatim from Assets/interaktiver-Lebenslauf.html.

export type Lang = 'de' | 'en'
export type FilterId = 'cloud' | 'observability' | 'security' | 'dev'

export type Stat = { value: string; label: string }
export type Quote = { text: string; source: string }
export type Step = { period: string; title: string }

export type Station = {
  id: string
  period: string
  org: string
  title: string
  cats: FilterId[]
  summary: string
  steps: Step[]
  bullets: string[]
}

export type Skill = { label: string; cats: FilterId[] }
export type Achievement = { title: string; cats: FilterId[]; desc: string }

export type CvContent = {
  hero: { kicker: string; name: string; role: string; intro: string; stats: Stat[] }
  contact: { email: string; phone: string; address: string }
  nav: { download: string }
  quotes: Quote[]
  timelineHeading: string
  timeline: Station[]
  filters: { id: FilterId; label: string }[]
  skillsHeading: string
  filtersHeading: string
  skills: Skill[]
  weiterbildungHeading: string
  weiterbildung: string[]
  achievementsHeading: string
  achievements: Achievement[]
  strengthsHeading: string
  strengths: string[]
  interestsHeading: string
  interests: string[]
  referenceHeading: string
  referenceText: string
  footer: { heading: string; cta: string; download: string; smallprint: string }
}

export const CV_PDF = '/cv/Lebenslauf-Fleischer.pdf'
export const CV_PORTRAIT = '/cv/portrait.jpg'

export const CONTENT: Record<Lang, CvContent> = {
  de: {
    hero: {
      kicker: 'Interaktiver Lebenslauf',
      name: 'Dr. Jürgen Fleischer',
      role: 'KI-Manager & KI-Automation-Developer',
      intro: '29 Jahre Cloud-Infrastruktur, Observability und Security bei Sun Microsystems und Oracle — zuletzt als Master Product Manager für Oracle Cloud Infrastructure Observability & Management Services. Jetzt auf dem Weg in die KI-Automatisierung.',
      stats: [
        { value: '29+', label: 'Jahre Erfahrung' },
        { value: 'Dr. rer. nat.', label: 'Theoretische Plasmaphysik' },
        { value: 'DE / EN', label: 'verhandlungssicher' }
      ]
    },
    contact: { email: 'info@jfleischer.com', phone: '0157 5629 3323', address: 'Dachsweg 7, 46282 Dorsten' },
    nav: { download: 'Lebenslauf (PDF)' },
    quotes: [
      { text: 'Er zeigte überdurchschnittlichen Arbeitseinsatz und engagierte sich für die Belange der Firma auch über die normale Dienstzeit hinaus.', source: 'Arbeitszeugnis, Oracle Global Services Germany GmbH · 31.08.2026' },
      { text: 'Herr Fleischer zeichnete sich durch einen effizienten Arbeitsstil aus. Er hatte einen sicheren Blick für das Wesentliche und arbeitete zuverlässig, selbstständig, methodisch und gründlich.', source: 'Arbeitszeugnis, Oracle Global Services Germany GmbH · 31.08.2026' },
      { text: 'Die Ergebnisse waren, auch bei sehr schwierigen Aufgaben, bei objektiven Problemhäufungen und unter Termindruck, stets von ausgezeichneter Qualität.', source: 'Arbeitszeugnis, Oracle Global Services Germany GmbH · 31.08.2026' },
      { text: 'Er verfügt über ein sehr gutes Kommunikationsverhalten und ein gutes Verhandlungsgeschick. Herr Fleischer wurde von allen gleichermaßen geschätzt und anerkannt.', source: 'Arbeitszeugnis, Oracle Global Services Germany GmbH · 31.08.2026' }
    ],
    timelineHeading: 'Werdegang',
    timeline: [
      { id: 't0', period: '07.2026 – 09.2026', org: '', title: 'Weiterbildung zum Spezialisten für KI-Transformation & Automatisierung',
        cats: ['dev'], summary: '', steps: [], bullets: [] },
      { id: 't1', period: '07.2010 – 08.2026', org: 'Oracle Global Services Germany GmbH, Düsseldorf', title: 'Master Product Manager / OCI Architect',
        cats: ['cloud','observability','dev'],
        summary: 'Vom Principal Member of Technical Staff zum Master Product Manager: 16 Jahre Produktverantwortung für Oracle Enterprise Manager, Oracle Management Cloud und Oracle Cloud Infrastructure Observability & Management Services.',
        steps: [ { period: '04.2020 – 08.2026', title: 'Master Product Manager' }, { period: '03.2012 – 04.2020', title: 'Senior Principal Member of Technical Staff' }, { period: '07.2010 – 03.2012', title: 'Principal Member of Technical Staff' } ],
        bullets: [
          'Outbound Product Manager für Oracle Enterprise Manager und OCI Observability & Management Cloud Services',
          'Unterstützung von Oracle-Kunden weltweit bei der Integration in ihre IT-Umgebungen; kundenspezifische Anpassungen und Erweiterungen',
          'Betreuung strategischer Großkunden weltweit bei Einführung und Anpassung von OCI Observability & Management Services',
          'Zusammenarbeit mit Entwicklungsteams zur Erweiterung und Verbesserung der Service-Funktionalitäten',
          'Entwicklung kundenspezifischer Lösungen für die Migration zu Oracle Cloud Infrastructure',
          'Weltweite Verantwortung für Eskalationen bei strategischen Großkunden',
          'Unterstützung globaler Account Teams bei Proof-of-Concept-Installationen',
          'Durchführung von Trainings für Sales Engineers, Customer Success Engineers und Support Engineers',
          'Veröffentlichung von Blogposts, Gewinnung strategischer Referenzkunden, Sessions auf der Oracle Open/Cloud/AI World'
        ] },
      { id: 't2', period: '01.1997 – 06.2010', org: 'Sun Microsystems GmbH, Ratingen', title: 'Senior Staff Engineer',
        cats: ['cloud','dev'],
        summary: '13 Jahre in Support Services, Proactive Services, Sales und Produktentwicklung – bis zur Übernahme durch Oracle im Jahr 2010.',
        steps: [],
        bullets: [ 'Bereiche: Support Services, Proactive Services, Sales, Produktentwicklung', '2002: Teammitglied eines EMEA Sun Sigma Teams', `2006: Sales Engineer in einem internationalen Team für den Vertrieb des Service „Update Connection Enterprise“`, '2010: Übernahme von Sun Microsystems durch Oracle' ] },
      { id: 't3', period: '04.1991 – 12.1996', org: 'Ruhr-Universität Bochum', title: 'Wissenschaftlicher Mitarbeiter',
        cats: ['dev'],
        summary: 'Promotion zum Dr. rer. nat. im Fachbereich Theoretische Plasmaphysik.',
        steps: [], bullets: [ 'Wissenschaftlicher Mitarbeiter an der Ruhr-Universität Bochum' ] },
      { id: 't4', period: '09.1990 – 02.1991', org: 'Knappschaftskrankenhaus Dortmund', title: 'Zivildienst',
        cats: [],
        summary: 'Zivildienst in der Abteilung für Nuklearmedizin und Strahlentherapie, als Diplom-Physiker.',
        steps: [], bullets: [] },
      { id: 't5', period: '09.1983 – 08.1990', org: 'Ruhr-Universität Bochum', title: 'Physikstudium',
        cats: [],
        summary: 'Physikstudium, Abschluss: Diplom-Physiker.',
        steps: [], bullets: [] },
      { id: 't6', period: '08.1974 – 06.1983', org: 'Gymnasium Petrinum, Dorsten', title: 'Abitur',
        cats: [], summary: 'Schulischer Werdegang, Abschluss: Abitur.', steps: [], bullets: [] }
    ],
    filters: [ { id: 'cloud', label: 'Cloud' }, { id: 'observability', label: 'Observability' }, { id: 'security', label: 'Security' }, { id: 'dev', label: 'Dev' } ],
    skillsHeading: 'Kenntnisse & Fähigkeiten',
    filtersHeading: 'Nach Bereich filtern',
    skills: [
      { label: 'UNIX/Linux', cats: ['cloud'] },
      { label: 'Oracle Cloud Infrastructure (OCI)', cats: ['cloud'] },
      { label: 'Cloud Services & VMs', cats: ['cloud'] },
      { label: 'Containerisierung, Kubernetes', cats: ['cloud','dev'] },
      { label: 'Logging Analytics', cats: ['observability'] },
      { label: 'Security Monitoring & Analytics', cats: ['observability','security'] },
      { label: 'Application Performance Monitoring', cats: ['observability'] },
      { label: 'OpenTelemetry', cats: ['observability'] },
      { label: 'Oracle DB, MySQL, PostgreSQL', cats: ['dev'] },
      { label: 'API-, Script- & Python-Programmierung', cats: ['dev'] },
      { label: 'Certified Ethical Hacker (CEHv10)', cats: ['security'] },
      { label: 'ITIL Foundation', cats: ['dev'] },
      { label: 'Six Sigma / Green Belt', cats: ['dev'] }
    ],
    weiterbildungHeading: 'Weiterbildung',
    weiterbildung: [ 'Sun Server & Storage Hardware / Solaris OS / Linux OS / TCP/IP-Networking', 'Virtualization / Clustering / Storage Arrays / Veritas Volume Manager', 'Oracle Database', 'ITIL – Foundation', 'Six Sigma / Sun Sigma Green Belt', 'Certified Ethical Hacker (CEHv10)' ],
    achievementsHeading: 'Ausgewählte Erfolge',
    achievements: [
      { title: 'Traffic Light Patchmanagement', cats: ['dev','cloud'], desc: 'Eigenentwicklung einer Software zum Patchmanagement für Solaris-Systeme – Rollout zunächst in Deutschland, dann EMEA-weit und schließlich weltweit für Enterprise-Kunden.' },
      { title: 'Vollautomatische Migration, Australien', cats: ['cloud'], desc: 'Erfolgreiches Proof of Concept bei einem Großkunden: automatische Migration von Hunderten Bare-Metal-Systemen in virtualisierte Solaris-10-Zonen mithilfe von Ops Center.' },
      { title: '80+ TB Datenmigration', cats: ['cloud','observability'], desc: 'Entwicklung einer Lösung zur automatischen Migration von über 80 TB Oracle Management Cloud Log-Analytics-Daten nach Oracle Cloud Infrastructure Logging Analytics.' },
      { title: 'NATO CCDCOE, Tallinn', cats: ['security'], desc: 'Präsentation des Oracle Security Monitoring and Analytics (SMA) Cloud Service bei einem Meeting des NATO Cooperative Cyber Defence Centre of Excellence in Tallinn, Estland.' }
    ],
    strengthsHeading: 'Persönliche Stärken',
    strengths: [ 'Analytisches Denken, schnelle Problemlösung', 'Kreativ und innovativ, pragmatische Herangehensweise', 'Strukturierte und selbstständige Arbeitsweise, fokussiertes Arbeiten', 'Teamfähigkeit', 'Umgang mit Kunden in kritischen Situationen', 'Hohe Lernbereitschaft und Anpassungsfähigkeit' ],
    interestsHeading: 'Interessen',
    interests: [ 'IT- & Cloud-Security, Automatisierung', 'Neue KI-Technologien (OpenClaw, Claude, OpenAI)', 'Jugendarbeit', 'Fotografie', 'Fahrradfahren' ],
    referenceHeading: 'Zum Zeugnis',
    referenceText: 'Das Arbeitsverhältnis bei Oracle Global Services Germany GmbH endete am 31. August 2026 einvernehmlich aus betrieblichen Gründen, nach 29 Jahren Betriebszugehörigkeit (inklusive der Zeit bei Sun Microsystems). Oracle bedankt sich im Zeugnis ausdrücklich für die gute Zusammenarbeit.',
    footer: { heading: 'Kontakt', cta: 'Für Rückfragen und Gespräche stehe ich gern zur Verfügung.', download: 'Lebenslauf (PDF)', smallprint: 'Stand: September 2026' }
  },
  en: {
    hero: {
      kicker: 'Interactive Résumé',
      name: 'Dr. Jürgen Fleischer',
      role: 'AI Manager & AI Automation Developer',
      intro: '29 years in cloud infrastructure, observability and security at Sun Microsystems and Oracle — most recently as Master Product Manager for Oracle Cloud Infrastructure Observability & Management Services. Now moving into AI automation.',
      stats: [
        { value: '29+', label: 'years of experience' },
        { value: 'Dr. rer. nat.', label: 'Theoretical Plasma Physics' },
        { value: 'DE / EN', label: 'fluent, business-level' }
      ]
    },
    contact: { email: 'info@jfleischer.com', phone: '0157 5629 3323', address: 'Dachsweg 7, 46282 Dorsten, Germany' },
    nav: { download: 'Résumé (PDF)' },
    quotes: [
      { text: `He showed above-average dedication and engaged with the company's interests beyond normal working hours.`, source: 'Reference letter, Oracle Global Services Germany GmbH · Aug 31, 2026' },
      { text: 'Mr. Fleischer distinguished himself through an efficient way of working. He had a sound sense for what mattered and worked reliably, independently, methodically and thoroughly.', source: 'Reference letter, Oracle Global Services Germany GmbH · Aug 31, 2026' },
      { text: 'The results were, even for very difficult tasks, under objective workload peaks and time pressure, consistently of excellent quality.', source: 'Reference letter, Oracle Global Services Germany GmbH · Aug 31, 2026' },
      { text: 'He has very good communication skills and good negotiation skills. Mr. Fleischer was equally valued and recognized by everyone.', source: 'Reference letter, Oracle Global Services Germany GmbH · Aug 31, 2026' }
    ],
    timelineHeading: 'Career',
    timeline: [
      { id: 't0', period: '07.2026 – 09.2026', org: '', title: 'Training as a Specialist in AI Transformation & Automation',
        cats: ['dev'], summary: '', steps: [], bullets: [] },
      { id: 't1', period: '07.2010 – 08.2026', org: 'Oracle Global Services Germany GmbH, Düsseldorf', title: 'Master Product Manager / OCI Architect',
        cats: ['cloud','observability','dev'],
        summary: 'From Principal Member of Technical Staff to Master Product Manager: 16 years of product responsibility for Oracle Enterprise Manager, Oracle Management Cloud, and Oracle Cloud Infrastructure Observability & Management Services.',
        steps: [ { period: '04.2020 – 08.2026', title: 'Master Product Manager' }, { period: '03.2012 – 04.2020', title: 'Senior Principal Member of Technical Staff' }, { period: '07.2010 – 03.2012', title: 'Principal Member of Technical Staff' } ],
        bullets: [
          'Outbound Product Manager for Oracle Enterprise Manager and OCI Observability & Management Cloud Services',
          "Supported Oracle customers worldwide integrating these products into their IT environments; developed customer-specific adaptations and extensions",
          'Managed strategic key accounts worldwide on rollout and adoption of OCI Observability & Management Services',
          'Collaborated with engineering teams to extend and improve service functionality',
          'Developed customer-specific solutions for migration to Oracle Cloud Infrastructure',
          'Held worldwide responsibility for escalations at strategic key accounts',
          'Supported global account teams with proof-of-concept installations',
          'Delivered training for sales engineers, customer success engineers and support engineers',
          'Published blog posts, secured strategic reference customers, spoke at Oracle Open/Cloud/AI World'
        ] },
      { id: 't2', period: '01.1997 – 06.2010', org: 'Sun Microsystems GmbH, Ratingen', title: 'Senior Staff Engineer',
        cats: ['cloud','dev'],
        summary: "13 years across Support Services, Proactive Services, Sales and product development — until Oracle's acquisition of Sun in 2010.",
        steps: [], bullets: [ 'Areas: Support Services, Proactive Services, Sales, Product Development', '2002: Member of an EMEA Sun Sigma team', `2006: Sales Engineer on an international team selling the "Update Connection Enterprise" service`, '2010: Sun Microsystems acquired by Oracle' ] },
      { id: 't3', period: '04.1991 – 12.1996', org: 'Ruhr University Bochum', title: 'Research Associate',
        cats: ['dev'], summary: 'PhD (Dr. rer. nat.) in Theoretical Plasma Physics.', steps: [], bullets: [ 'Research Associate at Ruhr University Bochum' ] },
      { id: 't4', period: '09.1990 – 02.1991', org: 'Knappschaftskrankenhaus Dortmund', title: 'Civilian Service',
        cats: [], summary: 'Civilian service in the Department of Nuclear Medicine and Radiotherapy, working as a physicist.', steps: [], bullets: [] },
      { id: 't5', period: '09.1983 – 08.1990', org: 'Ruhr University Bochum', title: 'Physics Studies',
        cats: [], summary: 'Physics studies, graduating as Diplom-Physiker.', steps: [], bullets: [] },
      { id: 't6', period: '08.1974 – 06.1983', org: 'Gymnasium Petrinum, Dorsten', title: 'Abitur',
        cats: [], summary: 'Secondary education, graduated with Abitur.', steps: [], bullets: [] }
    ],
    filters: [ { id: 'cloud', label: 'Cloud' }, { id: 'observability', label: 'Observability' }, { id: 'security', label: 'Security' }, { id: 'dev', label: 'Dev' } ],
    skillsHeading: 'Skills & Expertise',
    filtersHeading: 'Filter by area',
    skills: [
      { label: 'UNIX/Linux', cats: ['cloud'] },
      { label: 'Oracle Cloud Infrastructure (OCI)', cats: ['cloud'] },
      { label: 'Cloud Services & VMs', cats: ['cloud'] },
      { label: 'Containerization, Kubernetes', cats: ['cloud','dev'] },
      { label: 'Logging Analytics', cats: ['observability'] },
      { label: 'Security Monitoring & Analytics', cats: ['observability','security'] },
      { label: 'Application Performance Monitoring', cats: ['observability'] },
      { label: 'OpenTelemetry', cats: ['observability'] },
      { label: 'Oracle DB, MySQL, PostgreSQL', cats: ['dev'] },
      { label: 'API, Scripting & Python Programming', cats: ['dev'] },
      { label: 'Certified Ethical Hacker (CEHv10)', cats: ['security'] },
      { label: 'ITIL Foundation', cats: ['dev'] },
      { label: 'Six Sigma / Green Belt', cats: ['dev'] }
    ],
    weiterbildungHeading: 'Professional development',
    weiterbildung: [ 'Sun Server & Storage Hardware / Solaris OS / Linux OS / TCP/IP Networking', 'Virtualization / Clustering / Storage Arrays / Veritas Volume Manager', 'Oracle Database', 'ITIL – Foundation', 'Six Sigma / Sun Sigma Green Belt', 'Certified Ethical Hacker (CEHv10)' ],
    achievementsHeading: 'Selected achievements',
    achievements: [
      { title: 'Traffic Light Patchmanagement', cats: ['dev','cloud'], desc: 'Built a patch-management tool for Solaris systems from scratch — rolled out first in Germany, then across EMEA, and eventually worldwide for enterprise customers.' },
      { title: 'Fully Automated Migration, Australia', cats: ['cloud'], desc: 'Delivered a successful proof of concept for a major customer: fully automated migration of hundreds of bare-metal systems into virtualized Solaris 10 zones using Ops Center.' },
      { title: '80+ TB Data Migration', cats: ['cloud','observability'], desc: 'Built a solution to automatically migrate more than 80 TB of Oracle Management Cloud Log Analytics data to Oracle Cloud Infrastructure Logging Analytics.' },
      { title: 'NATO CCDCOE, Tallinn', cats: ['security'], desc: 'Presented the Oracle Security Monitoring and Analytics (SMA) Cloud Service at a meeting of the NATO Cooperative Cyber Defence Centre of Excellence in Tallinn, Estonia.' }
    ],
    strengthsHeading: 'Personal strengths',
    strengths: [ 'Analytical thinking, fast problem-solving', 'Creative and innovative, pragmatic approach', 'Structured, independent and focused way of working', 'Team player', 'Skilled at handling customers in critical situations', 'Highly adaptable, strong willingness to learn' ],
    interestsHeading: 'Interests',
    interests: [ 'IT & cloud security, automation', 'New AI technologies (OpenClaw, Claude, OpenAI)', 'Youth work', 'Photography', 'Cycling' ],
    referenceHeading: 'About the reference letter',
    referenceText: 'Employment with Oracle Global Services Germany GmbH ended by mutual agreement for operational reasons on August 31, 2026, after 29 years of service (including time at Sun Microsystems). In the reference letter, Oracle explicitly thanks him for the good working relationship.',
    footer: { heading: 'Contact', cta: 'Happy to answer questions or talk further.', download: 'Résumé (PDF)', smallprint: 'As of September 2026' }
  }
};
