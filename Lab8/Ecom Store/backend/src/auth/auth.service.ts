
import { Injectable } from '@nestjs/common';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private users: User[] = [];

  signup(user: any) {
    const existingUser = this.users.find(
      (item) => item.email === user.email,
    );

    if (existingUser) {
      return {
        message: 'Email already registered',
      };
    }

    const newUser: User = {
      id: this.users.length + 1,
      name: user.name,
      email: user.email,
      password: user.password,
    };

    this.users.push(newUser);

    return {
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  }

  login(user: any) {
    const existingUser = this.users.find(
      (item) =>
        item.email === user.email &&
        item.password === user.password,
    );

    if (!existingUser) {
      return {
        message: 'Invalid email or password',
      };
    }

    return {
      message: 'Login successful',
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
    };
  }
}
