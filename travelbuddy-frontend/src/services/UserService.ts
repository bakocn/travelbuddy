import api from "../api/api"; 

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
}

export async function getUsers(): Promise<User[]> {
  return await api.get<User[]>("/users");
}

export async function createUser(user: User): Promise<User> {
  return await api.post<User>("/users", user);
}
