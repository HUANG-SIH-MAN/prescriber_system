import { Patient, PatientDatabase, Gender, Case } from "./patient";
import { Prescriber } from "./prescriber";
import readline from "./readline";
import * as fs from "fs";

export class PrescriberFacade {
  private patient_database: PatientDatabase;
  private prescriber: Prescriber;

  constructor() {
    this.patient_database = new PatientDatabase();
    this.prescriber = new Prescriber();
  }

  public importPatientData(
    data: {
      id: string;
      name: string;
      gender: string;
      age: number;
      weight: number;
      height: number;
    }[]
  ) {
    data.forEach((patient) => {
      const gender = patient.gender === "male" ? Gender.Male : Gender.Female;
      this.patient_database.addPatient(
        new Patient(
          patient.id,
          patient.name,
          gender,
          patient.age,
          patient.weight,
          patient.height
        )
      );
    });
    return;
  }

  public setPrescriber(diseases: string[]) {
    diseases.forEach((disease) => this.prescriber.setPrescription(disease));
  }

  public async addPatient(): Promise<void> {
    const id = await readline.enterPatientId();
    const patient = this.patient_database.findPatient(id);
    if (!patient) {
      return await this.addPatient();
    }
    const symptoms = await readline.enterSymptom();
    const answer = await readline.enterExportCaseDecision();
    this.prescriber.addPatient(patient, symptoms, answer);

    return;
  }

  public diagnosePatient(): void {
    const patient_data = this.prescriber.getNowdiagnosePatient();
    if (!patient_data) {
      return;
    }

    const prescriptions = this.prescriber.diagnosePatient(
      patient_data.patient,
      patient_data.symptom
    );

    const patient_case = new Case(
      patient_data.patient.name,
      patient_data.symptom,
      prescriptions
    );

    patient_data.patient.addCase(patient_case);
    this.exportCase(patient_data.is_export, patient_case);

    setTimeout(() => {}, 3000);
    return;
  }

  private async exportCase(is_export: ExportDecision, targert_case: Case) {
    if (is_export === ExportDecision.NotExport) {
      return;
    }

    let fileContent: string = "";
    if (is_export === ExportDecision.JSON) {
      fileContent = JSON.stringify(targert_case, null, 2);
    }

    if (is_export === ExportDecision.CSV) {
      const csvHeader = "name,create_time,symptoms,prescriptions\n";
      const prescriptions = JSON.stringify(targert_case.getPrescriptionse());
      const csvRows = `${targert_case.getName()},${targert_case
        .getCreateTime()
        .toDateString()},${targert_case
        .getSymptoms()
        .join("-")},${prescriptions}`;
      fileContent = csvHeader + csvRows;
    }

    const filePath = `${targert_case.getName()}-${new Date().getTime()}.json`;
    fs.writeFileSync(filePath, fileContent, "utf-8");
    return;
  }
}

export enum ExportDecision {
  NotExport,
  JSON,
  CSV,
}
