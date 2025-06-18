'use client';

import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Cable, Users, BadgeDollarSign, LineChart as LineChartIcon, Banknote, BarChart3 } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart as LineChartRecharts, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import LoginButton from "@/components/LoginButton";
import HotTableWrapper from "@/components/ui/HotTable";
import ExcelAgGrid from "@/components/ui/ExcelAgGrid";

// Use a modern, geometric sans font (e.g., 'Geist', 'Montserrat', 'Inter')
// Add font import in layout.tsx or _app.tsx for production

// Visually appealing department tab configuration
const DEPARTMENTS = [
  { key: "master", label: "Master", icon: BarChart3 },
  { key: "wireline", label: "Wireline", icon: Cable },
  { key: "wireless", label: "Wireless", icon: Wifi },
  { key: "hr_admin", label: "HR & Admin", icon: Users },
  { key: "sales", label: "Sales", icon: BadgeDollarSign },
  { key: "strategy_bis", label: "Strategy", icon: LineChartIcon },
  { key: "financials", label: "Finance", icon: Banknote },
];

const DASHBOARDS: Record<string, string[]> = {
  master: [
    "ITD - All LOBs",
    "KPI Trending",
    "IRR Trending"
  ],
  wireless: [
    "Acquisition",
    "Build",
    "Operations", 
	"Quality"
  ],
  wireline: [
    "ITD - LOB level",
    "Funnel & Buyer Types "
  ],
  hr_admin: [
    "Attrition",
    "Manpower Utilization"
  ],
  sales: [
    "New Customers & Initiatives",
    "Funnel Availability",
    "Customer NPS",
    "Market Share"
  ], 
  strategy_bis: [
    "ITD - LOB level",
    "Funnel & Buyer Types "
  ],
  financials: [
    "Annual Recurring Revenue"
  ]
  // Add other departments and their dashboards here
};

// Chart modal component with chart type selection and no bar highlight
function ChartModal({ open, onClose, data, title, chartTypes = ['Bar', 'Line', 'Pie'] }: { open: boolean, onClose: () => void, data: any[], title: string, chartTypes?: string[] }) {
	const [chartType, setChartType] = useState<string>(chartTypes[0]);
	if (!open) return null;
	const COLORS = ['#00B8D9', '#36CFC9', '#5B8FF9', '#FFB940', '#F7664E', '#6DC8EC', '#FF85A1'];
	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-[#10192b] p-6 rounded-xl shadow-xl w-full max-w-lg relative">
				<button onClick={onClose} className="absolute top-4 right-4 text-white text-lg font-bold">×</button>
				<h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
				<div className="mb-4 flex items-center gap-3">
					<label className="text-white/80 font-medium">Chart Type:</label>
					<select
						className="bg-[#14244a] text-white px-3 py-2 rounded-lg border border-[#00B8D9]/30 focus:outline-none font-sans text-base"
						value={chartType}
						onChange={e => setChartType(e.target.value)}
					>
						{chartTypes.map(type => (
							<option key={type} value={type}>{type}</option>
						))}
					</select>
				</div>
				{chartType === 'Bar' && (
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={data}>
							<XAxis dataKey="client" stroke="#e6e6e6" tick={{ fill: '#e6e6e6', fontSize: 14 }} />
							<YAxis stroke="#e6e6e6" tick={{ fill: '#e6e6e6', fontSize: 14 }} />
							<Tooltip contentStyle={{ background: '#14244a', border: '1px solid #00B8D9', color: '#fff' }} cursor={{ fill: 'rgba(0,184,217,0.08)' }} />
							<Bar dataKey="volume" fill="#00B8D9" radius={[6, 6, 0, 0]} activeBar={{ fill: '#00B8D9' }} />
						</BarChart>
					</ResponsiveContainer>
				)}
				{chartType === 'Line' && (
					<ResponsiveContainer width="100%" height={300}>
						<LineChartRecharts data={data}>
							<XAxis dataKey="client" stroke="#e6e6e6" tick={{ fill: '#e6e6e6', fontSize: 14 }} />
							<YAxis stroke="#e6e6e6" tick={{ fill: '#e6e6e6', fontSize: 14 }} />
							<Tooltip contentStyle={{ background: '#14244a', border: '1px solid #00B8D9', color: '#fff' }} />
							<Line type="monotone" dataKey="volume" stroke="#00B8D9" strokeWidth={3} dot={{ r: 6, fill: '#00B8D9' }} />
						</LineChartRecharts>
					</ResponsiveContainer>
				)}
				{chartType === 'Pie' && (
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={data}
								dataKey="volume"
								nameKey="client"
								cx="50%"
								cy="50%"
								outerRadius={90}
								fill="#00B8D9"
								labelLine={false}
								label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
									if (percent < 0.05) return null;
									const RADIAN = Math.PI / 180;
									const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
									const x = cx + radius * Math.cos(-midAngle * RADIAN);
									const y = cy + radius * Math.sin(-midAngle * RADIAN);
									const pct = typeof percent === 'number' && !isNaN(percent) ? (percent * 100).toFixed(0) : '0';
									return (
										<text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12}>
											{`${pct}%`}
										</text>
									);
								}}
							>
								{data.map((entry, idx) => (
									<Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
								))}
							</Pie>
							<Legend />
							<Tooltip 
								contentStyle={{ background: '#14244a', border: '1px solid #00B8D9', color: '#fff' }}
								itemStyle={{ color: '#fff' }}
								labelStyle={{ color: '#fff' }}
							/>
						</PieChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	);
}

