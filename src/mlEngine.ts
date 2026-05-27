/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SafetyLevel, FeatureVector, ClassificationReport, AdviceItem } from "./types";

/**
 * Calculates the Shannon Entropy of a string: H = -sum(p_i * log2(p_i))
 * Measures how unpredictable/random the characters in the string are.
 */
export function calculateShannonEntropy(str: string): number {
  if (!str) return 0;
  const freqs: Record<string, number> = {};
  for (const char of str) {
    freqs[char] = (freqs[char] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const char in freqs) {
    const p = freqs[char] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(2));
}

/**
 * Calculates the classic cybersecurity pool-based entropy:
 * E = N * log2(R) where R is the size of the character pool used.
 */
export function calculatePoolEntropy(str: string, vector: Omit<FeatureVector, "entropy">): number {
  if (!str) return 0;
  let poolSize = 0;
  if (vector.digitCount > 0) poolSize += 10;
  if (vector.lowerCount > 0) poolSize += 26;
  if (vector.upperCount > 0) poolSize += 26;
  if (vector.specialCount > 0) poolSize += 33;
  
  if (poolSize === 0) return 0;
  const poolEntropy = str.length * Math.log2(poolSize);
  return Number(poolEntropy.toFixed(1));
}

/**
 * Extracts the feature vector for a password.
 */
export function extractFeatures(str: string): FeatureVector {
  const length = str.length;
  const digitCount = (str.match(/[0-9]/g) || []).length;
  const specialCount = (str.match(/[!@#$%^&*(),.?":{}|<>_+\-\[\]\\/~`;']/g) || []).length;
  const upperCount = (str.match(/[A-Z]/g) || []).length;
  const lowerCount = (str.match(/[a-z]/g) || []).length;
  
  // Pattern detection
  let hasSequentialPattern = false;
  let sequentialPatternName = "";
  
  const lowerStr = str.toLowerCase();
  const simplePatterns = [
    { seq: "123", name: "Secuencia Numérica Simbólica ('123')" },
    { seq: "abc", name: "Secuencia Alfabética ('abc')" },
    { seq: "qwerty", name: "Patrón de Teclado QWERTY" },
    { seq: "asdf", name: "Patrón de Teclado ASDF" },
    { seq: "admin", name: "Palabra del Glosario de Contraseñas Comunes ('admin')" },
    { seq: "root", name: "Palabra Clásica Vulnerable ('root')" },
    { seq: "password", name: "Palabra Altamente Predecible ('password')" },
    { seq: "contraseña", name: "Palabra Clave Genérica ('contraseña')" }
  ];
  
  for (const pattern of simplePatterns) {
    if (lowerStr.includes(pattern.seq)) {
      hasSequentialPattern = true;
      sequentialPatternName = pattern.name;
      break;
    }
  }
  
  // Repeated characters (e.g. "aaa", "111")
  if (!hasSequentialPattern && /(.)\1{2,}/.test(str)) {
    hasSequentialPattern = true;
    sequentialPatternName = "Caracteres Repetidos Consecutivos";
  }

  // Calculate Shannon Entropy
  const entropy = calculateShannonEntropy(str);
  
  return {
    length,
    digitCount,
    specialCount,
    upperCount,
    lowerCount,
    hasSequentialPattern,
    sequentialPatternName,
    entropy
  };
}

/**
 * Evaluates the feature vector using a simulated Local Decision Tree.
 * Records the exact rule trigger path (decisionPath) for Explainable AI (XAI).
 */
export function classifyPassword(password: string): ClassificationReport {
  if (!password) {
    return {
      level: SafetyLevel.DEBIL,
      score: 0,
      vector: {
        length: 0,
        digitCount: 0,
        specialCount: 0,
        upperCount: 0,
        lowerCount: 0,
        hasSequentialPattern: false,
        sequentialPatternName: "",
        entropy: 0
      },
      advices: [
        { id: "empty", text: "Comienza a escribir una contraseña para evaluarla en tiempo real.", type: "warning" }
      ],
      decisionPath: ["Root -> Contraseña vacía"]
    };
  }

  const vector = extractFeatures(password);
  const decisionPath: string[] = ["Root Node"];
  const advices: AdviceItem[] = [];
  
  let score = 0;
  let level = SafetyLevel.DEBIL;

  // Base scoring contributions
  // Length contribution: max 40 points (8 points per character up to length 12, then additional)
  let lengthContribution = Math.min(40, vector.length * 4);
  if (vector.length >= 8) lengthContribution += 10; // extra bonus for >= 8
  if (vector.length >= 12) lengthContribution += 10; // extra bonus for >= 12

  // Variety contribution: maximum 30 points
  let varietyScore = 0;
  const classesUsed = [
    vector.digitCount > 0,
    vector.specialCount > 0,
    vector.upperCount > 0,
    vector.lowerCount > 0
  ].filter(Boolean).length;
  varietyScore = classesUsed * 7.5; // up to 30 points

  // Entropy contribution: Shannon entropy max 4.0 in real use, scale it to 20 points
  // Entropy typically peaks around 4-5. Let's scale (entropy / 4.5) * 20
  const entropyContribution = Math.min(20, (vector.entropy / 4.5) * 20);

  // Raw score sum
  let calculatedScore = lengthContribution + varietyScore + entropyContribution;

  // Pattern Penalty
  let patternPenalty = 0;
  if (vector.hasSequentialPattern) {
    patternPenalty = 30; // Strong penalty for trivial sequences
    calculatedScore -= patternPenalty;
  }

  // Double check bounds
  score = Math.max(0, Math.min(100, Math.round(calculatedScore)));

  // Decision Tree Inferences (Fase 2 - Local Classifier)
  decisionPath.push(`Analizando atributos vectoriales: Longitud=${vector.length}, Variedad Clases=${classesUsed}, Shannon_Entropía=${vector.entropy}`);

  if (vector.length < 6) {
    level = SafetyLevel.DEBIL;
    decisionPath.push("Nodo [Longitud < 6] -> Clasificado como DÉBIL de manera mandatoria.");
    advices.push({
      id: "len_short",
      text: "La contraseña es demasiado corta. Se recomiendan al menos 8 a 12 caracteres.",
      type: "danger"
    });
  } else {
    decisionPath.push("Nodo [Longitud >= 6] -> Avanzar a nivel de entropía y patrones.");
    
    if (vector.hasSequentialPattern) {
      decisionPath.push(`Nodo [Patrón Detectado: ${vector.sequentialPatternName}] -> Penalización severa aplicada.`);
      advices.push({
        id: "pattern",
        text: `Se detectó un patrón predecible: "${vector.sequentialPatternName}". Los atacantes usan diccionarios con estos patrones.`,
        type: "danger"
      });
    }

    if (classesUsed < 2) {
      decisionPath.push("Nodo [Variedad < 2 clases] -> Restringido a DÉBIL por falta de diversidad.");
      advices.push({
        id: "variety_danger",
        text: "Utiliza una mezcla de mayúsculas, minúsculas, números y símbolos.",
        type: "danger"
      });
      level = SafetyLevel.DEBIL;
    } else {
      decisionPath.push("Nodo [Variedad >= 2 clases] -> Evaluando robustez media/alta.");
      
      // Check if it qualifies for SECURE (SEGURA)
      // Standard for a secure password: Length >= 10, no sequential pattern, variety >= 3, entropy >= 3.0
      const isLongEnough = vector.length >= 10;
      const hasNoPattern = !vector.hasSequentialPattern;
      const hasGoodDiversity = classesUsed >= 3;
      const hasHighEntropy = vector.entropy >= 2.8;

      if (isLongEnough && hasNoPattern && hasGoodDiversity && hasHighEntropy) {
        level = SafetyLevel.SEGURA;
        decisionPath.push("Nodo [Longitud >= 10 && Sin Patrón && Variedad >= 3 && Entropía >= 2.8] -> Clasificación: SEGURA 🛡️");
        advices.push({
          id: "secured",
          text: "¡Excelente! La contraseña es robusta frente a ataques de fuerza bruta locales y de diccionario.",
          type: "success"
        });
      } else {
        level = SafetyLevel.MEDIA;
        decisionPath.push("Nodo [Cumple requisitos básicos pero falla algún umbral avanzado] -> Clasificación: MEDIA ⚠️");
        
        // Custom recommendations based on what's missing
        if (vector.length < 10) {
          advices.push({
            id: "suggest_len",
            text: "Incrementar la longitud hasta 12 caracteres aumentaría exponencialmente la dificultad de descifrado.",
            type: "warning"
          });
        }
        if (classesUsed < 3) {
          advices.push({
            id: "suggest_classes",
            text: `Solo estás usando ${classesUsed} clases de caracteres. Agrega letras ${vector.specialCount === 0 ? 'símbolos especiales' : 'números o letras'}.`,
            type: "warning"
          });
        }
        if (vector.entropy < 2.8) {
          advices.push({
            id: "suggest_entropy",
            text: "Intenta que los caracteres no sigan palabras comunes para elevar la entropía de Shannon.",
            type: "warning"
          });
        }
      }
    }
  }

  // Ensure logical alignment: If level is SEGURA, score should be >= 75
  if (level === SafetyLevel.SEGURA && score < 75) {
    score = Math.max(75, score);
  }
  // If level is DEBIL, score should be < 45
  if (level === SafetyLevel.DEBIL && score >= 45) {
    score = Math.min(44, score);
  }
  // If level is MEDIA, score should be between 45 and 74
  if (level === SafetyLevel.MEDIA && (score < 45 || score >= 75)) {
    score = Math.max(45, Math.min(74, score));
  }

  // Add standard guidelines depending on vectors
  if (vector.specialCount === 0) {
    advices.push({
      id: "no_specials",
      text: "Recomendación: Agrega un símbolo como #, $, @, !, % o ?.",
      type: "warning"
    });
  }
  if (vector.digitCount === 0) {
    advices.push({
      id: "no_digits",
      text: "Sugerencia: Introduce números intercalados en lugar de usarlos al final.",
      type: "warning"
    });
  }

  return {
    level,
    score,
    vector,
    advices,
    decisionPath
  };
}

/**
 * Generates a Highly Cryptographically Secure Random Password using crypto.getRandomValues
 */
export function generateSecurePassword(length: number = 14): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const n = charset.length;
  let result = "";
  
  // Create typed array for secure randomness
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % n];
  }
  
  return result;
}
