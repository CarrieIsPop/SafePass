/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Github, 
  Cpu, 
  Activity, 
  Terminal, 
  Info,
  Layers,
  Heart,
  ExternalLink,
  Airplay
} from "lucide-react";
import { PhoneSimulator } from "./components/PhoneSimulator";
import { LabDashboard } from "./components/LabDashboard";
import { classifyPassword } from "./mlEngine";
import PWAInstallBanner from "./components/PWAInstallBanner";

export default function App() {
  const [currentPassword, setCurrentPassword] = useState("S4feP@ss_2026!");

  // Compute local ML classification instantly (Privacy by Design - Client Side)
  const report = classifyPassword(currentPassword);

  return (
    <div id="safe-pass-root" className="min-h-screen bg-slate-950 text-slate-200 font-sans antialiased flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* 🔮 "Sleek Interface" Radial Glow Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* 🚀 Sleek Global Workspace Header */}
      <header id="app-header" className="relative z-10 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/80 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/10 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white tracking-tight">SafePass Lab</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/25">
                  Local AI Active
                </span>
              </div>
              <p className="text-xs text-slate-400">Demostrador de Ingeniería de Atributos y Clasificador Inteligente Edge AI</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inferencia de Seguridad</span>
              <span className="text-xs font-semibold text-slate-300">Modo Avión Criptográfico Cohesivo</span>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden md:block"></div>
            <a 
              href="https://github.com" 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-200 active:scale-95 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-xl shadow-slate-950/20"
            >
              <Github className="w-4 h-4" />
              <span>Proyecto de Seguridad</span>
            </a>
          </div>

        </div>
      </header>

      {/* 📊 Main Core Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Security Evaluator Panel (Lg: 5 columns for a balanced flat layout) */}
        <div className="lg:col-span-5 w-full">
          <div className="text-left mb-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 block pl-1">MÓDULO DE ENTRADA</span>
          </div>
          <PhoneSimulator 
            currentPassword={currentPassword}
            onChangePassword={setCurrentPassword}
            report={report}
          />
        </div>

        {/* Right column: Science and Feature ML Lab Dashboard (Lg: 7 columns) */}
        <div className="lg:col-span-7 w-full flex flex-col space-y-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 block mb-4 pl-1">TELEMETRÍA CIENTÍFICA</span>
          </div>
          <LabDashboard 
            currentPassword={currentPassword}
            onSelectPassword={setCurrentPassword}
            report={report}
          />
        </div>

      </main>

      {/* 🛡️ Explanatory banner about Privacy-by-design & Edge AI */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
        <div id="privacy-educational-info" className="glass rounded-[2.5rem] p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-8 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Cpu className="w-4 h-5 text-emerald-400" />
              <span>¿Cómo funciona SafePass localmente? (Privacy by Design)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium opacity-90">
              A diferencia de validadores que envían tus claves a servidores directos, SafePass extrae un <strong className="text-emerald-300">vector de atributos sintácticos</strong> (<span className="font-mono bg-slate-950/80 px-1.5 py-0.5 rounded text-indigo-300 text-[11px]">length, digitCount, specialCount, upperCount, lowerCount, entropy</span>) de manera 100% local. El motor de clasificación ejecuta un árbol de decisión asíncrono e instantáneo optimizado con latencia cero para máxima protección.
            </p>
          </div>
          <div className="md:col-span-4 grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-900/50 rounded-2xl p-3 border border-slate-800 shadow-sm">
              <span className="text-xl font-bold text-emerald-400 font-mono block">0 ms</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Latencia de Red</span>
            </div>
            <div className="bg-slate-900/50 rounded-2xl p-3 border border-slate-800 shadow-sm">
              <span className="text-xl font-bold text-emerald-400 font-mono block">100%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Privacidad Local</span>
            </div>
          </div>
        </div>
      </section>

      {/* ☕ Footer Info */}
      <footer id="global-footer" className="relative z-10 bg-slate-950/60 border-t border-slate-900 py-6 text-xs text-slate-500 text-center select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-1 font-medium text-slate-400">
            <span>© 2026 SafePass Labs. Vigilancia en Ciberseguridad local.</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <Layers className="w-4 h-4" />
              <span>Edge AI Playground s.a.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 📱 PWA Install Prompt for Mobile Devices */}
      <PWAInstallBanner />

    </div>
  );
}
