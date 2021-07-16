import { getCustomRepository } from 'typeorm';
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken"
import { UsersRepositories } from '../repositories/UsersRepositories';



interface IAuthenticateRequest {
    email: string;
    password: string;
}

class AuthenticateUserService {
    async execute({email, password}: IAuthenticateRequest) {
        const usersRepositories = getCustomRepository(UsersRepositories);

        //verificar se o email existe
        const user = await usersRepositories.findOne({
            email
        });

        if (!user) {
            throw new Error("Email/Password incorrect");
            
        }

        //verificar se a senha está correta
        const passwordMath = await compare(password, user.password);

        if (!passwordMath) {
            throw new Error("Email/Password incorrect");
            
        }

        //gerar token
        const token = sign({
            email: user.email
        }, "294930ccmdfs2j4j5554l32l1xxddj", {
            subject: user.id,
            expiresIn: "1d",
        });

        return token;

    }
}

export { AuthenticateUserService }