/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Activity, 
  Binary, 
  Cpu, 
  Compass, 
  Gauge, 
  GitBranch, 
  KeyRound, 
  BrainCircuit, 
  Terminal, 
  ArrowRight,
  Database,
  Braces,
  CheckCircle2,
  XCircle,
  HelpCircle
} from "lucide-react";
import { SafetyLevel, ClassificationReport, TestCase } from "../types";
import { calculatePoolEntropy } from "../mlEngine";

interface LabDashboardProps {
  currentPassword: string;
  onSelectPassword: (password: string) => void;
  report: ClassificationReport;
}

export function LabDashboard({ 
  currentPassword, 
  onSelectPassword, 
  report 
}: LabDashboardProps) {

  // Comprehensive dataset covering common real-world edge cases (Fase 4)
  const testSuite: TestCase[] = [
    {
      id: "tc_1",
      password: "12345",
      category: "Muy Común",
      description: "Secuencia numérica elemental y demasiado corta.",
      expectedLevel: SafetyLevel.DEBIL
    },
    {
      id: "tc_2",
      password: "qwertyuiop",
      category: "Patrón Simple",
      description: "Secuencia física en la primera fila del teclado.",
      expectedLevel: SafetyLevel.DEBIL
    },
    {
      id: "tc_3",
      password: "password123",
      category: "Muy Común",
      description: "Ampliamente listada en diccionarios de filtraciones.",
      expectedLevel: SafetyLevel.DEBIL
    },
    {
      id: "tc_4",
      password: "PerezRodriguez",
      category: "Mezcla Básica",
      description: "Longitud buena, pero solo usa letras mayúsculas/minúsculas.",
      expectedLevel: SafetyLevel.DEBIL
    },
    {
      id: "tc_5",
      password: "Marcos_2026",
      category: "Mezcla Básica",
      description: "Tiene mayúscula, símbolo y número, pero baja entropía.",
      expectedLevel: SafetyLevel.MEDIA
    },
    {
      id: "tc_6",
      password: "Fr4nco!Sp0rts_9*",
      category: "Robusta",
      description: "Frase de acceso con alta variedad y de longitud media.",
      expectedLevel: SafetyLevel.SEGURA
    },
    {
      id: "tc_7",
      password: "Xy2$9sA7#qR1*mB!",
      category: "Excelente",
      description: "Clave criptográfica optimizada sin secuencias lógicas.",
      expectedLevel: SafetyLevel.SEGURA
    }
  ];

  // Quantitative vector details
  const classesUsed = [
    report.vector.digitCount > 0,
    report.vector.specialCount > 0,
    report.vector.upperCount > 0,
    report.vector.lowerCount > 0
  ].filter(Boolean).length;

  const poolEntropy = calculatePoolEntropy(currentPassword, report.vector);

  // Decision path active test flags (to highlight active parts in the Tree Visualizer)
  const lenUnder6 = report.vector.length < 6;
  const hasPattern = report.vector.hasSequentialPattern;
  const isSecure = report.level === SafetyLevel.SEGURA;
  const isMedia = report.level === SafetyLevel.MEDIA;
  const isDebil = report.level === SafetyLevel.DEBIL;

  return (
    <div id="lab-dashboard" className="glass rounded-[2rem] p-6 space-y-7 flex flex-col justify-between h-full shadow-2xl">
      <div>
        
        {/* Lab Header */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-slate-900/80 text-emerald-400 border border-slate-800 shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Módulo Científico y Lab Telemetría</h2>
              <p className="text-xs text-slate-400 mt-0.5">Fase 1, 2 y 4: Extracción de Vectores de Atributos On-Device</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-1 py-1 px-3 bg-emerald-500/10 text-emerald-400 rounded-full font-mono text-[10px] uppercase font-bold border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ML Serverless: OK</span>
          </div>
        </div>

        {/* --- FASE 1: INGENIERÍA DE ATRIBUTOS (FEATURE EXTRACTION) --- */}
        <div className="space-y-3.5 mb-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 font-extrabold px-2.5 py-0.5 rounded-md">FASE 1</span>
              <h3 className="text-sm font-bold text-slate-200 tracking-tight">Ingeniería de Atributos Vectoriales</h3>
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-bold font-mono">
              <Braces className="w-3.5 h-3.5 text-slate-500" />
              <span>VECT_IN = [{report.vector.length}, {report.vector.digitCount}, {report.vector.specialCount}, {report.vector.upperCount}, {classesUsed}, {report.vector.hasSequentialPattern ? 1 : 0}]</span>
            </div>
          </div>

          {/* Feature Vectors Display Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            
            {/* Length N Card */}
            <div className="bg-slate-900/40 rounded-2xl p-3 border border-slate-800/80 flex flex-col justify-between h-24">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">Espacio (N)</span>
                <Gauge className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <span className="text-2xl font-black font-mono text-white">{report.vector.length}</span>
                <span className="text-[10px] text-slate-450 select-none block font-medium opacity-80">Largo en caracteres</span>
              </div>
            </div>

            {/* Shannon Entropy (H) Card */}
            <div className="bg-slate-900/40 rounded-2xl p-3 border border-slate-800/80 flex flex-col justify-between h-24">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">Entropía Shannon</span>
                <Binary className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <span className={`text-2xl font-black font-mono ${
                  report.vector.entropy < 2.0 ? 'text-rose-400' : report.vector.entropy < 3.0 ? 'text-amber-400' : 'text-emerald-405 text-emerald-400'
                }`}>{report.vector.entropy} <span className="text-xs text-slate-500">bits</span></span>
                <span className="text-[10px] text-slate-405 select-none block font-medium opacity-80">Fórmula de Shannon H</span>
              </div>
            </div>

            {/* Character Pool Entropy Card */}
            <div className="bg-slate-900/40 rounded-2xl p-3 border border-slate-800/80 flex flex-col justify-between h-24">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">Bits Robustez</span>
                <Database className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <span className={`text-2xl font-black font-mono ${
                  poolEntropy < 30 ? 'text-rose-400' : poolEntropy < 55 ? 'text-amber-400' : 'text-emerald-400'
                }`}>{poolEntropy} <span className="text-xs text-slate-500">bits</span></span>
                <span className="text-[10px] text-slate-405 select-none block font-medium opacity-80">Complejidad combinatoria</span>
              </div>
            </div>

            {/* Forbidden Pattern Detection Card */}
            <div className={`rounded-2xl p-3 border flex flex-col justify-between h-24 transition-colors ${
              report.vector.hasSequentialPattern 
                ? 'bg-rose-950/25 border-rose-900/40 text-rose-300' 
                : 'bg-slate-900/40 border-slate-800/80 text-slate-300'
            }`}>
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">Ataque Diccionario</span>
                <Activity className="w-4 h-4 shrink-0 text-slate-500" />
              </div>
              <div>
                <span className={`text-sm md:text-base font-black truncate block ${
                  report.vector.hasSequentialPattern ? 'text-rose-400 font-bold' : 'text-slate-400 font-medium'
                }`}>
                  {report.vector.hasSequentialPattern ? "CRÍTICO" : "Ninguno Detectado"}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight block font-medium truncate">
                  {report.vector.hasSequentialPattern ? report.vector.sequentialPatternName : "Sin secuencias comunes"}
                </span>
              </div>
            </div>

          </div>

          {/* Sub-features classes representation bar */}
          <div className="bg-slate-900/45 rounded-2xl p-3.5 border border-slate-800/60 text-xs">
            <div className="flex justify-between items-center mb-2.5 text-[10px] text-slate-400 font-bold">
              <span>CONTENIDO DE CLASES POR CATEGORÍA DE CARÁCTER (Total {classesUsed}/4)</span>
              <span className="font-mono text-emerald-400">{Math.round(classesUsed * 25)}%</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 font-mono text-[10px] font-bold text-center">
              
              {/* Lowercase check */}
              <div className={`p-1.5 rounded-lg border ${report.vector.lowerCount > 0 ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400' : 'bg-slate-950/40 border-slate-900 text-slate-600'}`}>
                <span>[a-z] ({report.vector.lowerCount})</span>
              </div>

              {/* Uppercase check */}
              <div className={`p-1.5 rounded-lg border ${report.vector.upperCount > 0 ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400' : 'bg-slate-950/40 border-slate-900 text-slate-600'}`}>
                <span>[A-Z] ({report.vector.upperCount})</span>
              </div>

              {/* Digits check */}
              <div className={`p-1.5 rounded-lg border ${report.vector.digitCount > 0 ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400' : 'bg-slate-950/40 border-slate-900 text-slate-600'}`}>
                <span>[0-9] ({report.vector.digitCount})</span>
              </div>

              {/* Symbols Check */}
              <div className={`p-1.5 rounded-lg border ${report.vector.specialCount > 0 ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400' : 'bg-slate-950/40 border-slate-900 text-slate-600'}`}>
                <span>Símb ({report.vector.specialCount})</span>
              </div>

            </div>
          </div>
        </div>

        {/* --- FASE 2: INTERNAL MACHINE LEARNING INSPECTOR (XAI DECISION TREE) --- */}
        <div id="ml-decision-tree" className="space-y-3.5 mb-7 font-sans">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 font-extrabold px-2.5 py-0.5 rounded-md">FASE 2</span>
            <h3 className="text-sm font-bold text-slate-200 tracking-tight">Árbol de Inferencia (Explainable AI - XAI)</h3>
          </div>

          {/* Web Styled Interactive Flow for Decision Tree */}
          <div className="bg-slate-950/90 text-slate-300 rounded-2xl p-4 md:p-5 border border-slate-800/80 font-mono text-[11px] leading-relaxed relative overflow-hidden">
            
            <div className="absolute top-2 right-2 text-slate-600 flex items-center space-x-1 font-mono text-[9px]">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              <span>NATIVO_JS</span>
            </div>

            <div className="space-y-4">
              
              {/* Root Step */}
              <div className="flex items-start space-x-2">
                <span className="text-slate-500 shrink-0 select-none">➤ [01]</span>
                <div>
                  <div className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Entrada: Contraseña en Tiempo Real</div>
                  <div className="text-slate-400 mt-1 font-sans leading-relaxed">
                    Evaluando: <span className="bg-slate-900 text-white font-mono px-2 py-0.5 rounded select-all font-semibold border border-slate-800">{currentPassword ? `"${currentPassword}"` : "Vacio"}</span>
                  </div>
                </div>
              </div>

              {/* Split test 1 */}
              <div className="flex items-start space-x-2 border-l border-slate-850 pl-4 py-0.5 ml-2.5">
                <span className="text-emerald-500 shrink-0 select-none font-bold">◆</span>
                <div>
                  <span className="text-slate-400">¿Longitud menor a 6 caracteres? </span>
                  {currentPassword ? (
                    lenUnder6 ? (
                      <span className="text-rose-400 font-bold bg-rose-950/40 border border-rose-900/30 px-1.5 py-0.5 rounded ml-1">Sí (Foco Débil)</span>
                    ) : (
                      <span className="text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded ml-1">No, seguir</span>
                    )
                  ) : (
                    <span className="text-slate-600 font-semibold italic ml-1">&#123;Esperando&#125;</span>
                  )}
                </div>
              </div>

              {/* Split test 2 */}
              <div className="flex items-start space-x-2 border-l border-slate-850 pl-4 py-0.5 ml-2.5">
                <span className="text-emerald-500 shrink-0 select-none font-bold">◆</span>
                <div>
                  <span className="text-slate-400">¿Variedad de clases inferior a 2 ó Patrón vulnerable detectado? </span>
                  {currentPassword ? (
                    (classesUsed < 2 || hasPattern) ? (
                      <span className="text-rose-400 font-bold bg-rose-950/40 border border-rose-900/30 px-1.5 py-0.5 rounded ml-1">Sí (Penalizar/Límite Débil)</span>
                    ) : (
                      <span className="text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded ml-1">No, evaluar robusticidad</span>
                    )
                  ) : (
                    <span className="text-slate-600 font-semibold italic ml-1">&#123;Esperando&#125;</span>
                  )}
                </div>
              </div>

              {/* Split test 3 */}
              <div className="flex items-start space-x-2 border-l border-slate-850 pl-4 py-0.5 ml-2.5">
                <span className="text-emerald-500 shrink-0 select-none font-bold">◆</span>
                <div>
                  <span className="text-slate-400">¿N &gt;= 10 && classes &gt;= 3 && Entropía &gt;= 2.8?</span>
                  {currentPassword ? (
                    isSecure ? (
                      <span className="text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded ml-1">Sí (Cumple Criterio Seguro)</span>
                    ) : (
                      <span className="text-amber-400 font-bold bg-amber-950/40 border border-amber-900/30 px-1.5 py-0.5 rounded ml-1">No (Estancia Media)</span>
                    )
                  ) : (
                    <span className="text-slate-600 font-semibold italic ml-1">&#123;Esperando&#125;</span>
                  )}
                </div>
              </div>

              {/* Final Leaf Node Result */}
              <div className="pt-2 border-t border-slate-900 flex items-center space-x-2.5">
                <span className="text-emerald-450 text-emerald-400 select-none font-bold">➔ FINAL LEAF:</span>
                {currentPassword ? (
                  <div className="flex items-center space-x-1.5 leading-none">
                    <span className={`px-2.5 py-1 text-xs font-black rounded ${
                      isDebil ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 glow-rose' :
                      isMedia ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 glow-amber' :
                      'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 glow-emerald'
                    }`}>
                      {report.level}
                    </span>
                    <span className="text-[10px] text-slate-450 font-semibold font-sans">
                      Score total: <strong className="text-slate-250 font-mono">{report.score} pts</strong>
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-600 italic font-semibold">&#123;Esperando vector de entrada&#125;</span>
                )}
              </div>

            </div>

          </div>

          {/* Actual Log of internal nodes traversed */}
          <div className="bg-slate-900/40 rounded-2xl p-3 border border-slate-800/60 space-y-2">
            <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider">Caminos Cruzados por el Motor (Inferencia de Auditoría):</span>
            <div className="space-y-1">
              {report.decisionPath.map((pathItem, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 text-[10.5px] text-slate-300 font-medium">
                  <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate opacity-90">{pathItem}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* --- FASE 4: TESTING & VALIDATION PLAYGROUND (DATASET PRUEBAS) --- */}
      <div id="testing-dataset" className="space-y-3 pt-4.5 mt-auto border-t border-slate-800/60 font-sans">
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 font-extrabold px-2.5 py-0.5 rounded-md">FASE 4</span>
          <h3 className="text-sm font-bold text-slate-200 tracking-tight">Suite de Pruebas y Validación de la IA</h3>
        </div>

        <p className="text-xs text-slate-400 leading-normal">
          Selecciona una contraseña del dataset estándar para validar la precisión de la IA local instantáneamente:
        </p>

        {/* Test dataset list */}
        <div className="overflow-x-auto select-none">
          <table className="w-full text-[11px] text-left text-slate-350 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-slate-900/80 text-[10px] text-slate-400 font-bold uppercase border-b border-slate-800">
              <tr>
                <th className="px-3 py-2">Clave</th>
                <th className="px-3 py-2">Categoría</th>
                <th className="px-2 py-2 text-center">Nivel Esperado</th>
                <th className="px-3 py-2 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium bg-slate-950/20">
              {testSuite.map((test) => {
                const isActive = currentPassword === test.password;
                return (
                  <tr 
                    key={test.id} 
                    className={`hover:bg-emerald-500/10 transition-colors cursor-pointer ${
                      isActive ? 'bg-emerald-500/5 font-bold text-white' : ''
                    }`}
                    onClick={() => onSelectPassword(test.password)}
                  >
                    <td className="px-3 py-2.5 font-mono text-white break-all max-w-[120px]">
                      {test.password}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col">
                        <span>{test.category}</span>
                        <span className="text-[9px] text-slate-500 font-normal leading-tight hidden lg:block">{test.description}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                        test.expectedLevel === SafetyLevel.DEBIL ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        test.expectedLevel === SafetyLevel.MEDIA ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {test.expectedLevel}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold text-emerald-400 hover:text-emerald-300 text-[10px] tracking-wide">
                      {isActive ? (
                        <span className="text-emerald-400 font-semibold flex items-center justify-end space-x-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Evaluando</span>
                        </span>
                      ) : (
                        <span>Simular ⚡</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
