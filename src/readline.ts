import { Symptom } from "./prescriber";
import { ExportDecision } from "./prescriber_facade";
import * as readline from "readline";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function enterPatientId() {
  return new Promise<string>((resolve) => {
    rl.question("請輸入病患身分證字號", (answer) => {
      return resolve(answer);
    });
  });
}

async function enterSymptom() {
  return new Promise<Symptom[]>((resolve) => {
    const symptoms = Object.keys(Symptom);
    const choose = symptoms
      .map((symptom, index) => `(${index})${symptom}`)
      .join(" ");

    rl.question(`請輸入病患症狀 ${choose}`, async (answer) => {
      const result: Symptom[] = [];
      const symptoms_index = answer.split(" ").map((i) => Number(i));
      for (const index of symptoms_index) {
        const symptom = symptoms[index];
        if (!symptom) {
          return await enterSymptom().then();
        }
        result.push(Symptom[symptom as keyof typeof Symptom]);
      }
      return resolve(result);
    });
  });
}

async function enterExportCaseDecision() {
  return new Promise<ExportDecision>((resolve) => {
    rl.question(
      "是否輸出診斷結果 (0)不輸出 (1)JSON 格式 (2) CSV 格式",
      async (answer) => {
        if (answer === "0") {
          return resolve(ExportDecision.NotExport);
        }

        if (answer === "1") {
          return resolve(ExportDecision.JSON);
        }

        if (answer === "2") {
          return resolve(ExportDecision.CSV);
        }

        return await enterExportCaseDecision().then();
      }
    );
  });
}

export default {
  enterPatientId,
  enterSymptom,
  enterExportCaseDecision,
};
