"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  createProfile,
  deleteProfile,
  getActiveProfile,
  listProfiles,
  signIn,
  signOut,
  updateProfile,
  type FamilyProfile,
} from "@/lib/local-profile";
import { vaultStats } from "@/lib/vault";

type Mode = "home" | "create" | "signin";

const fieldClass =
  "h-11 w-full border border-[var(--line)] bg-[var(--paper)] px-3 outline-none focus:ring-2 focus:ring-[var(--glow)]";

export default function AccountPage() {
  const [mode, setMode] = useState<Mode>("home");
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [active, setActive] = useState<FamilyProfile | null>(null);
  const [stats, setStats] = useState({ total: 0, needsAttention: 0 });
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [familyName, setFamilyName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [language, setLanguage] =
    useState<FamilyProfile["preferredLanguage"]>("en");
  const [pin, setPin] = useState("");
  const [selectedId, setSelectedId] = useState("");

  function refresh() {
    setProfiles(listProfiles());
    setActive(getActiveProfile());
    setStats(vaultStats());
  }

  useEffect(() => {
    const frame = requestAnimationFrame(refresh);
    return () => cancelAnimationFrame(frame);
  }, []);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      createProfile({
        familyName,
        displayName,
        city,
        preferredLanguage: language,
        pin,
      });
      setMode("home");
      setPin("");
      refresh();
      flash("Family profile created on this device");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create profile");
    }
  }

  function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (!selectedId) throw new Error("Choose a family profile");
      signIn(selectedId, pin);
      setMode("home");
      setPin("");
      refresh();
      flash("Signed in locally");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    }
  }

  return (
    <div>
      <div className="mb-8 border-b border-[var(--night)] pb-7">
        <p className="text-xs font-semibold text-[var(--accent)]">
          LOCAL FAMILY PROFILE
        </p>
        <h1 className="mt-2 font-display text-4xl text-[var(--night)] sm:text-5xl">
          Account on this device
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--slate)]">
          No cloud database. Profiles and PINs stay in this browser — same
          privacy model as the vault. Optional, so Sahaj still works in guest
          mode.
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Vault briefs" value={String(stats.total)} />
        <Stat label="Needs attention" value={String(stats.needsAttention)} />
        <Stat label="Mode" value={active ? "Signed in" : "Guest"} />
      </div>

      {active ? (
        <section className="folder-shadow border border-[var(--night)] bg-[var(--panel)] p-6 sm:p-8">
          <p className="text-xs font-semibold text-[var(--accent)]">
            ACTIVE SESSION
          </p>
          <h2 className="mt-3 font-display text-3xl text-[var(--night)]">
            {active.displayName}
          </h2>
          <p className="mt-2 text-sm text-[var(--slate)]">
            {active.familyName}
            {active.city ? ` · ${active.city}` : ""} · preferred{" "}
            {active.preferredLanguage.toUpperCase()}
          </p>

          <form
            className="mt-8 grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(active.id, {
                familyName: active.familyName,
                displayName: active.displayName,
                city: active.city,
                preferredLanguage: active.preferredLanguage,
              });
              refresh();
              flash("Profile updated");
            }}
          >
            <Field label="Display name">
              <input
                className={fieldClass}
                value={active.displayName}
                onChange={(e) =>
                  setActive({ ...active, displayName: e.target.value })
                }
              />
            </Field>
            <Field label="Family name">
              <input
                className={fieldClass}
                value={active.familyName}
                onChange={(e) =>
                  setActive({ ...active, familyName: e.target.value })
                }
              />
            </Field>
            <Field label="City">
              <input
                className={fieldClass}
                value={active.city}
                onChange={(e) => setActive({ ...active, city: e.target.value })}
              />
            </Field>
            <Field label="Preferred reading">
              <select
                className={fieldClass}
                value={active.preferredLanguage}
                onChange={(e) =>
                  setActive({
                    ...active,
                    preferredLanguage: e.target
                      .value as FamilyProfile["preferredLanguage"],
                  })
                }
              >
                <option value="en">Simple English</option>
                <option value="hi">Hindi</option>
                <option value="elder">Elder mode</option>
              </select>
            </Field>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                className="focus-ring bg-[var(--night)] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Save profile
              </button>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  refresh();
                  flash("Signed out");
                }}
                className="focus-ring border border-[var(--night)] px-5 py-2.5 text-sm font-semibold"
              >
                Sign out
              </button>
              <Link
                href="/app"
                className="focus-ring border border-[var(--line)] px-5 py-2.5 text-sm font-semibold"
              >
                Go to workspace
              </Link>
            </div>
          </form>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="border border-[var(--night)] bg-[var(--panel)] p-6 sm:p-8">
            <h2 className="font-display text-2xl text-[var(--night)]">
              Why local login?
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--ink-soft)]">
              <li>Looks like a full platform, not a one-page demo tool</li>
              <li>No external database — profiles live in browser storage</li>
              <li>
                DPDP-friendlier than forcing cloud accounts for a hackathon
              </li>
              <li>Guest mode still works for judges who skip signup</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode("create");
                  setError(null);
                }}
                className="focus-ring bg-[var(--night)] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Create family profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                  setSelectedId(profiles[0]?.id || "");
                }}
                className="focus-ring border border-[var(--night)] px-5 py-2.5 text-sm font-semibold disabled:opacity-40"
                disabled={profiles.length === 0}
              >
                Sign in
              </button>
            </div>
          </div>

          <div className="border border-[var(--night)] bg-[var(--mist)] p-6 sm:p-8">
            {mode === "create" ? (
              <form onSubmit={onCreate} className="space-y-4">
                <h3 className="font-display text-2xl text-[var(--night)]">
                  Create profile
                </h3>
                <Field label="Your name">
                  <input
                    className={fieldClass}
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </Field>
                <Field label="Family name">
                  <input
                    className={fieldClass}
                    required
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                  />
                </Field>
                <Field label="City">
                  <input
                    className={fieldClass}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Field>
                <Field label="Preferred reading">
                  <select
                    className={fieldClass}
                    value={language}
                    onChange={(e) =>
                      setLanguage(
                        e.target.value as FamilyProfile["preferredLanguage"]
                      )
                    }
                  >
                    <option value="en">Simple English</option>
                    <option value="hi">Hindi</option>
                    <option value="elder">Elder mode</option>
                  </select>
                </Field>
                <Field label="4-digit local PIN">
                  <input
                    className={fieldClass}
                    inputMode="numeric"
                    pattern="\d{4}"
                    maxLength={4}
                    required
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                  />
                </Field>
                {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
                <button
                  type="submit"
                  className="focus-ring bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Create &amp; sign in
                </button>
              </form>
            ) : mode === "signin" ? (
              <form onSubmit={onSignIn} className="space-y-4">
                <h3 className="font-display text-2xl text-[var(--night)]">
                  Sign in
                </h3>
                <Field label="Family profile">
                  <select
                    className={fieldClass}
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                  >
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.displayName} · {p.familyName}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="4-digit local PIN">
                  <input
                    className={fieldClass}
                    inputMode="numeric"
                    pattern="\d{4}"
                    maxLength={4}
                    required
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                  />
                </Field>
                {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
                <button
                  type="submit"
                  className="focus-ring bg-[var(--night)] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Unlock profile
                </button>
              </form>
            ) : (
              <>
                <h3 className="font-display text-2xl text-[var(--night)]">
                  Saved on this browser
                </h3>
                {profiles.length === 0 ? (
                  <p className="mt-3 text-sm text-[var(--slate)]">
                    No profiles yet. Create one to personalize the workspace.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {profiles.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between gap-3 border border-[var(--night)] bg-[var(--panel)] px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-[var(--night)]">
                            {p.displayName}
                          </p>
                          <p className="text-xs text-[var(--slate)]">
                            {p.familyName}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-[var(--danger)]"
                          onClick={() => {
                            if (window.confirm("Delete this local profile?")) {
                              deleteProfile(p.id);
                              refresh();
                            }
                          }}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-white/20 bg-[var(--night)] px-5 py-2.5 text-sm text-white"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--night)] bg-[var(--panel)] px-4 py-3">
      <p className="text-xs text-[var(--slate)]">{label}</p>
      <p className="mt-1 font-display text-2xl text-[var(--night)]">{value}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-[var(--slate)]">{label}</span>
      {children}
    </label>
  );
}
