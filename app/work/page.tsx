"use client";


const workExperiences = [
  {
    company: "The Broad Institute of MIT and Harvard",
    logo: "/Broad.jpeg",
    url: "https://www.broadinstitute.org/",
    title: "Evolutionary Genomic Researcher",
    description: "Developed deterministic, gradient-free explainability pipeline for evolutionary phylogenetic inference, computing per-residue attributions reproducibly."  },
  {
    company: "Project Physica",
    logo: "/ProjectPhysicaLogo.png",
    url: "https://projectphysica.org/",
    title: "Founder and Lead Developer",
    description: "Built a platform for students to learn physics through interactive simulations."
  },
];

const accolades = [
  { logo: "/verbaAI logo.png", name: "Valedictorian (1 out of ~500)", url: "https://schools.friscoisd.org/campus/high-school/centennial/home" },
  { logo: "/MindMeshLogo.png", name: "International Research Olympiad Semifinalist (Top 10% of 4500)", url: "https://www.internationalresearcholympiad.org/" },
  { logo: "/verbaAI logo.png", name: "International Biology Bowl Semifinalist (32 of ~1000)", url: "https://biologybowl.org/" },
  { logo: "/MindMeshLogo.png", name: "Top 12 National Biology Bowl", url: "https://www.nationalbiologybowl.org/" },
  { logo: "/verbaAI logo.png", name: "Provisional Patent Holder" },
  { logo: "/MindMeshLogo.png", name: "The Harvard Undergraduate Research Journal Finalist", url: "https://www.thurj.org/" },
  { logo: "/verbaAI logo.png", name: "USACO Silver Division" },
];

export default function Work() {


  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 font-inter transition-colors duration-300 px-4 py-12">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white tracking-tight">work</h1>
        <div className="flex flex-col gap-6">
          {workExperiences.map((work, idx) => (
            <a
              key={work.company}
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className={
                `flex items-center gap-4 px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 transition-all duration-200 group` +
                (idx === 0 ? " mt-2" : "")
              }
              style={{ minHeight: 64 }}
            >
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-900 dark:text-white transition-colors duration-200 leading-tight">{work.company}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">{work.title}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">{work.description}</span>
              </div>
              <style jsx>{`
                a.group:hover {
                  background-color: #e5e7eb !important; /* bg-gray-200 */
                  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.06);
                }
                @media (prefers-color-scheme: dark) {
                  a.group:hover {
                    background-color: #1f2937 !important; /* bg-gray-800 */
                  }
                }
              `}</style>
            </a>
          ))}
        </div>
        {/* Accolades Section */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900 dark:text-white tracking-tight">accolades</h2>
        <div className="flex flex-col gap-4">
          {accolades.map((accolade, idx) =>
            accolade.url ? (
              <a
                key={accolade.name}
                href={accolade.url}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  `flex items-center gap-4 px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 transition-all duration-200 group` +
                  (idx === 0 ? " mt-2" : "")
                }
                style={{ minHeight: 56 }}
              >
                <span className="text-base font-medium text-gray-900 dark:text-white transition-colors duration-200 leading-tight">{accolade.name}</span>
                <style jsx>{`
                  a.group:hover {
                    background-color: #e5e7eb !important;
                    box-shadow: 0 4px 16px 0 rgba(0,0,0,0.06);
                  }
                  @media (prefers-color-scheme: dark) {
                    a.group:hover {
                      background-color: #1f2937 !important;
                    }
                  }
                `}</style>
              </a>
            ) : (
              <div
                key={accolade.name}
                className={
                  `flex items-center gap-4 px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 transition-all duration-200 group` +
                  (idx === 0 ? " mt-2" : "")
                }
                style={{ minHeight: 56 }}
              >
                <span className="text-base font-medium text-gray-900 dark:text-white transition-colors duration-200 leading-tight">{accolade.name}</span>
                <style jsx>{`
                  div.group:hover {
                    background-color: #e5e7eb !important;
                    box-shadow: 0 4px 16px 0 rgba(0,0,0,0.06);
                  }
                  @media (prefers-color-scheme: dark) {
                    div.group:hover {
                      background-color: #1f2937 !important;
                    }
                  }
                `}</style>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
} 