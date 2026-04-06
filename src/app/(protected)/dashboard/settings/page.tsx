"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/store/services/settingsApi";
import { useUpdateUserMutation } from "@/store/services/userApi";
import { useLazyGetProfileQuery } from "@/store/services/authApi";
import type { RootState } from "@/store";
import { toast } from "sonner";

type Tab = "organization" | "contact_footer" | "deposit" | "security" | "appearance";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "organization", label: "Organization", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
  { id: "contact_footer", label: "Contact & Footer", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  { id: "deposit", label: "Deposit Rules", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
  { id: "security", label: "Security", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
  { id: "appearance", label: "Appearance", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg> },
];

function SaveRow({ saving, saved }: { saving: boolean; saved: boolean }) {
  return (
    <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-2">
      <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-60">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        {saving ? "Saving…" : "Save Changes"}
      </button>
      {saved && <p className="text-sm text-green-600 font-medium">✓ Saved successfully!</p>}
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button type="button" onClick={() => onChange(!checked)} className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-4 ${checked ? "bg-green-500" : "bg-gray-200"}`}>
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400";

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("organization");
  const { data: settings, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: updateLoading }] = useUpdateSettingsMutation();

  // ── Organization (from API) ───────────────────────────────────
  const [org, setOrg] = useState({ name: "", regNo: "", email: "", phone: "", address: "", website: "", whyImfTitle: "", whyImfSubtitle: "", whyImfText: "" });
  const [orgSaved, setOrgSaved] = useState(false);
  useEffect(() => {
    if (settings) {
      setOrg({
        name: settings.org_name ?? "",
        regNo: settings.reg_no ?? "",
        email: settings.contact_email ?? "",
        phone: settings.contact_phone ?? "",
        address: settings.address ?? "",
        website: settings.website ?? "",
        whyImfTitle: settings.why_imf_title ?? "",
        whyImfSubtitle: settings.why_imf_subtitle ?? "",
        whyImfText: settings.why_imf_text ?? "",
      });
    }
  }, [settings]);

  // ── Contact & Footer (from API) ───────────────────────────────
  const [contactFooter, setContactFooter] = useState({
    contact_email: "", contact_uae_address: "", contact_uae_phone: "",
    contact_bd_address: "", contact_bd_phone: "",
    footer_email: "", footer_phone: "",
    facebook_url: "", twitter_url: "", instagram_url: "", linkedin_url: "",
  });
  const [contactFooterSaved, setContactFooterSaved] = useState(false);
  useEffect(() => {
    if (settings) {
      setContactFooter({
        contact_email: settings.contact_email ?? "",
        contact_uae_address: settings.contact_uae_address ?? "",
        contact_uae_phone: settings.contact_uae_phone ?? "",
        contact_bd_address: settings.contact_bd_address ?? "",
        contact_bd_phone: settings.contact_bd_phone ?? "",
        footer_email: settings.footer_email ?? "",
        footer_phone: settings.footer_phone ?? "",
        facebook_url: settings.facebook_url ?? "",
        twitter_url: settings.twitter_url ?? "",
        instagram_url: settings.instagram_url ?? "",
        linkedin_url: settings.linkedin_url ?? "",
      });
    }
  }, [settings]);

  // ── Deposit (local only for now) ───────────────────────────────
  const [dep, setDep] = useState({ minMonthly: "1000", minYearly: "12000", latePenalty: "0", reminderDays: "5" });
  const [depToggles, setDepToggles] = useState({ lateReminders: true, emailReceipts: true, onlineDeposit: false, autoReceipt: true });
  const [depSaving, setDepSaving] = useState(false);
  const [depSaved, setDepSaved] = useState(false);

  // ── Security (Admin account: email + password) ─────────────────
  const auth = useSelector((state: RootState) => state.auth) as { uuid?: string | null; email?: string | null };
  const [updateUser] = useUpdateUserMutation();
  const [getProfile] = useLazyGetProfileQuery();
  const [sec, setSec] = useState({ email: "", newPass: "", confirm: "" });
  const [secToggles, setSecToggles] = useState({ twoFactor: false, sessionTimeout: true, loginAlerts: true });
  const [secSaving, setSecSaving] = useState(false);
  const [secSaved, setSecSaved] = useState(false);
  const [secError, setSecError] = useState("");
  useEffect(() => {
    if (auth?.email != null) setSec((p) => ({ ...p, email: auth.email ?? "" }));
  }, [auth?.email]);

  // ── Appearance ────────────────────────────────────────────────
  const [appear, setAppear] = useState({ primaryColor: "#22c55e", dateFormat: "DD/MM/YYYY", currency: "BDT", language: "en", heroSliderInterval: "" });
  const [appearSaving, setAppearSaving] = useState(false);
  const [appearSaved, setAppearSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setAppear((p) => ({
        ...p,
        heroSliderInterval: settings.hero_slider_interval != null ? String(settings.hero_slider_interval) : "",
      }));
    }
  }, [settings]);

  async function saveOrg(e: React.FormEvent) {
    e.preventDefault();
    setOrgSaved(false);
    try {
      await updateSettings({
        org_name: org.name,
        reg_no: org.regNo,
        contact_email: org.email,
        contact_phone: org.phone,
        address: org.address,
        website: org.website,
        why_imf_title: org.whyImfTitle,
        why_imf_subtitle: org.whyImfSubtitle,
        why_imf_text: org.whyImfText,
      }).unwrap();
      setOrgSaved(true);
      toast.success("Organization settings saved.");
      setTimeout(() => setOrgSaved(false), 4000);
    } catch (err: unknown) {
      toast.error(err && typeof err === "object" && "data" in err && (err as { data?: { detail?: string } }).data?.detail ? String((err as { data: { detail: string } }).data.detail) : "Failed to save.");
    }
  }

  async function saveContactFooter(e: React.FormEvent) {
    e.preventDefault();
    setContactFooterSaved(false);
    try {
      await updateSettings({
        contact_email: contactFooter.contact_email,
        contact_uae_address: contactFooter.contact_uae_address,
        contact_uae_phone: contactFooter.contact_uae_phone,
        contact_bd_address: contactFooter.contact_bd_address,
        contact_bd_phone: contactFooter.contact_bd_phone,
        footer_email: contactFooter.footer_email,
        footer_phone: contactFooter.footer_phone,
        facebook_url: contactFooter.facebook_url,
        twitter_url: contactFooter.twitter_url,
        instagram_url: contactFooter.instagram_url,
        linkedin_url: contactFooter.linkedin_url,
      }).unwrap();
      setContactFooterSaved(true);
      toast.success("Contact & footer settings saved.");
      setTimeout(() => setContactFooterSaved(false), 4000);
    } catch (err: unknown) {
      toast.error(err && typeof err === "object" && "data" in err && (err as { data?: { detail?: string } }).data?.detail ? String((err as { data: { detail: string } }).data.detail) : "Failed to save.");
    }
  }

  async function saveDep(e: React.FormEvent) {
    e.preventDefault();
    setDepSaving(true);
    setDepSaved(false);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setDepSaved(true);
      setTimeout(() => setDepSaved(false), 4000);
    } finally {
      setDepSaving(false);
    }
  }

  async function saveSec(e: React.FormEvent) {
    e.preventDefault();
    setSecError("");
    const emailTrim = sec.email?.trim();
    if (!auth?.uuid) {
      setSecError("You must be logged in to update your account.");
      return;
    }
    if (!emailTrim) {
      setSecError("Email is required.");
      return;
    }
    if (sec.newPass && sec.newPass.length < 8) {
      setSecError("New password must be at least 8 characters.");
      return;
    }
    if (sec.newPass && sec.newPass !== sec.confirm) {
      setSecError("Passwords do not match.");
      return;
    }
    setSecSaving(true);
    setSecSaved(false);
    try {
      const body: { email?: string; password?: string } = { email: emailTrim };
      if (sec.newPass) body.password = sec.newPass;
      await updateUser({ uuid: auth.uuid, body }).unwrap();
      await getProfile().unwrap();
      setSecSaved(true);
      setSec((p) => ({ ...p, newPass: "", confirm: "" }));
      setTimeout(() => setSecSaved(false), 4000);
      toast.success("Admin account updated. Use your new email to log in next time.");
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "data" in err && (err as { data?: { detail?: string } }).data?.detail;
      setSecError(typeof msg === "string" ? msg : "Failed to update account.");
      toast.error(typeof msg === "string" ? msg : "Failed to update account.");
    } finally {
      setSecSaving(false);
    }
  }

  async function saveAppear(e: React.FormEvent) {
    e.preventDefault();
    setAppearSaving(true);
    setAppearSaved(false);
    try {
      const parsed = appear.heroSliderInterval.trim() ? Number(appear.heroSliderInterval.trim()) : null;
      await updateSettings({
        hero_slider_interval: parsed != null && Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : null,
      }).unwrap();
      setAppearSaved(true);
      toast.success("Appearance settings saved.");
      setTimeout(() => setAppearSaved(false), 4000);
    } catch (err: unknown) {
      toast.error(err && typeof err === "object" && "data" in err && (err as { data?: { detail?: string } }).data?.detail ? String((err as { data: { detail: string } }).data.detail) : "Failed to save.");
    } finally {
      setAppearSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-gray-500">Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-1.5 flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-1 justify-center ${tab === t.id ? "bg-green-500 text-white shadow-sm" : "text-gray-600 hover:bg-green-50 hover:text-green-700"}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Organization ─────────────────────────────────────── */}
      {tab === "organization" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5">Organization Information</h2>
          <form onSubmit={saveOrg} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([["Organization Name", "name", "text", "e.g. IMF Foundation"], ["Registration No.", "regNo", "text", "REG-2024-001"], ["Contact Email", "email", "email", "admin@imf.org"], ["Phone", "phone", "tel", "+880 17XX-XXXXXX"], ["Website", "website", "url", "https://imf.org"]] as const).map(([label, key, type, ph]) => (
                <div key={String(key)}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input type={String(type)} value={(org as Record<string, string>)[key]} onChange={(e) => setOrg((p) => ({ ...p, [key]: e.target.value }))} placeholder={String(ph)} className={inputCls} />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <textarea rows={2} value={org.address} onChange={(e) => setOrg((p) => ({ ...p, address: e.target.value }))} placeholder="Full address" className={`${inputCls} resize-none`} />
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Why IMF-BD Section</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Section Title</label>
                <input
                  type="text"
                  value={org.whyImfTitle}
                  onChange={(e) => setOrg((p) => ({ ...p, whyImfTitle: e.target.value }))}
                  placeholder="Why IMF-BD?"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
                <input
                  type="text"
                  value={org.whyImfSubtitle}
                  onChange={(e) => setOrg((p) => ({ ...p, whyImfSubtitle: e.target.value }))}
                  placeholder="IMF-BD কেন?"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows={6}
                  value={org.whyImfText}
                  onChange={(e) => setOrg((p) => ({ ...p, whyImfText: e.target.value }))}
                  placeholder="Write full Why IMF-BD text..."
                  className={`${inputCls} resize-y`}
                />
              </div>
            </div>
            <SaveRow saving={updateLoading} saved={orgSaved} />
          </form>
        </div>
      )}

      {/* ── Contact & Footer ─────────────────────────────────── */}
      {tab === "contact_footer" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-8">
          <h2 className="text-base font-semibold text-gray-800">Contact Us & Footer</h2>
          <form onSubmit={saveContactFooter} className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Contact Us (public page)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                  <input type="email" value={contactFooter.contact_email} onChange={(e) => setContactFooter((p) => ({ ...p, contact_email: e.target.value }))} placeholder="Imfbd@gmail.com" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">UAE Address</label>
                  <textarea rows={2} value={contactFooter.contact_uae_address} onChange={(e) => setContactFooter((p) => ({ ...p, contact_uae_address: e.target.value }))} placeholder="Fatima Al Khadim Building, Shop No. #18..." className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">UAE Phone</label>
                  <input type="tel" value={contactFooter.contact_uae_phone} onChange={(e) => setContactFooter((p) => ({ ...p, contact_uae_phone: e.target.value }))} placeholder="+971526114454" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">BD Address</label>
                  <textarea rows={2} value={contactFooter.contact_bd_address} onChange={(e) => setContactFooter((p) => ({ ...p, contact_bd_address: e.target.value }))} placeholder="Holy Garden Complex 12/D..." className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">BD Phone</label>
                  <input type="tel" value={contactFooter.contact_bd_phone} onChange={(e) => setContactFooter((p) => ({ ...p, contact_bd_phone: e.target.value }))} placeholder="+8801624757838" className={inputCls} />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Footer</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Footer Email</label>
                  <input type="email" value={contactFooter.footer_email} onChange={(e) => setContactFooter((p) => ({ ...p, footer_email: e.target.value }))} placeholder="imfbd@gmail.com" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Footer Phone</label>
                  <input type="tel" value={contactFooter.footer_phone} onChange={(e) => setContactFooter((p) => ({ ...p, footer_phone: e.target.value }))} placeholder="+971526114454" className={inputCls} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">Social media links (full URL)</p>
              <div className="space-y-3">
                {([["Facebook", "facebook_url"], ["Twitter / X", "twitter_url"], ["Instagram", "instagram_url"], ["LinkedIn", "linkedin_url"]] as const).map(([label, key]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type="url" value={(contactFooter as Record<string, string>)[key]} onChange={(e) => setContactFooter((p) => ({ ...p, [key]: e.target.value }))} placeholder={`https://${key.replace("_url", "")}.com/...`} className={inputCls} />
                  </div>
                ))}
              </div>
            </div>
            <SaveRow saving={updateLoading} saved={contactFooterSaved} />
          </form>
        </div>
      )}

      {/* ── Deposit Rules ─────────────────────────────────────── */}
      {tab === "deposit" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-800">Deposit Rules & Automation</h2>
          <form onSubmit={saveDep} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {([["Min. Monthly Deposit (BDT)", "minMonthly"], ["Min. Yearly Deposit (BDT)", "minYearly"], ["Late Payment Penalty (BDT)", "latePenalty"], ["Reminder Days Before Due", "reminderDays"]] as const).map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input type="number" min={0} value={(dep as Record<string, string>)[key]} onChange={(e) => setDep((p) => ({ ...p, [key]: e.target.value }))} className={inputCls} />
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-gray-100 px-4 divide-y divide-gray-50">
              <Toggle label="Late payment reminders" description="Notify members before the due date" checked={depToggles.lateReminders} onChange={(v) => setDepToggles((p) => ({ ...p, lateReminders: v }))} />
              <Toggle label="Email receipts" description="Send deposit receipt to member's email" checked={depToggles.emailReceipts} onChange={(v) => setDepToggles((p) => ({ ...p, emailReceipts: v }))} />
              <Toggle label="Allow online deposit submission" checked={depToggles.onlineDeposit} onChange={(v) => setDepToggles((p) => ({ ...p, onlineDeposit: v }))} />
              <Toggle label="Auto-generate receipt number" checked={depToggles.autoReceipt} onChange={(v) => setDepToggles((p) => ({ ...p, autoReceipt: v }))} />
            </div>
            <SaveRow saving={depSaving} saved={depSaved} />
          </form>
        </div>
      )}

      {/* ── Security (Admin account) ───────────────────────────── */}
      {tab === "security" && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-1">Admin Account</h2>
            <p className="text-sm text-gray-500 mb-5">Change your login email and password. Use the new email next time you sign in.</p>
            <form onSubmit={saveSec} className="space-y-4">
              {secError && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{secError}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Login email (username)</label>
                <input type="email" value={sec.email} onChange={(e) => setSec((p) => ({ ...p, email: e.target.value }))} placeholder="admin@example.com" className={inputCls} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                  <input type="password" value={sec.newPass} onChange={(e) => setSec((p) => ({ ...p, newPass: e.target.value }))} placeholder="Leave blank to keep current" className={inputCls} minLength={8} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
                  <input type="password" value={sec.confirm} onChange={(e) => setSec((p) => ({ ...p, confirm: e.target.value }))} placeholder="Re-enter if changing" className={inputCls} />
                </div>
              </div>
              <SaveRow saving={secSaving} saved={secSaved} />
            </form>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-1">Security Options</h2>
            <div className="rounded-xl border border-gray-100 px-4 divide-y divide-gray-50 mt-4">
              <Toggle label="Two-factor authentication" description="Require OTP on login" checked={secToggles.twoFactor} onChange={(v) => setSecToggles((p) => ({ ...p, twoFactor: v }))} />
              <Toggle label="Auto session timeout" description="Log out after 30 minutes of inactivity" checked={secToggles.sessionTimeout} onChange={(v) => setSecToggles((p) => ({ ...p, sessionTimeout: v }))} />
              <Toggle label="Login alerts" description="Email alert on new device login" checked={secToggles.loginAlerts} onChange={(v) => setSecToggles((p) => ({ ...p, loginAlerts: v }))} />
            </div>
          </div>
        </div>
      )}

      {/* ── Appearance ────────────────────────────────────────── */}
      {tab === "appearance" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5">Appearance & Locale</h2>
          <form onSubmit={saveAppear} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={appear.primaryColor} onChange={(e) => setAppear((p) => ({ ...p, primaryColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" />
                  <input value={appear.primaryColor} onChange={(e) => setAppear((p) => ({ ...p, primaryColor: e.target.value }))} className={`${inputCls} flex-1`} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                <select value={appear.currency} onChange={(e) => setAppear((p) => ({ ...p, currency: e.target.value }))} className={inputCls}>
                  <option>BDT</option><option>USD</option><option>EUR</option><option>GBP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date Format</label>
                <select value={appear.dateFormat} onChange={(e) => setAppear((p) => ({ ...p, dateFormat: e.target.value }))} className={inputCls}>
                  <option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Language</label>
                <select value={appear.language} onChange={(e) => setAppear((p) => ({ ...p, language: e.target.value }))} className={inputCls}>
                  <option value="en">English</option><option value="bn">বাংলা (Bengali)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Slider Interval (seconds)</label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={appear.heroSliderInterval}
                  onChange={(e) => setAppear((p) => ({ ...p, heroSliderInterval: e.target.value }))}
                  placeholder="Optional, e.g. 5"
                  className={inputCls}
                />
                <p className="mt-1 text-xs text-gray-500">Leave empty to use the default interval.</p>
              </div>
            </div>
            <SaveRow saving={appearSaving} saved={appearSaved} />
          </form>
        </div>
      )}
    </div>
  );
}
