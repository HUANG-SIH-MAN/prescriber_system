import { Patient } from "./patient";
import { ExportDecision } from "./prescriber_facade";

export enum Symptom {
  Headache = "Headache",
  Cough = "Cough",
  Sneeze = "Sneeze",
  Snore = "Snore",
}

export class Prescriber {
  private prescription_list: Prescription[] = [];
  private waiting_list: {
    patient: Patient;
    symptom: Symptom[];
    is_export: ExportDecision;
  }[] = [];

  public setPrescription(disease_name: string) {
    if (prescription_map[disease_name]) {
      this.prescription_list.push(prescription_map[disease_name]);
    }

    return;
  }

  public diagnosePatient(patient: Patient, symptom: Symptom[]) {
    const patient_prescription: Prescription[] = [];
    this.prescription_list.forEach((prescription) => {
      const is_match = prescription.isMatch(symptom, patient);
      if (is_match) {
        patient_prescription.push(prescription);
      }
    });

    return patient_prescription;
  }

  public addPatient(
    patient: Patient,
    symptom: Symptom[],
    is_export: ExportDecision
  ) {
    this.waiting_list.push({ patient, symptom, is_export });
    return;
  }

  public getNowdiagnosePatient() {
    return this.waiting_list.shift();
  }
}

export class Prescription {
  protected name: string;
  protected potential_disease: string;
  protected medicines: string[];
  protected usage: string;
  protected symptoms: Symptom[];

  constructor(
    name: string,
    potential_disease: string,
    medicines: string[],
    usage: string,
    symptoms: Symptom[]
  ) {
    this.setName(name);
    this.setPotentialDisease(potential_disease);
    this.setMedicines(medicines);
    this.setUsage(usage);
    this.symptoms = symptoms.sort();
  }

  public isMatch(symptoms: Symptom[], patient: Patient) {
    for (let i = 0; i < this.symptoms.length; i++) {
      if (!symptoms.includes(this.symptoms[i])) {
        return false;
      }
    }

    return true;
  }

  private setName(name: string) {
    if (name.length < 4 || name.length > 30) {
      throw Error("wrong prescription name");
    }

    this.name = name;
    return;
  }

  private setPotentialDisease(potential_disease: string) {
    if (potential_disease.length < 8 || potential_disease.length > 100) {
      throw Error("wrong prescription potential disease");
    }

    this.potential_disease = potential_disease;
    return;
  }

  private setMedicines(medicines: string[]) {
    medicines.forEach((medicine) => {
      if (medicine.length < 2 || medicine.length > 100) {
        throw Error("wrong prescription medicine");
      }
    });

    this.medicines = medicines;
    return;
  }

  private setUsage(usage: string) {
    if (usage.length < 0 || usage.length > 1000) {
      throw Error("wrong prescription usage");
    }

    this.usage = usage;
    return;
  }
}

export class AttractivePrescription extends Prescription {
  public isMatch(symptoms: Symptom[], patient: Patient) {
    if (patient.age !== 18) {
      return false;
    }

    return super.isMatch(symptoms, patient);
  }
}

export class SleepApneaSyndromePrescription extends Prescription {
  public isMatch(symptoms: Symptom[], patient: Patient) {
    if (patient.countBMI() <= 26) {
      return false;
    }

    return super.isMatch(symptoms, patient);
  }
}

const prescription_map: { [name: string]: Prescription } = {
  "COVID-19": new Prescription(
    "清冠一號",
    "COVID-19",
    ["清冠一號"],
    "將相關藥材裝入茶包裡，使用500 mL 溫、熱水沖泡悶煮1~3 分鐘後即可飲用。",
    [Symptom.Headache, Symptom.Cough]
  ),
  Attractive: new AttractivePrescription(
    "青春抑制劑",
    "Attractive",
    ["假鬢角", "臭味"],
    "把假鬢角黏在臉的兩側，讓自己異性緣差一點，自然就不會有人想妳了。",
    [Symptom.Sneeze]
  ),
  SleepApneaSyndrome: new SleepApneaSyndromePrescription(
    "打呼抑制劑",
    "SleepApneaSyndrome",
    ["一捲膠帶"],
    "睡覺時，撕下兩塊膠帶，將兩塊膠帶交錯黏在關閉的嘴巴上，就不會打呼了。",
    [Symptom.Snore]
  ),
};
