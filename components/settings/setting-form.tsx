"use client";
import React, { useState } from "react";

type ChartStyle = "default" | "simplified" | "custom";
type CookieBanner = "default" | "simplified" | "none";
type Language = "en" | "es";

const chartOptions = [
  { value: "default", label: "Default", description: "Default company branding." },
  { value: "simplified", label: "Simplified", description: "Minimal and modern." },
  { value: "custom", label: "Custom CSS", description: "Manage styling with CSS." },
];

const cookieOptions = [
  { value: "default", label: "Default", description: "Cookie controls for visitors." },
  { value: "simplified", label: "Simplified", description: "Show a simplified banner." },
  { value: "none", label: "None", description: "Don't show any banners." },
];

const languageOptions = [
  { value: "en", label: "English (UK)" },
  { value: "es", label: "Español" },
];

export default function SettingForm() {
  const [brandColor, setBrandColor] = useState("#444CE7");
  const [chartStyle, setChartStyle] = useState<ChartStyle>("default");
  const [language, setLanguage] = useState<Language>("en");
  const [cookieBanner, setCookieBanner] = useState<CookieBanner>("default");

  const handleSubmit = (e: React.FormEvent) => {
	e.preventDefault();
	// Save logic here
	alert("Settings saved!");
  };

  return (
	<form onSubmit={handleSubmit} style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
	  <h2>Settings</h2>
	  <section>
		<h3>Appearance</h3>
		<label>
		  Brand color:
		  <input
			type="color"
			value={brandColor}
			onChange={e => setBrandColor(e.target.value)}
			style={{ marginLeft: 8 }}
		  />
		  <input
			type="text"
			value={brandColor}
			onChange={e => setBrandColor(e.target.value)}
			style={{ marginLeft: 8, width: 100 }}
		  />
		</label>
	  </section>
	  <section>
		<h3>Dashboard charts</h3>
		<div style={{ display: "flex", gap: 24 }}>
		  {chartOptions.map(opt => (
			<label key={opt.value} style={{ border: chartStyle === opt.value ? "2px solid #444CE7" : "1px solid #ccc", padding: 12, borderRadius: 8 }}>
			  <input
				type="radio"
				name="chartStyle"
				value={opt.value}
				checked={chartStyle === opt.value}
				onChange={() => setChartStyle(opt.value as ChartStyle)}
				style={{ marginRight: 8 }}
			  />
			  <strong>{opt.label}</strong>
			  <div style={{ fontSize: 12 }}>{opt.description}</div>
			</label>
		  ))}
		</div>
	  </section>
	  <section>
		<h3>Language</h3>
		<select value={language} onChange={e => setLanguage(e.target.value as Language)}>
		  {languageOptions.map(opt => (
			<option key={opt.value} value={opt.value}>{opt.label}</option>
		  ))}
		</select>
	  </section>
	  <section>
		<h3>Cookie banner</h3>
		<div style={{ display: "flex", gap: 24 }}>
		  {cookieOptions.map(opt => (
			<label key={opt.value} style={{ border: cookieBanner === opt.value ? "2px solid #444CE7" : "1px solid #ccc", padding: 12, borderRadius: 8 }}>
			  <input
				type="radio"
				name="cookieBanner"
				value={opt.value}
				checked={cookieBanner === opt.value}
				onChange={() => setCookieBanner(opt.value as CookieBanner)}
				style={{ marginRight: 8 }}
			  />
			  <strong>{opt.label}</strong>
			  <div style={{ fontSize: 12 }}>{opt.description}</div>
			</label>
		  ))}
		</div>
	  </section>
	  <div style={{ marginTop: 24 }}>
		<button type="submit" style={{ background: "#444CE7", color: "#fff", padding: "8px 24px", border: "none", borderRadius: 4 }}>
		  Save changes
		</button>
		<button type="button" style={{ marginLeft: 12, padding: "8px 24px", border: "1px solid #ccc", borderRadius: 4 }}>
		  Cancel
		</button>
	  </div>
	</form>
  );
}
