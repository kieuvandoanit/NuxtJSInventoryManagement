import type Timestamp from "./Timestamp.interface";

export default interface Employee extends Timestamp {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  loginCode: string;
  avatar: string;
  phone: string;
  position: string;
}

export interface EmployeeCollection extends Timestamp {
  data: Employee
}
