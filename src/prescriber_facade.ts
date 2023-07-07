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

  public async diagnosePatient(): Promise<void> {
    const id = await readline.enterPatientId();
    const patient = this.patient_database.findPatient(id);
    if (!patient) {
      return await this.diagnosePatient();
    }

    const symptoms = await readline.enterSymptom();
    const prescriptions = this.prescriber.diagnosePatient(patient, symptoms);
    const patient_case = new Case(patient.name, symptoms, prescriptions);
    patient.addCase(patient_case);

    await this.exportCase(patient_case);

    return await this.diagnosePatient();
  }

  private async exportCase(targert_case: Case) {
    const answer = await readline.enterExportCaseDecision();

    if (answer === ExportDecision.JSON) {
      this.exportJsonFile(targert_case);
    }

    if (answer === ExportDecision.CSV) {
      this.exportCsvFile(targert_case);
    }

    console.log(answer);
  }

  private exportJsonFile(targert_case: Case) {
    const jsonString = JSON.stringify(targert_case, null, 2);
    const filename = `${targert_case.getName()}-${new Date().getTime()}`;
    const filePath = `${filename}.json`;

    fs.writeFileSync(filePath, jsonString, "utf-8");
    return;
  }

  private exportCsvFile(targert_case: Case) {
    const csvHeader = "name,create_time,symptoms,prescriptions\n";
    const prescriptions = JSON.stringify(targert_case.getPrescriptionse());
    const csvRows = `${targert_case.getName()},${targert_case
      .getCreateTime()
      .toDateString()},${targert_case
      .getSymptoms()
      .join("-")},${prescriptions}`;
    const csvContent = csvHeader + csvRows;
    const filename = `${targert_case.getName()}-${new Date().getTime()}`;
    const filePath = `${filename}.csv`;

    fs.writeFileSync(filePath, csvContent, "utf-8");
  }
}

export enum ExportDecision {
  NotExport,
  JSON,
  CSV,
}
