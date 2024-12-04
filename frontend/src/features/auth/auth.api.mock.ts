import { IAuthAPI, SignInParameters, SignUpParameters, ResetPasswordParameters, ConfirmPasswordResetParameters, ConfirmEmailParameters, AuthApiOutput } from './auth.api';

type UserMock = {
    username: string,
    password: string,
    email: string,
    confirmedEmail: boolean,
}

let usersDB: UserMock[] = JSON.parse(localStorage?.getItem('usersDB') ?? '[]');
if (usersDB.length === 0) {
    usersDB = [
        { username: 'user1', password: '123', email: 'user1@gmail.com', confirmedEmail: true },
        { username: 'emailnotconfirmed', password: '123', email: 'emailnotconfirmed@gmail.com', confirmedEmail: false }
    ];

    localStorage.setItem('usersDB', JSON.stringify(usersDB));
}

let authenticatedUser: UserMock | undefined = JSON.parse(localStorage.getItem('authenticatedUser') ?? 'null');

export const MockAuthApi: IAuthAPI = {
    async signIn({ username, password }: SignInParameters): Promise<AuthApiOutput> {
        console.log('Mock signIn called with:', username, password);

        const user = usersDB.find(x => x.username === username && x.password === password);

        if (!user) {
            throw new Error('Invalid username or password.');
        }

        authenticatedUser = user;
        localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));

        return { nextStep: 'DONE' };
    },

    async signUp({ username, email, password }: SignUpParameters): Promise<AuthApiOutput> {
        console.log('Mock signUp called with:', username, email, password);

        const user = usersDB.find(u => u.email === email);

        if (user) {
            throw new Error('Email already exists.');
        }

        usersDB.push({
            username, email, password, confirmedEmail: false
        });

        localStorage.setItem('usersDB', JSON.stringify(usersDB));

        return { nextStep: 'CONFIRM_EMAIL' };  
    },

    async resetPassword({ username }: ResetPasswordParameters): Promise<AuthApiOutput> {
        console.log('Mock resetPassword called for username:', username);

        const user = usersDB.find(u => u.username === username);

        if (!user) {
            throw new Error('User not found.');
        }

        return { nextStep: 'RESET_PASSWORD' }; 
    },

    async confirmPasswordCode({ username, newPassword, confirmationCode }: ConfirmPasswordResetParameters): Promise<AuthApiOutput> {
        console.log('Mock confirmPasswordCode called with:', username, newPassword, confirmationCode);

        const user = usersDB.find(u => u.username === username);

        if (!user || confirmationCode === 'wrongcode') {
            throw new Error('Invalid confirmation code.');
        }

        user.password = newPassword;

        localStorage.setItem('usersDB', JSON.stringify(usersDB));

        return { nextStep: 'DONE' }; 
    },

    async confirmEmail({ username, password, confirmationCode }: ConfirmEmailParameters): Promise<AuthApiOutput> {
        console.log('Mock confirmEmail called with:', username, confirmationCode);

        const user = usersDB
            .find(u => u.username === username && u.password === password);

        if (!user || confirmationCode === 'wrongcode') {
            throw new Error('Invalid confirmation code.');
        }

        return await this.signIn({username, password});
    },

    async resendEmailCode(username: string): Promise<AuthApiOutput> {
        console.log('Mock resendEmailCode called for username:', username);

        const user = usersDB.find(u => u.username === username);

        if (!user) {
            throw new Error('User not found.');
        }

        return { nextStep: 'CONFIRM_EMAIL' };
    },

    async signOut(): Promise<AuthApiOutput> {
        console.log('Mock signOut called');

        authenticatedUser = undefined;

        localStorage.removeItem('authenticatedUser');

        return { nextStep: 'NOT_AUTHENTICATED' }
    },

    async getAccessToken(): Promise<string | null> {
        console.log('Mock getAccessToken called');
    
        return authenticatedUser != null ? "kookosdf.asdfasdfasdfas.asdfasdf" : null;
    }
};
