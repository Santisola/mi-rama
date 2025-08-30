'use client';
import { useState } from "react";
import { EyeClosed, EyeIcon } from "lucide-react";
import { signInWithEmail } from "@/lib/auth";
import { redirect } from "next/navigation";
import Spinner from "../spinner/Spinner";

interface LoginStatus {
    loading: boolean;
    error: boolean;
    message: string | null;
}

export default function LoginForm() {
    const [seePassword, setSeePassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<LoginStatus>({ loading: false, error: false, message: null });
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({
            loading: true,
            error: false,
            message: null
        })

        const response:any = await signInWithEmail({ email, password });
        
        if (response.error) {
            console.error(response.error);
            setStatus({
                loading: false,
                error: true,
                message: response.error
            })
            return;
        }

        redirect('/protagonistas');
    };
    
    return (
        <>
        <form action="#" className={`max-w-72`} onSubmit={handleSubmit}>
            <div className="form-group mb-4 mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="input bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-1.5 disabled:bg-gray-200"
                    value={email}
                    disabled={status.loading}
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
                        className="input bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-1.5 disabled:bg-gray-200"
                        value={password}
                        disabled={status.loading}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={(ev) => {ev.preventDefault();setSeePassword(!seePassword)}} className={`absolute right-2 cursor-pointer top-1/2 -translate-y-1/2`}>
                        {
                            seePassword ?
                            <EyeClosed width={20} />
                            :
                            <EyeIcon width={20} />
                        }
                    </button>
                </div>
            </div>
            <button type="submit" className="btn mt-4 bg-primary text-white font-medium px-5 py-2 rounded-4xl cursor-pointer hover:bg-primary-focus transition-all">
                {status.loading ? <Spinner styles={{
                    width: '20px',
                    height: '20px',
                    border: 'solid 2px rgba(0,0,0,0.1)',
                    borderLeftColor: '#fff'
                }} /> : 'Iniciar Sesión'}
            </button>
        </form>
        {status.error && 
            <div className="mt-4 px-2 py-3 rounded-md w-fit text-sm bg-red-300 text-red-800">
                {status.message}
            </div>
        }
        </>
    )
}
