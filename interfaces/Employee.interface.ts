import type Timestamp from "./Timestamp.interface";

export default interface Employee extends Timestamp {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  phone: string;
  role: EmployeeRole;
  status: EmployeeStatus;
}

export enum EmployeeRole {
  "Manager" = 1,
  "Staff" = 2
}

export enum EmployeeStatus {
  "Active" = 1,
  "Inactive" = 2,
}
