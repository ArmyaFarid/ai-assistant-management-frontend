// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

export type MenuLink = {
  name: string;
  href: string;
};

export type Paginator = {
  page : number;
  size : number;
}





export type Account = {
  id: number;
  accountSid: string;
  name: string | null;
  address: string | null;
  phone: string | null;
  image: string | null;
  cover_image: string | null;
  description: string | null;
};

export type User = {
  id: number;
  fullName: string;
  age: number;
  account : Account;
  email: string;
  role: string;
  phone: string;
  username_account: string;
}

export type Assistant = {
  id: number;
  assistantSid: string;
  assistantName: string;
  prompt: Prompt;
  welcomeMessage: string;
  resources : Resource[];
};

export type Phone = {
  id: number;
  assistantSid: string;
  assistant : Assistant;
  number: string;
  description: string;
};

export type Resource = {
  id: number;
  name: string;
  content: string;
  description: string;
};

export type Prompt = {
  id: number;
  name: string;
  content: string;
  description: string;
};




export type Call = {
  id: number;
  caller_phone: string;
  caller_fullname: string;
  doctor_fullname: string;
  reason: string;
  comment: string;
  state : string;
  call_date: string;        // Could be Date if parsing dates
  created_at: string;
  updated_at: string | null; // Null indicates no recent update
};


export const POSITIVE_NUMBER_REGEX = /^[1-9]\d*$/; // Regex for positive numbers




