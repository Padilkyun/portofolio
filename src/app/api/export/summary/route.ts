import { getFullPortfolio } from "@/lib/data";
import { parseJsonArray, formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

const LEVEL_LABEL: Record<number, string> = {
  1: "Beginner", 2: "Elementary", 3: "Intermediate", 4: "Advanced", 5: "Expert",
};
const LEVEL_COLOR: Record<number, string> = {
  1: "#94a3b8", 2: "#60a5fa", 3: "#a78bfa", 4: "#f59e0b", 5: "#22c55e",
};

export async function GET() {
  const { profile, experiences, bootcamps, projects, skills, certificates } =
    await getFullPortfolio();

  const skillGroups = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});

  const generatedDate = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Executive Summary — ${profile?.name ?? "Portfolio"}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#0f172a;--ink2:#475569;--ink3:#94a3b8;
  --surface:#f8fafc;--border:#e2e8f0;
  --accent:#0f172a;--accent2:#6366f1;
  --radius:12px;
}
@page{size:A4;margin:0}
@media print{
  .no-print{display:none!important}
  body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .page-break{page-break-before:always}
  section{page-break-inside:avoid}
}
body{
  font-family:'Segoe UI',system-ui,-apple-system,sans-serif;
  background:#fff;color:var(--ink);font-size:9pt;line-height:1.5;
}