const EMBED_LINKS: Record<string, Record<string, { url: string; width: string; height: string }>> = {
  wireless: {
    Acquisition: {
      url: "https://netorg1056155-my.sharepoint.com/personal/p_bala_cloudextel_com/_layouts/15/Doc.aspx?sourcedoc={7a449b40-f1dd-45ec-96cc-fe022cfd231e}&action=embedview&AllowTyping=True&ActiveCell='Acquisition'!A3&Item='Acquisition'!A3%3AP22&wdHideGridlines=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True",
      width: "1055px",
      height: "400"
    },
    Build: {
      url: "https://netorg1056155-my.sharepoint.com/personal/p_bala_cloudextel_com/_layouts/15/Doc.aspx?sourcedoc={7a449b40-f1dd-45ec-96cc-fe022cfd231e}&action=embedview&AllowTyping=True&Item='Build'!A3%3AS23&wdHideGridlines=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True",
      width: "715px",
      height: "430"
    },
	Operations: {
		url: "https://netorg1056155-my.sharepoint.com/personal/p_bala_cloudextel_com/_layouts/15/Doc.aspx?sourcedoc={7a449b40-f1dd-45ec-96cc-fe022cfd231e}&action=embedview&AllowTyping=True&Item='Operations'!A3%3AM22&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True",
		width: "850px",
		height: "445"
	  },
    // Add more dashboards here as needed
  },
  // Add more departments here
};

