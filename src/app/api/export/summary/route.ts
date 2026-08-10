import { NextResponse } from "next/server";
import { getFullPortfolio } from "@/lib/data";
import { parseJsonArray, formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const { profile, experiences, bootcamps, projects, skills, certificates } =
    await getFullPortfolio();

  // Group skills by category
  const skillGroups = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});

  const LEVEL_LABEL: Record<number, string> = {
    1: "Beginner", 2: "Elementary", 3: "Intermediate", 4: "Advanced", 5: "Expert",
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Executive Summary — ${profile?.name ?? "Portfolio"}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    font-size: 10pt;
    color: #1a1a1a;
    background: #fff;
    padding: 0;
  }
  @page { size: A4; margin: 18mm 16mm 16mm 16mm; }
  @media print {
    .no-print { display: none !important; }
    body { padding: 0; }
    section { page-break-inside: avoid; }
    h2 { page-break-after: avoid; }
  }

  /* Print button */
  .print-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 24px;
    background: #111; color: #fff;
  }
  .print-bar span { font-size: 13px; font-weight: 600; }
  .print-bar button {
    padding: 7px 20px; border-radius: 8px; border: none;
    background: #fff; color: #111; font-size: 13px; font-weight: 600;
    cursor: pointer;
  }
  .print-bar button:hover { background: #e5e5e5; }

  .page { max-width: 210mm; margin: 0 auto; padding: 56px 0 32px; }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid #111; }
  .header-name { font-size: 24pt; font-weight: 700; letter-spacing: -0.5px; line-height: 1.1; }
  .header-title { font-size: 12pt; color: #555; margin-top: 4px; }
  .header-contact { text-align: right; font-size: 9pt; color: #555; line-height: 1.8; }
  .header-contact a { color: #555; text-decoration: none; }

  /* Section */
  section { margin-bottom: 22px; }
  h2 {
    font-size: 7pt; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; color: #888;
    border-bottom: 1px solid #e5e5e5; padding-bottom: 5px; margin-bottom: 12px;
  }

  /* Experience / Bootcamp item */
  .item { margin-bottom: 14px; display: flex; gap: 12px; }
  .item-left { min-width: 100px; max-width: 100px; color: #888; font-size: 8.5pt; padding-top: 1px; }
  .item-body { flex: 1; }
  .item-title { font-size: 11pt; font-weight: 600; }
  .item-sub { font-size: 9.5pt; color: #555; margin-top: 1px; }
  .item-desc { font-size: 9pt; color: #444; margin-top: 5px; line-height: 1.55; }
  .item-docs { margin-top: 6px; }
  .doc-link { font-size: 8.5pt; color: #1a56db; text-decoration: none; display: inline-block; margin-right: 10px; }

  /* Projects */
  .project { margin-bottom: 14px; }
  .project-header { display: flex; justify-content: space-between; align-items: baseline; }
  .project-title { font-size: 10.5pt; font-weight: 600; }
  .project-year { font-size: 8.5pt; color: #888; }
  .project-summary { font-size: 9pt; color: #444; margin-top: 3px; line-height: 1.5; }
  .project-tech { margin-top: 5px; display: flex; flex-wrap: wrap; gap: 4px; }
  .badge {
    display: inline-block; font-size: 7.5pt; padding: 2px 7px;
    border-radius: 4px; border: 1px solid #ddd; color: #555;
  }

  /* Skills grid */
  .skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .skill-cat { }
  .skill-cat-name { font-size: 8pt; font-weight: 600; color: #888; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.1em; }
  .skill-row { display: flex; justify-content: space-between; font-size: 9pt; margin-bottom: 3px; }
  .skill-level { font-size: 8pt; color: #888; }

  /* Certs */
  .cert-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .cert { font-size: 9pt; }
  .cert-title { font-weight: 600; }
  .cert-sub { color: #888; font-size: 8.5pt; margin-top: 1px; }

  /* Footer */
  .footer { margin-top: 28px; padding-top: 10px; border-top: 1px solid #e5e5e5; display: flex; justify-content: space-between; font-size: 8pt; color: #aaa; }
</style>
</head>
<body>

<div class="print-bar no-print">
  <span>Executive Summary — ${profile?.name ?? "Portfolio"}</span>
  <button onclick="window.print()">⬇ Save as PDF</button>
</div>

<div class="page">

  <!-- Header -->
  <div class="header">
    <div>
      <div class="header-name">${profile?.name ?? "—"}</div>
      <div class="header-title">${profile?.title ?? ""}</div>
      ${profile?.tagline ? `<div style="font-size:9pt;color:#666;margin-top:6px;max-width:340px;">${profile.tagline}</div>` : ""}
    </div>
    <div class="header-contact">
      ${profile?.email ? `<div><a href="mailto:${profile.email}">${profile.email}</a></div>` : ""}
      ${profile?.location ? `<div>${profile.location}</div>` : ""}
      ${profile?.linkedin ? `<div><a href="${profile.linkedin}">LinkedIn</a></div>` : ""}
      ${profile?.github ? `<div><a href="${profile.github}">GitHub</a></div>` : ""}
      ${profile?.resumeUrl ? `<div><a href="${profile.resumeUrl}">Resume / CV</a></div>` : ""}
      <div style="margin-top:4px;color:#aaa;">Generated ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
    </div>
  </div>

  ${profile?.bio ? `
  <!-- Bio -->
  <section>
    <h2>Profile</h2>
    <p style="font-size:9.5pt;line-height:1.6;color:#444;">${profile.bio}</p>
  </section>` : ""}

  ${experiences.length > 0 ? `
  <!-- Experience -->
  <section>
    <h2>Working Experience</h2>
    ${experiences.map((exp) => {
      const dr = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
      const start = new Date(exp.startDate);
      const end = exp.isCurrent ? new Date() : exp.endDate ? new Date(exp.endDate) : new Date();
      const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      const yrs = Math.floor(totalMonths / 12);
      const mos = totalMonths % 12;
      const dur = yrs > 0 ? (mos > 0 ? `${yrs}y ${mos}m` : `${yrs}y`) : `${mos}m`;
      return `
      <div class="item">
        <div class="item-left">${dr}<br/><span style="color:#bbb;">${dur}</span></div>
        <div class="item-body">
          <div class="item-title">${exp.role}</div>
          <div class="item-sub">${exp.company}${exp.location ? ` · ${exp.location}` : ""}${exp.isCurrent ? ' <span style="color:#16a34a;font-size:8pt;">● Current</span>' : ""}</div>
          ${exp.description ? `<div class="item-desc">${exp.description.slice(0, 300)}${exp.description.length > 300 ? "…" : ""}</div>` : ""}
          ${exp.documentations.length > 0 ? `
          <div class="item-docs">
            ${exp.documentations.filter(d => d.url).map(d => `<a class="doc-link" href="${d.url}">${d.title} ↗</a>`).join("")}
          </div>` : ""}
        </div>
      </div>`;
    }).join("")}
  </section>` : ""}

  ${bootcamps.length > 0 ? `
  <!-- Bootcamps -->
  <section>
    <h2>Bootcamp &amp; Training</h2>
    ${bootcamps.map((bc) => {
      const skills = parseJsonArray<string>(bc.skills);
      const dr = formatDateRange(bc.startDate, bc.endDate);
      return `
      <div class="item">
        <div class="item-left">${dr || "—"}</div>
        <div class="item-body">
          <div class="item-title">${bc.name}</div>
          <div class="item-sub">${bc.organizer ?? "Bootcamp Program"}</div>
          ${bc.description ? `<div class="item-desc">${bc.description.slice(0, 200)}${bc.description.length > 200 ? "…" : ""}</div>` : ""}
          ${skills.length > 0 ? `<div style="margin-top:4px;">${skills.map(s => `<span class="badge">${s}</span>`).join(" ")}</div>` : ""}
        </div>
      </div>`;
    }).join("")}
  </section>` : ""}

  ${projects.length > 0 ? `
  <!-- Projects -->
  <section>
    <h2>Selected Portfolio</h2>
    ${projects.map((p) => {
      const techSols = parseJsonArray<{ title: string; description?: string }>(p.techSolutions);
      return `
      <div class="project">
        <div class="project-header">
          <span class="project-title">${p.title}</span>
          <span class="project-year">${p.year ?? ""}${p.featured ? " · Featured" : ""}</span>
        </div>
        ${p.summary ? `<div class="project-summary">${p.summary}</div>` : ""}
        ${techSols.length > 0 ? `
        <div class="project-tech">
          ${techSols.map(t => `<span class="badge">${t.title}</span>`).join("")}
        </div>` : ""}
        ${(p.liveUrl || p.githubUrl) ? `
        <div style="margin-top:4px;">
          ${p.liveUrl ? `<a class="doc-link" href="${p.liveUrl}">Live ↗</a>` : ""}
          ${p.githubUrl ? `<a class="doc-link" href="${p.githubUrl}">GitHub ↗</a>` : ""}
        </div>` : ""}
      </div>`;
    }).join("")}
  </section>` : ""}

  ${Object.keys(skillGroups).length > 0 ? `
  <!-- Skills -->
  <section>
    <h2>Skills</h2>
    <div class="skills-grid">
      ${Object.entries(skillGroups).map(([cat, items]) => `
      <div class="skill-cat">
        <div class="skill-cat-name">${cat}</div>
        ${items.map(s => `
        <div class="skill-row">
          <span>${s.name}</span>
          <span class="skill-level">${LEVEL_LABEL[s.level] ?? s.level}</span>
        </div>`).join("")}
      </div>`).join("")}
    </div>
  </section>` : ""}

  ${certificates.length > 0 ? `
  <!-- Certificates -->
  <section>
    <h2>Certificates</h2>
    <div class="cert-grid">
      ${certificates.map(c => `
      <div class="cert">
        <div class="cert-title">${c.title}</div>
        <div class="cert-sub">${[c.issuer, c.issuedAt ? new Date(c.issuedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : null].filter(Boolean).join(" · ")}</div>
        ${c.credentialUrl ? `<a class="doc-link" href="${c.credentialUrl}">Verify ↗</a>` : ""}
      </div>`).join("")}
    </div>
  </section>` : ""}

  <div class="footer">
    <span>${profile?.name ?? "Portfolio"} — Executive Summary</span>
    <span>Generated ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}</span>
  </div>

</div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