/* ── Print bar ── */
.print-bar{
  position:fixed;top:0;left:0;right:0;z-index:999;
  display:flex;align-items:center;justify-content:space-between;
  padding:10px 24px;background:#0f172a;color:#fff;
  font-size:12px;font-weight:600;
}
.print-bar button{
  padding:6px 18px;border-radius:8px;border:none;
  background:#6366f1;color:#fff;font-size:12px;font-weight:600;
  cursor:pointer;letter-spacing:0.02em;
}
.print-bar button:hover{background:#4f46e5}

/* ── Page wrapper ── */
.page{max-width:210mm;margin:0 auto;padding:52px 0 0}

/* ── Cover ── */
.cover{
  background:linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#312e81 100%);
  color:#fff;padding:56px 48px 48px;position:relative;overflow:hidden;
}
.cover::before{
  content:'';position:absolute;top:-60px;right:-60px;
  width:280px;height:280px;border-radius:50%;
  background:rgba(99,102,241,0.15);
}
.cover::after{
  content:'';position:absolute;bottom:-40px;left:40px;
  width:160px;height:160px;border-radius:50%;
  background:rgba(99,102,241,0.08);
}
.cover-label{
  font-size:7.5pt;font-weight:700;letter-spacing:0.2em;
  text-transform:uppercase;color:#818cf8;margin-bottom:16px;
}
.cover-name{
  font-size:34pt;font-weight:800;line-height:1.1;
  letter-spacing:-1px;margin-bottom:8px;
}
.cover-title{font-size:13pt;color:#94a3b8;font-weight:400;margin-bottom:20px}
.cover-tagline{
  font-size:10pt;color:#cbd5e1;line-height:1.7;
  max-width:480px;padding-left:16px;
  border-left:3px solid #6366f1;margin-bottom:32px;
}
.cover-meta{display:flex;flex-wrap:wrap;gap:16px;font-size:8.5pt;color:#94a3b8}
.cover-meta a{color:#a5b4fc;text-decoration:none}
.cover-meta span{display:inline-flex;align-items:center;gap:6px}
.cover-dot{
  position:absolute;top:40px;right:48px;
  width:12px;height:12px;border-radius:50%;background:#22c55e;
  box-shadow:0 0 0 4px rgba(34,197,94,0.2);
}
.cover-date{
  position:absolute;bottom:24px;right:48px;
  font-size:8pt;color:#475569;
}

/* ── Body ── */
.body{padding:0 48px 48px}

/* ── Section ── */
.section{margin-top:36px}
.section-header{
  display:flex;align-items:center;gap:10px;
  margin-bottom:18px;padding-bottom:10px;
  border-bottom:2px solid var(--border);
}
.section-num{
  width:22px;height:22px;border-radius:6px;
  background:var(--accent);color:#fff;
  display:flex;align-items:center;justify-content:center;
  font-size:8pt;font-weight:700;flex-shrink:0;
}
.section-title{font-size:10pt;font-weight:700;letter-spacing:0.04em;color:var(--ink)}

/* ── Experience item ── */
.exp-item{
  display:grid;grid-template-columns:auto 1fr;gap:14px;
  padding:14px 0;border-bottom:1px solid var(--border);
}
.exp-item:last-child{border-bottom:none}
.exp-logo{
  width:40px;height:40px;border-radius:10px;
  border:1px solid var(--border);background:var(--surface);
  display:flex;align-items:center;justify-content:center;
  font-size:10pt;font-weight:700;color:var(--ink2);overflow:hidden;
  flex-shrink:0;
}
.exp-logo img{width:100%;height:100%;object-fit:contain;padding:4px}
.exp-header{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.exp-role{font-size:10.5pt;font-weight:700;color:var(--ink)}
.exp-company{font-size:9pt;color:var(--ink2);margin-top:1px}
.exp-meta{text-align:right;font-size:8pt;color:var(--ink3);flex-shrink:0}
.exp-current{
  display:inline-flex;align-items:center;gap:4px;
  font-size:7.5pt;font-weight:600;color:#16a34a;
  background:#f0fdf4;padding:2px 8px;border-radius:99px;
  border:1px solid #bbf7d0;margin-top:2px;
}
.exp-dot{width:6px;height:6px;border-radius:50%;background:#22c55e}
.exp-desc{font-size:8.5pt;color:var(--ink2);margin-top:7px;line-height:1.6}
.skill-chips{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}
.chip{
  font-size:7.5pt;padding:2px 8px;border-radius:6px;
  border:1px solid var(--border);color:var(--ink2);background:var(--surface);
}
.exp-docs{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px}
.doc-tag{
  font-size:7.5pt;padding:2px 10px;border-radius:6px;
  background:#ede9fe;color:#6d28d9;border:1px solid #ddd6fe;
  text-decoration:none;
}

/* ── Project grid ── */
.project-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.project-card{
  border:1px solid var(--border);border-radius:var(--radius);
  padding:14px;background:#fff;overflow:hidden;
}
.project-cover{
  width:100%;height:80px;object-fit:cover;border-radius:8px;
  background:var(--surface);margin-bottom:10px;display:block;
}
.project-cover-placeholder{
  width:100%;height:80px;border-radius:8px;
  background:linear-gradient(135deg,#f1f5f9,#e2e8f0);
  margin-bottom:10px;display:flex;align-items:center;justify-content:center;
  font-size:7.5pt;color:var(--ink3);font-weight:600;letter-spacing:0.05em;
}
.project-year{
  font-size:7.5pt;color:var(--ink3);font-weight:600;
  letter-spacing:0.06em;margin-bottom:4px;
}
.project-title{font-size:9.5pt;font-weight:700;color:var(--ink);margin-bottom:4px}
.project-summary{font-size:8pt;color:var(--ink2);line-height:1.55}
.project-featured{
  display:inline-block;font-size:7pt;padding:1px 7px;
  border-radius:99px;background:#fef9c3;color:#854d0e;
  border:1px solid #fde68a;margin-bottom:4px;font-weight:600;
}
.project-links{margin-top:8px;display:flex;gap:8px}
.project-link{font-size:7.5pt;color:#6366f1;text-decoration:none}

/* ── Skills ── */
.skills-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.skill-group{
  border:1px solid var(--border);border-radius:var(--radius);
  padding:12px;background:#fff;
}
.skill-group-name{
  font-size:7.5pt;font-weight:700;letter-spacing:0.12em;
  text-transform:uppercase;color:var(--ink3);margin-bottom:10px;
}
.skill-row{
  display:flex;justify-content:space-between;align-items:center;
  margin-bottom:7px;
}
.skill-name{font-size:8.5pt;color:var(--ink)}
.skill-badge{
  font-size:7pt;padding:1px 8px;border-radius:99px;
  font-weight:600;
}

/* ── Certs ── */
.cert-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.cert-card{
  border:1px solid var(--border);border-radius:var(--radius);
  overflow:hidden;background:#fff;
}
.cert-img{width:100%;height:70px;object-fit:contain;background:var(--surface);padding:6px}
.cert-img-placeholder{
  width:100%;height:70px;background:linear-gradient(135deg,#f1f5f9,#e2e8f0);
  display:flex;align-items:center;justify-content:center;
  font-size:7.5pt;color:var(--ink3);
}
.cert-body{padding:8px 10px}
.cert-title{font-size:8.5pt;font-weight:700;color:var(--ink)}
.cert-sub{font-size:7.5pt;color:var(--ink3);margin-top:2px}
.cert-verify{font-size:7.5pt;color:#6366f1;text-decoration:none;display:inline-block;margin-top:4px}

/* ── Bootcamp ── */
.bc-item{
  display:flex;gap:14px;padding:12px 0;
  border-bottom:1px solid var(--border);
}
.bc-item:last-child{border-bottom:none}
.bc-logo{
  width:36px;height:36px;border-radius:8px;
  border:1px solid var(--border);background:var(--surface);
  display:flex;align-items:center;justify-content:center;
  font-size:9pt;font-weight:700;color:var(--ink2);flex-shrink:0;overflow:hidden;
}
.bc-logo img{width:100%;height:100%;object-fit:contain;padding:4px}
.bc-name{font-size:9.5pt;font-weight:700;color:var(--ink)}
.bc-org{font-size:8.5pt;color:var(--ink2);margin-top:1px}
.bc-date{font-size:8pt;color:var(--ink3);margin-top:2px}
.bc-desc{font-size:8pt;color:var(--ink2);margin-top:5px;line-height:1.55}

/* ── Footer ── */
.footer{
  margin-top:40px;padding:16px 48px;
  border-top:1px solid var(--border);
  display:flex;justify-content:space-between;align-items:center;
  font-size:7.5pt;color:var(--ink3);
}
</style>
</head>
<body>
`;

  // Print bar + page open
  const body1 = `
<div class="print-bar no-print">
  <span>📄 Executive Summary — ${profile?.name ?? "Portfolio"}</span>
  <button onclick="window.print()">⬇ Save as PDF</button>
</div>
<div class="page">

<!-- COVER -->
<div class="cover">
  ${profile ? '<div class="cover-dot" title="Available"></div>' : ""}
  <div class="cover-label">Executive Summary</div>
  <div class="cover-name">${profile?.name ?? "Portfolio"}</div>
  <div class="cover-title">${profile?.title ?? ""}</div>
  ${profile?.tagline ? `<div class="cover-tagline">${profile.tagline}</div>` : ""}
  <div class="cover-meta">
    ${profile?.email ? `<span>✉ <a href="mailto:${profile.email}">${profile.email}</a></span>` : ""}
    ${profile?.location ? `<span>📍 ${profile.location}</span>` : ""}
    ${profile?.linkedin ? `<span>🔗 <a href="${profile.linkedin}">LinkedIn</a></span>` : ""}
    ${profile?.github ? `<span>⌥ <a href="${profile.github}">GitHub</a></span>` : ""}
    ${profile?.resumeUrl ? `<span>📋 <a href="${profile.resumeUrl}">Full CV</a></span>` : ""}
  </div>
  <div class="cover-date">Generated ${generatedDate}</div>
</div>

<div class="body">
${profile?.bio ? `
<div style="margin-top:28px;padding:18px 20px;background:#f8fafc;border-radius:12px;border-left:4px solid #6366f1;">
  <p style="font-size:9.5pt;line-height:1.75;color:#334155;">${profile.bio}</p>
</div>` : ""}
`;

  const sectionCounter = { n: 1 };
  function sectionHeader(title: string) {
    return `<div class="section-header">
      <div class="section-num">${sectionCounter.n++}</div>
      <div class="section-title">${title}</div>
    </div>`;
  }

  // Experience section
  let expSection = "";
  if (experiences.length > 0) {
    const items = experiences.map((exp) => {
      const dr = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
      const start = new Date(exp.startDate);
      const end = exp.isCurrent ? new Date() : exp.endDate ? new Date(exp.endDate) : new Date();
      const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      const yrs = Math.floor(totalMonths / 12);
      const mos = totalMonths % 12;
      const dur = yrs > 0 ? (mos > 0 ? `${yrs}y ${mos}m` : `${yrs}y`) : `${mos}m`;
      const skillArr = parseJsonArray<string>(exp.skills);
      const docLinks = exp.documentations.filter((d) => d.url);
      const logoHtml = exp.logoUrl
        ? `<img src="${exp.logoUrl}" alt="${exp.company}"/>`
        : exp.company.slice(0, 2).toUpperCase();
      return `
      <div class="exp-item">
        <div class="exp-logo">${logoHtml}</div>
        <div>
          <div class="exp-header">
            <div>
              <div class="exp-role">${exp.role}</div>
              <div class="exp-company">${exp.company}${exp.location ? ` · ${exp.location}` : ""}</div>
              ${exp.isCurrent ? `<div class="exp-current"><span class="exp-dot"></span>Current</div>` : ""}
            </div>
            <div class="exp-meta">${dr}<br/>${dur}</div>
          </div>
          ${exp.description ? `<div class="exp-desc">${exp.description.slice(0, 280)}${exp.description.length > 280 ? "…" : ""}</div>` : ""}
          ${skillArr.length > 0 ? `<div class="skill-chips">${skillArr.map((s) => `<span class="chip">${s}</span>`).join("")}</div>` : ""}
          ${docLinks.length > 0 ? `<div class="exp-docs">${docLinks.map((d) => `<a class="doc-tag" href="${d.url}">${d.title} ↗</a>`).join("")}</div>` : ""}
        </div>
      </div>`;
    }).join("");
    expSection = `<div class="section">${sectionHeader("Working Experience")}${items}</div>`;
  }

  // Bootcamp section
  let bcSection = "";
  if (bootcamps.length > 0) {
    const items = bootcamps.map((bc) => {
      const skillArr = parseJsonArray<string>(bc.skills);
      const dr = formatDateRange(bc.startDate, bc.endDate);
      const logoHtml = bc.logoUrl
        ? `<img src="${bc.logoUrl}" alt="${bc.name}"/>`
        : bc.name.slice(0, 2).toUpperCase();
      return `
      <div class="bc-item">
        <div class="bc-logo">${logoHtml}</div>
        <div>
          <div class="bc-name">${bc.name}</div>
          <div class="bc-org">${bc.organizer ?? "Bootcamp Program"}</div>
          ${dr ? `<div class="bc-date">${dr}</div>` : ""}
          ${bc.description ? `<div class="bc-desc">${bc.description.slice(0, 200)}${bc.description.length > 200 ? "…" : ""}</div>` : ""}
          ${skillArr.length > 0 ? `<div class="skill-chips" style="margin-top:6px">${skillArr.map((s) => `<span class="chip">${s}</span>`).join("")}</div>` : ""}
        </div>
      </div>`;
    }).join("");
    bcSection = `<div class="section">${sectionHeader("Bootcamp & Training")}${items}</div>`;
  }

  // Projects section
  let projSection = "";
  if (projects.length > 0) {
    const cards = projects.map((p) => {
      const techSols = parseJsonArray<{ title: string }>(p.techSolutions);
      const coverHtml = p.coverImage
        ? `<img class="project-cover" src="${p.coverImage}" alt="${p.title}"/>`
        : `<div class="project-cover-placeholder">NO IMAGE</div>`;
      return `
      <div class="project-card">
        ${coverHtml}
        ${p.featured ? `<div class="project-featured">⭐ Featured</div>` : ""}
        <div class="project-year">${p.year ?? ""}</div>
        <div class="project-title">${p.title}</div>
        ${p.summary ? `<div class="project-summary">${p.summary.slice(0, 120)}${p.summary.length > 120 ? "…" : ""}</div>` : ""}
        ${techSols.length > 0 ? `<div class="skill-chips" style="margin-top:8px">${techSols.slice(0, 4).map((t) => `<span class="chip">${t.title}</span>`).join("")}</div>` : ""}
        ${(p.liveUrl || p.githubUrl) ? `<div class="project-links">${p.liveUrl ? `<a class="project-link" href="${p.liveUrl}">Live ↗</a>` : ""}${p.githubUrl ? `<a class="project-link" href="${p.githubUrl}">GitHub ↗</a>` : ""}</div>` : ""}
      </div>`;
    }).join("");
    projSection = `<div class="section">${sectionHeader("Selected Portfolio")}<div class="project-grid">${cards}</div></div>`;
  }

  // Skills section
  let skillSection = "";
  if (Object.keys(skillGroups).length > 0) {
    const groups = Object.entries(skillGroups).map(([cat, items]) => {
      const rows = items.map((s) => {
        const color = LEVEL_COLOR[s.level] ?? "#94a3b8";
        const label = LEVEL_LABEL[s.level] ?? String(s.level);
        return `<div class="skill-row">
          <span class="skill-name">${s.name}</span>
          <span class="skill-badge" style="background:${color}18;color:${color};border:1px solid ${color}40">${label}</span>
        </div>`;
      }).join("");
      return `<div class="skill-group">
        <div class="skill-group-name">${cat}</div>${rows}
      </div>`;
    }).join("");
    skillSection = `<div class="section">${sectionHeader("Skills & Expertise")}<div class="skills-grid">${groups}</div></div>`;
  }

  // Certificates section
  let certSection = "";
  if (certificates.length > 0) {
    const cards = certificates.map((c) => {
      const imgHtml = c.imageUrl
        ? `<img class="cert-img" src="${c.imageUrl}" alt="${c.title}"/>`
        : `<div class="cert-img-placeholder">CERTIFICATE</div>`;
      const issued = c.issuedAt
        ? new Date(c.issuedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : null;
      return `<div class="cert-card">
        ${imgHtml}
        <div class="cert-body">
          <div class="cert-title">${c.title}</div>
          <div class="cert-sub">${[c.issuer, issued].filter(Boolean).join(" · ")}</div>
          ${c.credentialUrl ? `<a class="cert-verify" href="${c.credentialUrl}">Verify ↗</a>` : ""}
        </div>
      </div>`;
    }).join("");
    certSection = `<div class="section">${sectionHeader("Certificates")}<div class="cert-grid">${cards}</div></div>`;
  }

  const footer = `
<div class="footer">
  <span>${profile?.name ?? "Portfolio"} — Executive Summary</span>
  <span>Generated ${generatedDate}</span>
</div>
</div><!-- /body -->
</div><!-- /page -->
</body></html>`;

  const fullHtml = html + body1 + expSection + bcSection + projSection + skillSection + certSection + footer;

  return new Response(fullHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
