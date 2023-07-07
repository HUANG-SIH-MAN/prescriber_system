import { Symptom, Prescription } from "./prescriber";

export class PatientDatabase {
  private patient_map: { [id: string]: Patient } = {};

  public addPatient(patient: Patient) {
    this.patient_map[patient.id] = patient;
    return;
  }

  public findPatient(id: string) {
    return this.patient_map[id];
  }
}

export enum Gender {
  Male,
  Female,
}

export class Patient {
  private _id: string;
  private _name: string;
  private gender: Gender;
  private _age: number;
  private height: number;
  private weight: number;
  private case_list: Case[] = [];

  constructor(
    id: string,
    name: string,
    gender: Gender,
    age: number,
    height: number,
    weight: number
  ) {
    this.setId(id);
    this.setName(name);
    this.gender = gender;
    this.setAge(age);
    this.setHeight(height);
    this.setWeight(weight);
  }

  private setId(id: string) {
    const regex = /^[A-Z]\d{9}$/;
    if (!regex.test(id)) {
      throw Error("wrong patient id");
    }

    this._id = id;
    return;
  }

  private setName(name: string) {
    const regex = /^[A-Za-z]{1,30}$/;
    if (!regex.test(name)) {
      throw Error("wrong patient name");
    }

    this._name = name;
    return;
  }

  private setAge(age: number) {
    if (age < 1 || age > 180) {
      throw Error("wrong patient age");
    }
    this._age = age;
    return;
  }

  private setHeight(height: number) {
    if (height < 1 || height > 500) {
      throw Error("wrong patient height");
    }
    this.height = height;
    return;
  }

  private setWeight(weight: number) {
    if (weight < 1 || weight > 500) {
      throw Error("wrong patient height");
    }
    this.weight = weight;
    return;
  }

  public countBMI() {
    return this.weight / Math.pow(this.height / 100, 2);
  }

  public addCase(patient_case: Case) {
    this.case_list.push(patient_case);
    return;
  }

  get id() {
    return this._id;
  }

  get age() {
    return this._age;
  }

  get name() {
    return this._name;
  }
}

export class Case {
  private name: string;
  private create_time: Date;
  private symptoms: Symptom[];
  private prescriptions: Prescription[];

  constructor(
    name: string,
    symptoms: Symptom[],
    prescriptions: Prescription[]
  ) {
    this.name = name;
    this.create_time = new Date();
    this.symptoms = symptoms;
    this.prescriptions = prescriptions;
  }

  public getName() {
    return this.name;
  }

  public getSymptoms() {
    return this.symptoms;
  }

  public getCreateTime() {
    return this.create_time;
  }

  public getPrescriptionse() {
    return this.prescriptions;
  }
}
