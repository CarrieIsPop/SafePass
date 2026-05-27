/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum SafetyLevel {
  DEBIL = "DÉBIL",
  MEDIA = "MEDIA",
  SEGURA = "SEGURA",
}

export interface FeatureVector {
  length: number;          // Total character count N
  digitCount: number;      // Count of numerical digits [0-9]
  specialCount: number;    // Count of special characters like !@#$%^&*()
  upperCount: number;      // Count of uppercase letters [A-Z]
  lowerCount: number;      // Count of lowercase letters [a-z]
  hasSequentialPattern: boolean; // True if matches "1234", "qwerty", etc.
  sequentialPatternName: string; // Name of detected vulnerability pattern
  entropy: number;         // Shannon Entropy in bits
}

export interface AdviceItem {
  id: string;
  text: string;
  type: "success" | "warning" | "danger";
}

export interface ClassificationReport {
  level: SafetyLevel;
  score: number; // 0 to 100
  vector: FeatureVector;
  advices: AdviceItem[];
  decisionPath: string[]; // List of decision rules executed in the ML simulator
}

export interface TestCase {
  id: string;
  password: string;
  category: "Muy Común" | "Patrón Simple" | "Mezcla Básica" | "Robusta" | "Excelente";
  description: string;
  expectedLevel: SafetyLevel;
}
