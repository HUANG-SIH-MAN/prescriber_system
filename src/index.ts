import { PrescriberFacade } from "./prescriber_facade";
import * as patient_data from "./patient_data.json";
import * as fs from "fs-extra";

const facade = new PrescriberFacade();
facade.importPatientData(patient_data.data);

const disease = fs.readFileSync("./src/disease.txt", "utf-8");
facade.setPrescriber(disease.split("\r\n"));
facade.diagnosePatient();
