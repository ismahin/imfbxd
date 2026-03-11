"use client";

import { useState, useRef, useEffect } from "react";
import { useGetSettingsQuery, useUpdateLogoMutation } from "@/store/services/settingsApi";
import { toast } from "sonner";

function getLogoUrl(path: string | undefined): string {
	if (!path) return "";
	const base = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : "";
	if (!base) return path;
	return path.startsWith("http") ? path : `${base.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function LogoPage() {
	const { data: settings } = useGetSettingsQuery();
	const [updateLogo, { isLoading }] = useUpdateLogoMutation();

	const [primaryFile, setPrimaryFile] = useState<File | null>(null);
	const [faviconFile, setFaviconFile] = useState<File | null>(null);
	const [altText, setAltText] = useState("");
	const [showLogoText, setShowLogoText] = useState(true);
	const [logoText, setLogoText] = useState("");
	const [saved, setSaved] = useState(false);
	const [primaryPreviewUrl, setPrimaryPreviewUrl] = useState<string | null>(null);
	const [faviconPreviewUrl, setFaviconPreviewUrl] = useState<string | null>(null);

	const primaryRef = useRef<HTMLInputElement>(null);
	const faviconRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (settings) {
			setAltText(settings.logo_alt_text ?? "");
			setShowLogoText(settings.show_logo_text !== false);
			setLogoText(settings.logo_text ?? "");
		}
	}, [settings]);

	useEffect(() => {
		if (primaryFile) {
			const url = URL.createObjectURL(primaryFile);
			setPrimaryPreviewUrl(url);
			return () => URL.revokeObjectURL(url);
		}
		setPrimaryPreviewUrl(settings?.primary_logo ? getLogoUrl(settings.primary_logo) : null);
	}, [primaryFile, settings?.primary_logo]);
	useEffect(() => {
		if (faviconFile) {
			const url = URL.createObjectURL(faviconFile);
			setFaviconPreviewUrl(url);
			return () => URL.revokeObjectURL(url);
		}
		setFaviconPreviewUrl(settings?.favicon ? getLogoUrl(settings.favicon) : null);
	}, [faviconFile, settings?.favicon]);
	const primaryPreview = primaryPreviewUrl;
	const faviconPreview = faviconPreviewUrl;

	async function handleSave(e: React.FormEvent) {
		e.preventDefault();
		setSaved(false);
		try {
			await updateLogo({
				...(primaryFile && { primary_logo: primaryFile }),
				...(faviconFile && { favicon: faviconFile }),
				logo_alt_text: altText,
				show_logo_text: showLogoText,
				logo_text: logoText,
			}).unwrap();
			setPrimaryFile(null);
			setFaviconFile(null);
			setSaved(true);
			toast.success("Logo settings saved.");
			setTimeout(() => setSaved(false), 4000);
		} catch (err: unknown) {
			const msg = err && typeof err === "object" && "data" in err && (err as { data?: { detail?: string } }).data?.detail ? String((err as { data: { detail: string } }).data.detail) : "Failed to save logo.";
			toast.error(msg);
		}
	}

	const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400";

	function UploadZone({
		label,
		preview,
		onRef,
		onFile,
		hint,
	}: {
		label: string;
		preview: string | null;
		onRef: React.RefObject<HTMLInputElement | null>;
		onFile: (f: File) => void;
		hint: string;
	}) {
		return (
			<div>
				<p className="mb-2 text-sm font-medium text-gray-700">{label}</p>
				<div
					onClick={() => onRef.current?.click()}
					onDragOver={(e) => e.preventDefault()}
					onDrop={(e) => {
						e.preventDefault();
						const f = e.dataTransfer.files[0];
						if (f) onFile(f);
					}}
					className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 p-6 text-center transition-colors hover:border-green-300 hover:bg-green-50/30"
				>
					{preview ? (
						<div className="flex flex-col items-center gap-3">
							<img src={preview} alt="preview" className="max-h-20 max-w-full object-contain" />
							<p className="text-xs font-medium text-green-600">Click to replace</p>
						</div>
					) : (
						<>
							<svg className="mx-auto mb-2 h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<p className="text-sm text-gray-500">Click or drag & drop</p>
							<p className="mt-1 text-xs text-gray-400">{hint}</p>
						</>
					)}
					<input ref={onRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-2xl space-y-6">
			<form onSubmit={handleSave} className="space-y-6">
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 className="mb-5 text-base font-semibold text-gray-800">Logo Files</h2>
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						<UploadZone label="Primary Logo" preview={primaryPreview} onRef={primaryRef} onFile={setPrimaryFile} hint="PNG or SVG, recommended 200×60px" />
						<UploadZone label="Favicon / App Icon" preview={faviconPreview} onRef={faviconRef} onFile={setFaviconFile} hint="PNG or ICO, 32×32 or 64×64px" />
					</div>
				</div>

				<div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 className="text-base font-semibold text-gray-800">Logo Text & Alt</h2>
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700">Alt Text</label>
						<input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="e.g. IMF Foundation logo" className={inputCls} />
						<p className="mt-1 text-xs text-gray-400">Used for accessibility and SEO.</p>
					</div>
					<div className="flex items-center justify-between border-t border-gray-100 py-3">
						<div>
							<p className="text-sm font-medium text-gray-700">Show Logo Text</p>
							<p className="text-xs text-gray-400">Display text beside the logo image.</p>
						</div>
						<button type="button" onClick={() => setShowLogoText((p) => !p)} className={`relative h-6 w-11 rounded-full transition-colors ${showLogoText ? "bg-green-500" : "bg-gray-200"}`}>
							<span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${showLogoText ? "translate-x-6" : "translate-x-1"}`} />
						</button>
					</div>
					{showLogoText && (
						<div>
							<label className="mb-1.5 block text-sm font-medium text-gray-700">Logo Text</label>
							<input value={logoText} onChange={(e) => setLogoText(e.target.value)} placeholder="e.g. IMF Foundation" className={inputCls} />
						</div>
					)}
				</div>

				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-base font-semibold text-gray-800">Preview</h2>
					<div className="inline-flex rounded-xl border border-gray-100 bg-gray-50 p-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
								{primaryPreview ? (
									<img src={primaryPreview} alt="logo" className="h-full w-full object-contain" />
								) : (
									<span className="text-xs font-bold text-gray-500">Logo</span>
								)}
							</div>
							{showLogoText && <span className="text-sm font-semibold text-gray-700">{logoText || "IMF Foundation"}</span>}
						</div>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-600 disabled:opacity-60">
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
						{isLoading ? "Saving…" : "Save Logo Settings"}
					</button>
					{saved && <p className="text-sm font-medium text-green-600">✓ Settings saved!</p>}
				</div>
			</form>
		</div>
	);
}
