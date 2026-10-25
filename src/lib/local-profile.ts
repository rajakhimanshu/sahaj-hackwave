export type FamilyProfile = {
  id: string;
  familyName: string;
  displayName: string;
  city: string;
  preferredLanguage: "en" | "hi" | "elder";
  createdAt: string;
  lastSeenAt: string;
};

export type LocalSession = {
  profileId: string;
  signedInAt: string;
};

const PROFILE_KEY = "sahaj_profiles_v1";
const SESSION_KEY = "sahaj_session_v1";
const PIN_PREFIX = "sahaj_pin_";

function readProfiles(): FamilyProfile[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || "[]") as FamilyProfile[];
  } catch {
    return [];
  }
}

function writeProfiles(profiles: FamilyProfile[]) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles.slice(0, 8)));
}

function hashPin(pin: string) {
  // Local-only obfuscation for demo UX — not server-grade security.
  let h = 2166136261;
  const input = `sahaj:${pin}`;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `v1_${(h >>> 0).toString(16)}`;
}

export function listProfiles(): FamilyProfile[] {
  return readProfiles().sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt));
}

export function getSession(): LocalSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as LocalSession) : null;
  } catch {
    return null;
  }
}

export function getActiveProfile(): FamilyProfile | null {
  const session = getSession();
  if (!session) return null;
  return readProfiles().find((p) => p.id === session.profileId) || null;
}

export function signOut() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function createProfile(input: {
  familyName: string;
  displayName: string;
  city: string;
  preferredLanguage: FamilyProfile["preferredLanguage"];
  pin: string;
}): FamilyProfile {
  if (!/^\d{4}$/.test(input.pin)) {
    throw new Error("Use a 4-digit local PIN");
  }
  const now = new Date().toISOString();
  const profile: FamilyProfile = {
    id: crypto.randomUUID(),
    familyName: input.familyName.trim(),
    displayName: input.displayName.trim(),
    city: input.city.trim(),
    preferredLanguage: input.preferredLanguage,
    createdAt: now,
    lastSeenAt: now,
  };
  writeProfiles([profile, ...readProfiles()]);
  localStorage.setItem(`${PIN_PREFIX}${profile.id}`, hashPin(input.pin));
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ profileId: profile.id, signedInAt: now } satisfies LocalSession)
  );
  return profile;
}

export function signIn(profileId: string, pin: string): FamilyProfile {
  const profile = readProfiles().find((p) => p.id === profileId);
  if (!profile) throw new Error("Family profile not found on this device");
  const saved = localStorage.getItem(`${PIN_PREFIX}${profileId}`);
  if (!saved || saved !== hashPin(pin)) {
    throw new Error("Incorrect local PIN");
  }
  const now = new Date().toISOString();
  const next = readProfiles().map((p) =>
    p.id === profileId ? { ...p, lastSeenAt: now } : p
  );
  writeProfiles(next);
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ profileId, signedInAt: now } satisfies LocalSession)
  );
  return next.find((p) => p.id === profileId)!;
}

export function updateProfile(
  profileId: string,
  patch: Partial<
    Pick<FamilyProfile, "familyName" | "displayName" | "city" | "preferredLanguage">
  >
): FamilyProfile {
  const next = readProfiles().map((p) =>
    p.id === profileId
      ? {
          ...p,
          ...patch,
          lastSeenAt: new Date().toISOString(),
        }
      : p
  );
  writeProfiles(next);
  const updated = next.find((p) => p.id === profileId);
  if (!updated) throw new Error("Profile missing");
  return updated;
}

export function deleteProfile(profileId: string) {
  writeProfiles(readProfiles().filter((p) => p.id !== profileId));
  localStorage.removeItem(`${PIN_PREFIX}${profileId}`);
  const session = getSession();
  if (session?.profileId === profileId) signOut();
}

export function profileStatsCopy(profile: FamilyProfile | null) {
  if (!profile) return "Guest mode · vault stays on this browser";
  return `${profile.displayName} · ${profile.familyName} · local PIN session`;
}
