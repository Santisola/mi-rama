'use client';
import { useState } from "react";
import styles from './styles.module.css'
import { EyeClosed, EyeIcon } from "lucide-react";
import { signInWithEmail } from "@/lib/auth";

export default function LoginForm() {
    const [seePassword, setSeePassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response:any = await signInWithEmail({ email, password });
        
        if (response.error) {
            console.error(response.error);
            return;
        }

        console.log('Inicio de sesión exitoso:', response);
    };
    
    return (
        <form action="#" className={`${styles.loginForm} max-w-72`} onSubmit={handleSubmit}>
            <div className="form-group mb-4 mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="input bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-1.5"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <div className="relative">
                    <input
                        type={seePassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        required
                        className="input bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-1.5"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={(ev) => {ev.preventDefault();setSeePassword(!seePassword)}} className="absolute right-2 top-1/6 cursor-pointer">
                        {
                            seePassword ?
                            <EyeClosed width={20} />
                            :
                            <EyeIcon width={20} />
                        }
                    </button>
                </div>
            </div>
            <button type="submit" className="btn mt-4 bg-primary text-white font-medium px-5 py-2 rounded-4xl cursor-pointer hover:bg-primary-focus transition-all">Iniciar Sesión</button>
        </form>
    )
}