// Helper function to generate HTML with all wireless dashboard iframes
function generateWirelessDashboardsHTML(EMBED_LINKS: any) {
  const dashboards = EMBED_LINKS.wireless;
  let html = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Wireless Dashboards</title>`;
  html += `<link href='https://fonts.googleapis.com/css2?family=Geist:wght@600;700&display=swap' rel='stylesheet'>`;
  html += `<style>
    html, body { height: 100%; margin: 0; padding: 0; }
    body { background: #0a1833; color: #fff; font-family: 'Geist', 'Montserrat', 'Inter', Arial, sans-serif; font-weight: 600; letter-spacing: -0.015em; margin: 0; padding: 0; min-height: 100vh; }
    h1 { text-align: center; margin-top: 40px; margin-bottom: 48px; font-size: 2.7rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; text-shadow: 0 2px 16px #0004; }
    h2 { color: #00B8D9; text-align: center; font-family: 'Geist', 'Montserrat', 'Inter', Arial, sans-serif; font-size: 1.45rem; font-weight: 600; margin-bottom: 18px; margin-top: 48px; letter-spacing: -0.01em; text-shadow: 0 1px 8px #0002; }
    .dashboard-iframe-container { display: flex; flex-direction: column; align-items: center; width: 100%; margin: 0 auto; margin-top: 0; }
    .dashboard-iframe-box { overflow: hidden; margin-bottom: -20px; background: #fff; border-radius: 16px; box-shadow: 0 8px 32px #0003, 0 1.5px 8px #00B8D933; padding: 24px 0 32px 0; width: fit-content; min-width: 320px; }
    iframe { display: block; margin: 0 auto 0 auto; border-radius: 8px; box-shadow: 0 8px 32px #0002; border: none; background: #fff; width: 100%; min-width: 300px; max-width: 100vw; }
    @media (max-width: 1200px) {
      .dashboard-iframe-box { padding: 8px 0 16px 0; }
      iframe { min-width: 0; width: 98vw; }
    }
    @media (max-width: 700px) {
      h1 { font-size: 2rem; }
      h2 { font-size: 1.1rem; }
      .dashboard-iframe-box { border-radius: 8px; padding: 2px 0 8px 0; }
    }
  </style>`;
  html += `</head><body>`;
  html += `<h1>Wireless Dashboards</h1>`;
  for (const [name, info] of Object.entries(dashboards) as [string, { url: string; width: string; height: string }][]) {
    html += `<div class='dashboard-iframe-container'>`;
    html += `<h2>${name}</h2>`;
    html += `<div class='dashboard-iframe-box' style='width:${info.width};'>`;
    // Use only the exact URL from EMBED_LINKS for each dashboard, no extra sheet navigation
    html += `<iframe src='${info.url}' width='${info.width}' height='${info.height}' frameborder='0' scrolling='no' style='border:none;overflow:hidden;width:${info.width};height:${info.height};border-radius:0px;box-shadow:0 48px 48px rgba(175,47,47,0.08)' allowfullscreen></iframe>`;
    html += `</div></div>`;
  }
  html += `</body></html>`;
  return html;
}

// Helper function to generate a hidden HTML section with all wireless dashboard iframes (using original links)
function WirelessDashboardsReportSection({ EMBED_LINKS }: { EMBED_LINKS: any }) {
  const dashboards = EMBED_LINKS.wireless;
  return (
    <div id="wireless-dashboards-report" style={{ display: 'none' }}>
      <h1 style={{ textAlign: 'center', color: '#0a1833', fontFamily: 'Geist, sans-serif' }}>Wireless Dashboards</h1>
      {Object.entries(dashboards).map(([name, info]) => {
        const dashboard = info as { url: string; width: string; height: string };
        return (
          <div key={name} style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#00B8D9', textAlign: 'center', fontFamily: 'Geist, sans-serif' }}>{name}</h2>
            <iframe
              src={dashboard.url}
              width={dashboard.width}
              height={dashboard.height}
              frameBorder="0"
              style={{ display: 'block', margin: '0 auto', borderRadius: 8, boxShadow: '0 8px 32px #0002', border: 'none' }}
              allowFullScreen
            />
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
	const [files, setFiles] = useState<{ [key: string]: string[] }>({});
	const [selected, setSelected] = useState<{
		dept: string;
		file: string | null;
	}>({ dept: DEPARTMENTS[0].key, file: null });
	const [excelData, setExcelData] = useState<{
			tabs?: string[];
			sheets?: {
				[sheetName: string]: {
					headers: string[];
					rows: any[][];
					col_types: string[];
				};
			};
			filename?: string;
			department?: string;
			specific_value?: {
				title: string;
				value: string;
			};
			total_active_shared?: {
				title: string;
				value: string;
			};
			total_ftth_home_pass?: {
				title: string;
				value: string;
			};
			sdu_fresh_handover_otdr?: {
				title: string;
				value: string;
			};
			ohfc_fresh_handover_otdr?: {
				title: string;
				value: string;
			};
			total_handover?: {
				title: string;
				value: string;
			};
			small_cells?: { [client: string]: string }; // changed from string to object for consistency
			active_shared?: { [client: string]: string }; // changed from string to object for consistency
			ftth_home_pass?: { [client: string]: string }; // changed from string to object for consistency
		} | null>(null);
	const [loading, setLoading] = useState(false);
	const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
	const [specificValue, setSpecificValue] = useState<{ title: string; value: string } | null>(null); // State for specific value
	const [selectedTab, setSelectedTab] = useState<string | null>(null); // State for selected tab
	const [hoveredTab, setHoveredTab] = useState<string | null>(null);
	const [selectedMasterSheet, setSelectedMasterSheet] = useState<string>('Small Cells');
	const [showChart, setShowChart] = useState(false);
	const [showKPIChart, setShowKPIChart] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const tableauDivRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		// Check login status by calling backend (cookie/session-based auth)
		async function checkAuth() {
			try {
				const res = await fetch('http://localhost:8000/me', { credentials: 'include' });
				if (res.ok) {
					const data = await res.json();
					setIsLoggedIn(true);
					setUser(data);
				} else {
					setIsLoggedIn(false);
					setUser(null);
				}
			} catch {
				setIsLoggedIn(false);
				setUser(null);
			}
		}
		checkAuth();
	}, []);

	useEffect(() => {
		// Fetch files for all departments for their selected year and month
		Promise.all(
			DEPARTMENTS.map((d) => {
				// Use the selected year and month for each department
				const year = new Date().getFullYear().toString(); // TODO: Replace with year picker if needed
				const month = new Date().getMonth() + 1;
				return fetch(`http://localhost:8000/files/${d.key}/${year}/${month}/`, { credentials: 'include' }).then((r) => r.json());
			})
		).then((results) => {
			const filesObj: { [key: string]: string[] } = {};
			DEPARTMENTS.forEach((d, i) => {
				filesObj[d.key] = results[i].files || [];
			});
			setFiles(filesObj);
		});
	}, []);

	useEffect(() => {
		if (selected.file) {
			setLoading(true);
			setExcelData({
				tabs: ["Net Volume Dashboard", "Weekly Volume Dashboard"],
			});
			setSelectedTab("Net Volume Dashboard");
			setLoading(false);
		} else {
			setExcelData(null);
			setSelectedSheet(null);
			setSpecificValue(null);
			setSelectedTab(null);
		}
	}, [selected.file]);

	useEffect(() => {
		if (selectedTab && selected.dept === 'master') {
			// Do nothing for master, do not fetch /parse
			setExcelData({}); // Optionally clear or set to empty object
		} else if (selectedTab && ['wireless'].includes(selected.dept)) {
			// Do nothing for wireless, do not fetch /parse
			setExcelData({}); // Optionally clear or set to empty object
		} else if (selectedTab === "Net Volume Dashboard" && selected.file) {
			fetch(`http://localhost:8000/parse/${selected.dept}/${selected.file}`, { credentials: 'include' })
				.then((r) => r.json())
				.then((data) => {
					setExcelData((prev) => ({
						...prev,
						specific_value: data.specific_value,
						total_active_shared: data.total_active_shared,
						total_ftth_home_pass: data.total_ftth_home_pass,
						sdu_fresh_handover_otdr: data.sdu_fresh_handover_otdr,
						ohfc_fresh_handover_otdr: data.ohfc_fresh_handover_otdr,
						total_handover: data.total_handover,
						small_cells: data.small_cells,
					}));
				});
		}
	}, [selectedTab, selected.file, selected.dept]);

	useEffect(() => {
		if (selectedSheet === "Active Shared") {
			console.log("Using already parsed active_shared from /parse");
			// No new fetch needed — already exists in excelData.active_shared
		}
	}, [selectedSheet]);


	// Add debug logs before rendering the DataTable for the selected dashboard
	console.log('[DEBUG] excelData:', excelData);
	console.log('[DEBUG] selectedTab:', selectedTab);
	if (typeof selectedTab === 'string' && selectedTab !== '') {
		console.log('[DEBUG] sheet:', excelData?.sheets?.[selectedTab]);
	}

	// Ensure selectedSheet is always valid when a dashboard/tab is selected
	useEffect(() => {
		if (selectedTab === 'Net Volume Dashboard' && !selectedSheet) {
			setSelectedSheet('Small Cells');
		}
	}, [selectedTab, selectedSheet]);

	// Always derive sheet from excelData.sheets and selectedTab
	const sheet = selectedTab && excelData && excelData.sheets ? (excelData.sheets[selectedTab] || null) : null;

	const handleDashboardSelect = (dept: string, dashboard: string) => {
		if (dept === 'wireless') {
			setSelected({ dept: 'wireless', file: 'Wireless Dashboards.xlsx' });
			setSelectedTab(dashboard);
			console.log('[HANDLE] Wireless: file set to Wireless Dashboards.xlsx, tab set to', dashboard);
		} else {
			setSelected({ dept, file: null });
			setSelectedTab(dashboard);
			console.log(`[HANDLE] Dept: ${dept}, file set to null, tab set to ${dashboard}`);
		}
	};

	// Improved HTML generator for wireless dashboards (uses the exact same iframe code as the web app)
	function generateWirelessDashboardsHTML(EMBED_LINKS: any) {
	  const dashboards = EMBED_LINKS.wireless;
	  let html = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Wireless Dashboards</title>`;
	  html += `<link href='https://fonts.googleapis.com/css2?family=Geist:wght@600;700&display=swap' rel='stylesheet'>`;
	  html += `<style>
	    html, body { height: 100%; margin: 0; padding: 0; }
	    body { background: #0a1833; color: #fff; font-family: 'Geist', 'Montserrat', 'Inter', Arial, sans-serif; font-weight: 600; letter-spacing: -0.015em; margin: 0; padding: 0; min-height: 100vh; }
	    h1 { text-align: center; margin-top: 40px; margin-bottom: 48px; font-size: 2.7rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; text-shadow: 0 2px 16px #0004; }
	    h2 { color: #00B8D9; text-align: center; font-family: 'Geist', 'Montserrat', 'Inter', Arial, sans-serif; font-size: 1.45rem; font-weight: 600; margin-bottom: 18px; margin-top: 48px; letter-spacing: -0.01em; text-shadow: 0 1px 8px #0002; }
	    .dashboard-iframe-container { display: flex; flex-direction: column; align-items: center; width: 100%; margin: 0 auto; margin-top: 0; }
	    .dashboard-iframe-box { overflow: hidden; margin-bottom: -20px; background: #fff; border-radius: 16px; box-shadow: 0 8px 32px #0003, 0 1.5px 8px #00B8D933; padding: 24px 0 32px 0; width: fit-content; min-width: 320px; }
	    iframe { display: block; margin: 0 auto 0 auto; border-radius: 8px; box-shadow: 0 8px 32px #0002; border: none; background: #fff; width: 100%; min-width: 300px; max-width: 100vw; }
	    @media (max-width: 1200px) {
	      .dashboard-iframe-box { padding: 8px 0 16px 0; }
	      iframe { min-width: 0; width: 98vw; }
	    }
	    @media (max-width: 700px) {
	      h1 { font-size: 2rem; }
	      h2 { font-size: 1.1rem; }
	      .dashboard-iframe-box { border-radius: 8px; padding: 2px 0 8px 0; }
	    }
	  </style>`;
	  html += `</head><body>`;
	  html += `<h1>Wireless Dashboards</h1>`;
	  for (const [name, info] of Object.entries(dashboards) as [string, { url: string; width: string; height: string }][]) {
	    html += `<div class='dashboard-iframe-container'>`;
	    html += `<h2>${name}</h2>`;
	    html += `<div class='dashboard-iframe-box' style='width:${info.width};'>`;
	    // Use only the exact URL from EMBED_LINKS for each dashboard, no extra sheet navigation
	    html += `<iframe src='${info.url}' width='${info.width}' height='${info.height}' frameborder='0' scrolling='no' style='border:none;overflow:hidden;width:${info.width};height:${info.height};border-radius:0px;box-shadow:0 48px 48px rgba(175,47,47,0.08)' allowfullscreen></iframe>`;
	    html += `</div></div>`;
	  }
	  html += `</body></html>`;
	  return html;
	}

	// Tableau embed effect for Acquisition dashboard (wireless)
	useEffect(() => {
		if (selected.dept === 'wireless' && selectedTab === 'Acquisition' && tableauDivRef.current) {
			tableauDivRef.current.innerHTML = '';
			tableauDivRef.current.innerHTML = `
				<div class='tableauPlaceholder' id='viz1749540475429' style='position: relative; max-width: 100%;'>
				  <noscript><a href='#'><img alt='Dashboard 1 (2) ' src='https://public.tableau.com/static/images/Ac/AcquisitionSheets/Dashboard12/1_rss.png' style='border: none' /></a></noscript>
				  <object class='tableauViz' style='display:none;'>
					<param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
					<param name='embed_code_version' value='3' />
					<param name='site_root' value='' />
					<param name='name' value='AcquisitionSheets/Dashboard12' />
					<param name='tabs' value='no' />
					<param name='toolbar' value='yes' />
					<param name='static_image' value='https://public.tableau.com/static/images/Ac/AcquisitionSheets/Dashboard12/1.png' />
					<param name='animate_transition' value='yes' />
					<param name='display_static_image' value='yes' />
					<param name='display_spinner' value='yes' />
					<param name='display_overlay' value='yes' />
					<param name='display_count' value='yes' />
					<param name='language' value='en-GB' />
					<param name='filter' value='publish=yes' />
				  </object>
				</div>
			`;
			// Responsive script
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.innerHTML = `
				var divElement = document.getElementById('viz1749540475429');
				var vizElement = divElement.getElementsByTagName('object')[0];
				if ( divElement.offsetWidth > 800 ) { vizElement.style.width='100%';vizElement.style.height=(divElement.offsetWidth*0.75)+'px';} else if ( divElement.offsetWidth > 500 ) { vizElement.style.width='100%';vizElement.style.height=(divElement.offsetWidth*0.75)+'px';} else { vizElement.style.width='100%';vizElement.style.height='1027px';}
				var scriptElement = document.createElement('script');
				scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
				vizElement.parentNode.insertBefore(scriptElement, vizElement);
			`;
			tableauDivRef.current.appendChild(script);
			return () => {
				if (tableauDivRef.current) tableauDivRef.current.innerHTML = '';
			};
		}
		return () => {
			if (tableauDivRef.current) tableauDivRef.current.innerHTML = '';
		};
	}, [selected.dept, selectedTab]);

	return (   <div className="min-h-screen bg-[#0a1833] text-white font-sans flex flex-col" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 600, letterSpacing: '-0.015em' }}>
		<div className="flex justify-end p-4">
		  <LoginButton />
		</div>
		{/* Download HTML button for all logged-in users */}
		
		<header className="flex flex-row items-center justify-between px-8 py-6 border-b border-white/10 bg-[#0a1833] w-full">
		  <div className="flex items-center gap-4 min-w-0">
			<Image
			  src="/cloudextel-logo.png"
			  alt="Cloudextel Logo"
			  width={0}
			  height={0}
			  sizes="100vw"
			  style={{ height: '3rem', width: 'auto', minWidth: '3rem', maxHeight: '3rem' }}
			  priority
			/>
			<span className="ml-3 text-xl md:text-2xl font-bold tracking-tight text-white select-none" style={{fontFamily: 'Geist', lineHeight: '1.1', letterSpacing: '-0.02em'}}>
			  Insights Reporting Hub
			</span>
		  </div>
		  <div className="flex items-center gap-2">
			<Tabs
			  defaultValue={DEPARTMENTS[0].key}
			  value={selected.dept}
			  onValueChange={(v: string) => {
				setSelected({ dept: v, file: null });
				setSelectedTab(null); // Reset dashboard selection on department change
			  }}
			>
			  <TabsList className="bg-[#10192b] flex justify-center gap-1 rounded-xl shadow-md p-1 border border-[#00B8D9]/30 backdrop-blur-md max-w-5xl min-w-[200px] h-auto mx-auto overflow-x-auto overflow-y-hidden scrollbar-hide whitespace-nowrap">
				{DEPARTMENTS.map((d) => {
				  const isActive = selected.dept === d.key;
				  const isHovered = hoveredTab === d.key;
				  const Icon = d.icon;
				  return (
					<motion.button
					  key={d.key}
					  onMouseEnter={() => setHoveredTab(d.key)}
					  onMouseLeave={() => setHoveredTab(null)}
					  whileHover={{ scale: 1.04 }}
					  whileTap={{ scale: 0.96 }}
					  transition={{ type: "spring", stiffness: 300, damping: 20 }}
					  className={`relative flex flex-col items-center gap-1 px-4 py-2 text-base font-semibold rounded-md transition-colors ${isActive ? "text-white" : "text-white/80 hover:text-white"}`}
					  style={{
						minWidth: '90px',
						maxWidth: '150px',
						height: '44px',
						whiteSpace: 'normal',
						wordBreak: 'break-word',
						textAlign: 'center',
						overflow: 'visible',
					  }}
					  onClick={() => setSelected({ dept: d.key, file: null })}
					  aria-label={d.label}
					>
					  <Icon
						className={isActive || isHovered ? 'text-white' : 'text-[#00B8D9]'}
						style={{
						  width: '15px',
						  height: '15px',
						  minWidth: '15px',
						  minHeight: '15px',
						  flexShrink: 0,
						  transition: 'color 0.2s ease-in-out'
						}}
					  />
					  <span
						className="text-center w-full break-words leading-snug"
						style={{
						  color: isActive || isHovered ? '#fff' : '#00B8D9',
						  fontSize: '0.85rem',
						  lineHeight: '1.1rem',
						  fontWeight: 600,
						  overflow: 'visible',
						  paddingBottom: '1px',
						  display: 'inline-block'
						}}
					  >
						{d.label}
					  </span>
					  {isActive && (
						<motion.span
						  layoutId="tab-underline"
						  className="absolute left-2 right-2 -bottom-1 h-[3px] rounded bg-white"
						  initial={{ opacity: 0, scaleX: 0.5 }}
						  animate={{ opacity: 1, scaleX: 1 }}
						  exit={{ opacity: 0, scaleX: 0.5 }}
						  transition={{ duration: 0.2 }}
						/>
					  )}
					</motion.button>
				  );
				})}
			  </TabsList>
			</Tabs>
		  </div>
		</header>
		{selected.dept && DASHBOARDS[selected.dept] && (
		  <div className="w-full flex justify-center mt-6 mb-4 px-2">
			<div className="flex flex-row items-center w-full max-w-4xl bg-[#10192b] rounded-2xl shadow-lg border border-[#00B8D9]/20 py-4 px-6 gap-6">
			  <div className="flex items-center gap-2 min-w-fit">
				<LineChartIcon className="text-[#00B8D9] w-6 h-6" />
				<span className="text-white/90 font-semibold text-lg tracking-tight">Available Dashboards</span>
			  </div>
			  <div className="h-8 border-l border-[#00B8D9]/30 mx-4" />
			  <div className="flex-1 flex items-center">
				<Select.Root
				  value={selectedTab || ''}
				  onValueChange={(tab) => {
					if (selected.dept === 'wireless') {
					  setSelected({ dept: 'wireless', file: 'Wireless Dashboards.xlsx' });
					}
					setSelectedTab(tab);
				  }}
				>
				  <Select.Trigger
					className="w-full max-w-xs min-w-[180px] px-4 py-3 rounded-lg bg-[#14244a] text-white font-semibold text-base shadow-md border border-[#00B8D9]/30 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#00B8D9]/60 focus:ring-offset-2 focus:ring-offset-[#10192b] transition-all"
					aria-label="Dashboard"
				  >
					<Select.Value placeholder="Select dashboard..." />
					<Select.Icon>
					  <ChevronDownIcon className="w-5 h-5 text-[#00B8D9] transition-transform duration-200" />
					</Select.Icon>
				  </Select.Trigger>
				  <Select.Content
					className="z-50 bg-[#10192b] rounded-lg shadow-xl border border-[#00B8D9]/30 mt-2 w-full min-w-[180px] max-w-xs"
					position="popper"
					sideOffset={8}
				  >
					<Select.Viewport className="p-2">
					  {DASHBOARDS[selected.dept].map((dashboard: string) => (
						<Select.Item
						  key={dashboard}
						  value={dashboard}
						  className="px-4 py-2 rounded-md cursor-pointer text-[#e6e6e6] font-medium text-base hover:bg-[#00B8D9] hover:text-[#0a1833] data-[state=checked]:bg-[#00B8D9] data-[state=checked]:text-[#0a1833] focus:bg-[#00B8D9] focus:text-[#0a1833] transition-colors"
						>
						  <Select.ItemText>{dashboard}</Select.ItemText>
						</Select.Item>
					  ))}
					</Select.Viewport>
				  </Select.Content>
				</Select.Root>
			  </div>
			</div>
		  </div>
		)}
		<main className="flex-1 flex flex-col items-center py--2 px-2 bg-[#0a1833] w-full">
		  <Card className="w-full max-w-[98vw] bg-[#10192b] border border-[#00B8D9]/20 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-[#00B8D9]/40">
			<CardContent className="p-4 sm:p-6 md:p-8">
			  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
				{isLoggedIn ? (
				  selectedTab && EMBED_LINKS[selected.dept]?.[selectedTab] ? (
					// Special case: wireless Acquisition dashboard (Tableau + Excel, no duplicates)
					selected.dept === 'wireless' && selectedTab === 'Acquisition' ? (
					  <>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', margin: '0 auto', marginTop: 0 }}>
						  <h2
							className="text-3xl md:text-4xl font-extrabold mb-6"
							style={{
							  textAlign: 'center',
							  color: '#1a2236',
							  background: 'none',
							  WebkitBackgroundClip: 'unset',
							  WebkitTextFillColor: 'unset',
							  backgroundClip: 'unset',
							  letterSpacing: '-0.02em',
							  fontFamily: 'Geist, Montserrat, Inter, sans-serif',
							  lineHeight: 0.8,
							  boxShadow: '0 2px 24px 0 rgba(0,184,217,0.08)',
							  borderRadius: '0.75rem',
							  padding: '0.5rem 2rem',
							  display: 'inline-block',
							  textShadow: '0 2px 8px rgba(0,0,0,0.04)',
							  marginBottom: '2rem',
							  marginTop: '0.5rem',
							  border: '1.5px solid #e6e6e6',
							  backgroundColor: '#f8fafc',
							  filter: 'none',
							  fontWeight: 700
							}}
						  >
							{selectedTab} Dashboard <span className="block text-lg md:text-xl font-semibold mt-2" style={{
							  color: '#3b4252',
							  background: 'none',
							  WebkitBackgroundClip: 'unset',
							  WebkitTextFillColor: 'unset',
							  backgroundClip: 'unset',
							  letterSpacing: '-0.01em',
							  fontWeight: 700,
							  textShadow: 'none',
							}}>(As of June 6, 2025)</span>
						  </h2>
						</div>
						{/* Tableau embed at the top, in its own container */}
						<div style={{ width: '100%', maxWidth: 1200, margin: '32px auto 0 auto', overflowX: 'auto' }}>
						  <div
							className="tableauPlaceholder"
							id="viz1749540475429"
							style={{ position: 'relative', maxWidth: '100%' }}
							ref={tableauDivRef}
						  >
							<noscript>
							  <a href="#"><img alt="Dashboard 1 (2) " src="https://public.tableau.com/static/images/Ac/AcquisitionSheets/Dashboard12/1_rss.png" style={{ border: 'none' }} /></a>
							</noscript>
						  </div>
						</div>
						{/* Excel iframe below, in its own container */}
						<div style={{ width: '100%', maxWidth: 1200, margin: '32px auto 0 auto', overflowX: 'auto' }}>
						  <div style={{ overflow: 'hidden', marginBottom: '-20px', marginTop: '0' }}>
							<iframe
							  src={EMBED_LINKS[selected.dept][selectedTab].url}
							  width={EMBED_LINKS[selected.dept][selectedTab].width}
							  height={EMBED_LINKS[selected.dept][selectedTab].height}
							  frameBorder="0"
							  scrolling="no"
							  style={{
								border: 'none',
								overflow: 'hidden',
								width: EMBED_LINKS[selected.dept][selectedTab].width,
								height: EMBED_LINKS[selected.dept][selectedTab].height,
								borderRadius: '0px',
								boxShadow: '0 48px 48px rgba(175, 47, 47, 0.08)'
							  }}
							  allowFullScreen
							/>
						  </div>
						</div>
					  </>
					) : (
					  // Generic dashboard rendering (all others)
					  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', margin: '0 auto', marginTop: 0 }}>
						<h2
						  className="text-3xl md:text-4xl font-extrabold mb-6"
						  style={{
							textAlign: 'center',
							color: '#1a2236',
							background: 'none',
							WebkitBackgroundClip: 'unset',
							WebkitTextFillColor: 'unset',
							backgroundClip: 'unset',
							letterSpacing: '-0.02em',
							fontFamily: 'Geist, Montserrat, Inter, sans-serif',
							lineHeight: 0.8,
							boxShadow: '0 2px 24px 0 rgba(0,184,217,0.08)',
							borderRadius: '0.75rem',
							padding: '0.5rem 2rem',
							display: 'inline-block',
							textShadow: '0 2px 8px rgba(0,0,0,0.04)',
							marginBottom: '2rem',
							marginTop: '0.5rem',
							border: '1.5px solid #e6e6e6',
							backgroundColor: '#f8fafc',
							filter: 'none',
							fontWeight: 700
						  }}
						>
						  {selectedTab} Dashboard <span className="block text-lg md:text-xl font-semibold mt-2" style={{
							color: '#3b4252',
							background: 'none',
							WebkitBackgroundClip: 'unset',
							WebkitTextFillColor: 'unset',
							backgroundClip: 'unset',
							letterSpacing: '-0.01em',
							fontWeight: 700,
							textShadow: 'none',
						  }}>(As of June 6, 2025)</span>
						</h2>
						<div style={{ width: '100%', maxWidth: 1200, margin: '32px auto 0 auto', overflowX: 'auto' }}>
						  <div style={{ overflow: 'hidden', marginBottom: '-20px', marginTop: '32px' }}>
							<iframe
							  src={EMBED_LINKS[selected.dept][selectedTab].url}
							  width={EMBED_LINKS[selected.dept][selectedTab].width}
							  height={EMBED_LINKS[selected.dept][selectedTab].height}
							  frameBorder="0"
							  scrolling="no"
							  style={{
								border: 'none',
								overflow: 'hidden',
								width: EMBED_LINKS[selected.dept][selectedTab].width,
								height: EMBED_LINKS[selected.dept][selectedTab].height,
								borderRadius: '0px',
								boxShadow: '0 48px 48px rgba(175, 47, 47, 0.08)'
							  }}
							  allowFullScreen
							/>
						  </div>
						</div>
					  </div>
					)
				  ) : selected.dept === 'master' && selectedTab === 'ITD - All LOBs' && excelData ? (
					<div className="flex flex-col md:flex-row gap-0 w-full max-w-5xl mx-auto items-stretch">
					  {/* ... Net Volume Insights and Client Breakdown ... */}
					</div>
				  ) : (
					<>
					  <div className="flex flex-wrap gap-3 justify-center mb-8">
						{files[selected.dept]?.map((file) => (
						  <motion.button
							key={file}
							whileHover={{ scale: 1.04, backgroundColor: '#00B8D9', color: '#0a1833' }}
							whileTap={{ scale: 0.98 }}
							transition={{ type: "spring", stiffness: 400, damping: 25 }}
							className={`px-5 py-2 rounded-lg font-medium border border-[#00B8D9]/30 transition-colors ${selected.file === file ? "bg-[#00B8D9] text-[#0a1833]" : "bg-[#14244a] text-white hover:bg-[#00B8D9]/80 hover:text-[#0a1833]"} text-base font-sans`}
							style={{ fontFamily: 'Geist, sans-serif', letterSpacing: '-0.01em' }}
							onClick={() => setSelected({ dept: selected.dept, file })}
							aria-label={file}
						  >
							{file}
						  </motion.button>
						))}
					  </div>
					  {selected.file && (
						<div className="flex justify-center gap-4 mt-4">
						  {excelData?.tabs?.map((tab) => (
							<button
							  key={tab}
							  className={`px-4 py-2 rounded-lg font-medium ${selectedTab === tab ? "bg-[#00B8D9] text-[#0a1833]" : "bg-[#14244a] text-white hover:bg-[#00B8D9]/80 hover:text-[#0a1833]"}`}
							  onClick={() => handleDashboardSelect(selected.dept, tab)}
							>
							  {tab}
							</button>
						  ))}
						</div>
					  )}
					</>
				  )
				) : (
				  <div className="flex flex-col items-center justify-center min-h-[300px]">
					<div className="text-2xl font-bold text-white mb-4">Please log in to view dashboards</div>
					<LoginButton />
				  </div>
				)}
			  </motion.div>
			</CardContent>
		  </Card>
		</main>
		{/* Hidden section for PDF export */}
		<WirelessDashboardsReportSection EMBED_LINKS={EMBED_LINKS} />
		<footer className="text-center text-white/40 py-6 text-base tracking-wide bg-[#0a1833] font-sans" style={{ fontFamily: 'Geist, sans-serif', letterSpacing: '-0.01em' }}>
		  &copy; {new Date().getFullYear()} Cloudextel. All rights reserved.
		</footer>
		{/* Download HTML button at the very bottom, above the footer */}
		{isLoggedIn && (
		  <div className="flex justify-center mt-6 mb-2">
			<button
			  className="px-6 py-3 rounded-xl bg-[#00B8D9] text-[#0a1833] font-bold text-lg shadow-lg hover:bg-[#00B8D9]/90 transition-colors border border-[#00B8D9]/40"
			  onClick={() => {
				const html = generateWirelessDashboardsHTML(EMBED_LINKS);
				const blob = new Blob([html], { type: 'text/html' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'WirelessDashboards.html';
				document.body.appendChild(a);
				a.click();
				setTimeout(() => {
				  document.body.removeChild(a);
				  URL.revokeObjectURL(url);
				}, 100);
			  }}
			>
			  Download All Wireless Dashboards (HTML)
			</button>
		  </div>
		)}
	  </div>
	);
	// End of Home component
	}