import Link from "next/link";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { getProfile } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <section className="section-pad">
      <div className="container-page max-w-3xl">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
          Contact
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Let&apos;s build something reliable.
        </h1>
        <p className="mt-4 text-muted">
          For roles, collaborations, or technical discussions around AIoT systems.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="card flex items-center gap-3 p-5">
              <Mail size={18} />
              <div>
                <p className="text-xs text-muted">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </a>
          )}
          {profile?.phone && (
            <a href={`tel:${profile.phone}`} className="card flex items-center gap-3 p-5">
              <Phone size={18} />
              <div>
                <p className="text-xs text-muted">Phone</p>
                <p className="font-medium">{profile.phone}</p>
              </div>
            </a>
          )}
          {profile?.location && (
            <div className="card flex items-center gap-3 p-5">
              <MapPin size={18} />
              <div>
                <p className="text-xs text-muted">Location</p>
                <p className="font-medium">{profile.location}</p>
              </div>
            </div>
          )}
          {profile?.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="card flex items-center gap-3 p-5"
            >
              <Linkedin size={18} />
              <div>
                <p className="text-xs text-muted">LinkedIn</p>
                <p className="font-medium">Profile</p>
              </div>
            </a>
          )}
          {profile?.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="card flex items-center gap-3 p-5"
            >
              <Github size={18} />
              <div>
                <p className="text-xs text-muted">GitHub</p>
                <p className="font-medium">Repositories</p>
              </div>
            </a>
          )}
        </div>

        <div className="mt-10">
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            ← Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
