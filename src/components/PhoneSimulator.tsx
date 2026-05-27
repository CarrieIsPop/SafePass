/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  RefreshCw, 
  Copy, 
  Check, 
  Plane, 
  Wifi, 
  Battery, 
  Sparkles,
  AlertTriangle,
  XCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SafetyLevel, ClassificationReport } from "../types";
import { generateSecurePassword } from "../mlEngine";

interface PhoneSimulatorProps {
  currentPassword: string;
  onChangePassword: (password: string) => void;
  report: ClassificationReport;
}

export function PhoneSimulator({ 
  currentPassword, 
  onChangePassword, 
  report 
}: PhoneSimulatorProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [airplaneMode, setAirplaneMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generatorLength, setGeneratorLength] = useState(14);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Generate actual device time representation
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleGenerate = () => {
    const pw = generateSecurePassword(generatorLength);
    onChangePassword(pw);
  };

  // Color mappings for progress meter and states
  const colors = {
    [SafetyLevel.DEBIL]: {
      text: "text-rose-400",
      bgClass: "bg-rose-500 glow-rose",
      lightBg: "bg-rose-950/20",
      border: "border-rose-900/40",
      badge: "bg-rose-500/15 text-rose-400 border border-rose-500/20",
      icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
    },
    [SafetyLevel.MEDIA]: {
      text: "text-amber-400",
      bgClass: "bg-amber-500 glow-amber",
      lightBg: "bg-amber-950/25",
      border: "border-amber-900/40",
      badge: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
    },
    [SafetyLevel.SEGURA]: {
      text: "text-emerald-400",
      bgClass: "bg-emerald-500 glow-emerald",
      lightBg: "bg-emerald-950/20",
      border: "border-emerald-900/40",
      badge: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
    }
  };

  const currentColors = currentPassword ? colors[report.level] : {
    text: "text-slate-500",
    bgClass: "bg-slate-800",
    lightBg: "bg-slate-900/40",
    border: "border-slate-800",
    badge: "bg-slate-800 text-slate-400 border border-slate-700/50",
    icon: <Lock className="w-5 h-5 text-slate-500 shrink-0" />
  };

  return (
    <div id="password-validator-panel" className="glass rounded-[2rem] p-6 space-y-5 shadow-2xl overflow-hidden flex flex-col font-sans transition-all duration-300 w-full">
      
      {/* Sleek Header with Title and Local Connection Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800/60">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/10 shrink-0">
            <ShieldCheck className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">SafePass <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full ml-1">v1.2</span></h1>
            <p className="text-xs text-slate-400">Validador de Atributos Predictivos</p>
          </div>
        </div>

        {/* Local Sync Mode Control */}
        <button
          onClick={() => setAirplaneMode(!airplaneMode)}
          title={airplaneMode ? "Cambiar a modo conectado" : "Cambiar a simulación offline"}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase transition-all duration-300 border ${
            airplaneMode 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-lg shadow-amber-500/5 hover:bg-amber-500/25' 
              : 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-lg shadow-blue-500/5 hover:bg-blue-500/25'
          }`}
        >
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${airplaneMode ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${airplaneMode ? 'bg-amber-550 bg-amber-500' : 'bg-blue-500'}`}></span>
          </span>
          <span>{airplaneMode ? "Local Sólido" : "Inferencia Online"}</span>
        </button>
      </div>

      {/* Description banner */}
      <div className="text-center select-none py-1">
        {airplaneMode ? (
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] uppercase font-bold tracking-wider">
            <Plane className="w-3.5 h-3.5 mr-1" />
            <span>Edge AI: 100% Sin Servidor (Modo Avión Cohesivo)</span>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] uppercase font-bold tracking-wider">
            <Wifi className="w-3.5 h-3.5 mr-1" />
            <span>Simulación de Red: Auditoría en Tiempo Real</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-5">
        
        {/* Card for Password Input Form */}
        <div id="pwd-card" className="bg-slate-900/40 border border-slate-800/85 rounded-2xl p-4.5 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block ml-1">Contraseña de Entrada</label>
            {currentPassword && (
              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${currentColors.badge}`}>
                {report.level}
              </span>
            )}
          </div>

          {/* Secure Input Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => onChangePassword(e.target.value)}
              placeholder="Ingresar contraseña..."
              className="w-full text-white font-mono pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-sm transition-all"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
            />
            {currentPassword && (
              <button
                id="toggle-pass-visibility"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Strength Progress Meter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
              <span>FUERZA DEL SENSOR ML</span>
              <span className="font-mono text-slate-200">{currentPassword ? `${report.score}/100` : "0/100"}</span>
            </div>
            {/* Outter Bar */}
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <motion.div 
                id="strength-bar"
                className={`h-full rounded-full ${currentColors.bgClass}`}
                initial={{ width: "0%" }}
                animate={{ width: `${currentPassword ? report.score : 0}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
              />
            </div>
          </div>
        </div>

        {/* Real-time ML Evaluation Diagnosis Card */}
        <AnimatePresence mode="wait">
          {currentPassword ? (
            <motion.div 
              key={report.level + report.score}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`rounded-[2rem] p-4.5 border ${currentColors.lightBg} ${currentColors.border} space-y-4 shadow-xl`}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 shrink-0">
                  {currentColors.icon}
                </div>
                <div>
                  <h3 className={`text-sm font-bold tracking-tight ${currentColors.text}`}>
                    Veredicto: {report.level}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 font-medium leading-relaxed opacity-95">
                    {report.level === SafetyLevel.DEBIL && "La clave presenta serias vulnerabilidades de diccionario y puede ser comprometida instantáneamente."}
                    {report.level === SafetyLevel.MEDIA && "Nivel intermedio. Resiste pruebas automáticas básicas pero carece de la entropía máxima ideal."}
                    {report.level === SafetyLevel.SEGURA && "Altísima inmunidad. La configuración formal de la tipografía supera los diccionarios de ataque."}
                  </p>
                </div>
              </div>

              {/* Actionable Suggestions (Consejos de mejora) */}
              <div className="border-t border-slate-800/60 pt-3.5 space-y-2.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block ml-1">Análisis de Consejos</span>
                <div className="space-y-2">
                  {report.advices.map((advice) => (
                    <div key={advice.id} className="flex items-start space-x-2 text-[11px] text-slate-300 leading-normal">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        advice.type === "danger" ? "bg-rose-500 glow-rose" : advice.type === "warning" ? "bg-amber-500 glow-amber" : "bg-emerald-500 glow-emerald"
                      }`} />
                      <span>{advice.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-[2rem] p-6 text-center text-slate-400 space-y-3 py-10"
            >
              <Lock className="w-7 h-7 mx-auto text-slate-500 stroke-[1.5]" />
              <p className="text-xs font-bold text-slate-300">Inferencia de Latencia Cero</p>
              <p className="text-[11px] text-slate-400 max-w-[220px] mx-auto leading-relaxed">
                Empieza a tipear una contraseña para computar sus características de entropía en tiempo real.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cryptographic Secure Generator Drawer / Card */}
        <div id="generator-card" className="glass rounded-[2rem] p-4.5 space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 text-emerald-400 stroke-[2.5]" />
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-250">Seguridad Criptográfica</h3>
          </div>
          
          <p className="text-[11px] text-slate-400 leading-relaxed opacity-90">
            Utilice entropía nativa segura (<code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-400 text-[10px] font-mono border border-slate-800">crypto.getRandomValues</code>) para generar combinaciones matemáticas ideales.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-400 font-semibold font-mono">
              <span>Longitud:</span>
              <span className="text-emerald-400 font-bold">{generatorLength} caracteres</span>
            </div>
            <input 
              type="range" 
              min="8" 
              max="24" 
              value={generatorLength}
              onChange={(e) => setGeneratorLength(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer bg-slate-800 rounded-lg appearance-none h-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              id="phone-gen-btn"
              type="button"
              onClick={handleGenerate}
              className="py-3 px-3 bg-white text-slate-950 hover:bg-slate-100 active:scale-[0.98] rounded-xl text-xs font-bold transition-all shadow-xl shadow-slate-950/40 flex items-center justify-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generar</span>
            </button>
            
            <button
              id="phone-copy-btn"
              type="button"
              disabled={!currentPassword}
              onClick={() => handleCopy(currentPassword)}
              className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                currentPassword 
                  ? 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800 active:scale-[0.98]' 
                  : 'bg-slate-950/40 text-slate-600 border border-slate-900 cursor-not-allowed'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiada</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
      
    </div>
  );
}
