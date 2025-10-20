import * as monaco from "monaco-editor";
import { languageRules } from "./languageRules";

export function analyzeCode(
  language: string,
  code: string
): monaco.editor.IMarkerData[] {
  const rules = languageRules[language as keyof typeof languageRules];
  const markers: monaco.editor.IMarkerData[] = [];
  const lines = code.split("\n");

  const declaredVars = new Set<string>();
  const usedVars = new Set<string>();
  const openBrackets = { "(": 0, "{": 0, "[": 0 };

  lines.forEach((line, i) => {
    const lineNumber = i + 1;
    const trimmed = line.trim();

    if (!trimmed || rules.commentRegex?.test(trimmed)) return;

    if (rules.semicolon) {
      const needsSemicolon =
        trimmed &&
        !/[;{}]$/.test(trimmed) &&
        !/(for|if|else|while|switch|class|function|try|catch|def|return)\b/.test(
          trimmed
        );

      if (needsSemicolon) {
        markers.push({
          severity: monaco.MarkerSeverity.Warning,
          message: "Missing semicolon ';' at end of statement",
          startLineNumber: lineNumber,
          startColumn: 1,
          endLineNumber: lineNumber,
          endColumn: line.length + 1,
        });
      }
    }

    // ---- Python Indentation ----
    if (rules.indentation && trimmed.endsWith(":")) {
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.trim() && !/^\s+/.test(nextLine)) {
        markers.push({
          severity: monaco.MarkerSeverity.Error,
          message: "Expected an indented block after ':'",
          startLineNumber: lineNumber + 1,
          startColumn: 1,
          endLineNumber: lineNumber + 1,
          endColumn: nextLine.length + 1,
        });
      }
    }

    // ---- Track Declarations ----
    const varMatch = trimmed.match(rules.varDeclarationRegex);
    if (varMatch && varMatch[2]) declaredVars.add(varMatch[2]);

    const codeWithoutStrings = trimmed.replace(/(["'`]).*?\1/g, "");
    const used = codeWithoutStrings.match(/\b[a-zA-Z_]\w*\b/g);
    if (used) used.forEach((u) => usedVars.add(u));

    (trimmed.match(/\(/g) || []).forEach(() => openBrackets["("]++);
    (trimmed.match(/\)/g) || []).forEach(() => openBrackets["("]--);
    (trimmed.match(/\{/g) || []).forEach(() => openBrackets["{"]++);
    (trimmed.match(/\}/g) || []).forEach(() => openBrackets["{"]--);
    (trimmed.match(/\[/g) || []).forEach(() => openBrackets["["]++);
    (trimmed.match(/\]/g) || []).forEach(() => openBrackets["["]--);

    // ---- Syntax Pattern Hints ----
    rules.syntaxPatterns?.forEach((pattern) => {
      if (pattern.regex.test(line)) {
        markers.push({
          severity: monaco.MarkerSeverity.Hint,
          message: pattern.message,
          startLineNumber: lineNumber,
          startColumn: 1,
          endLineNumber: lineNumber,
          endColumn: line.length + 1,
        });
      }
    });
  });

  Object.entries(openBrackets).forEach(([bracket, count]) => {
    if (count !== 0) {
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message: `Unmatched '${bracket}' detected`,
        startLineNumber: lines.length,
        startColumn: 1,
        endLineNumber: lines.length,
        endColumn: 1,
      });
    }
  });

  if (rules.checkUndefined) {
    usedVars.forEach((v) => {
      if (
        !declaredVars.has(v) &&
        !rules.builtIns.includes(v) &&
        !rules.reservedKeywords?.includes(v)
      ) {
        const regex = new RegExp(`\\b${v}\\b`);
        lines.forEach((line, i) => {
          if (new RegExp(`(["'\\\`])[^"']*${v}[^"']*\\1`).test(line)) return;

          if (regex.test(line)) {
            markers.push({
              severity: monaco.MarkerSeverity.Error,
              message: `Undefined variable or function '${v}'`,
              startLineNumber: i + 1,
              startColumn: line.indexOf(v) + 1,
              endLineNumber: i + 1,
              endColumn: line.indexOf(v) + v.length + 1,
            });
          }
        });
      }
    });
  }

  return markers;
}
