'use client'

import { useState } from "react";
import Modal from "../ui/Modal/Modal";
import { EyeClosed, EyeIcon, X } from "lucide-react";
import { signUpNewUser } from "@/lib/auth";

interface FormStatus {
    error: boolean,
    message: string | null,
    loading: boolean
}

export default function SignupForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [seePassword, setSeePassword] = useState(false);
    const [seePassword2, setSeePassword2] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        rama: '',
        pass: '',
        pass2: ''
    });
    const [formState, setFormState] = useState<FormStatus>({
        error: false,
        message: null,
        loading: false
    });
    const [errors, setErrors] = useState<any>({
        nombre: '',
        email: '',
        rama: '',
        pass: '',
        pass2: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {
            target: {
                value,
                name
            }
        } = e;
        
        const errors: any = {};
        
        if(name === 'nombre') {
            if (value !== '') {
                setErrors({ ...errors, nombre: '' })
            } else {
                errors.nombre = 'El nombre es obligatorio';
            };
        }
        if(name === 'email') {
            if (value !== '') {
                setErrors({ ...errors, email: '' })
            } else {
                errors.email = 'El email es obligatorio';
            };
        }
        if(name === 'rama') {
            if (value !== '' && value !== '...') {
                setErrors({ ...errors, rama: '' })
            } else {
                errors.rama = 'La rama es obligatoria';
            };
        }
        if(name === 'pass') {
            if (value !== '') {
                setErrors({ ...errors, pass: '' })
            } else {
                errors.pass = 'La contraseña es obligatoria';
            };
        }
        if(name === 'pass2') {
            if (value !== '' && value === formData.pass) {
                setErrors({ ...errors, pass2: '' })
            } else {
                errors.pass2 = value === '' ? 'La contraseña es obligatoria' : 'Las contraseñas no coinciden';
            };
        }
        
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setFormState({
                error: true,
                message: null,
                loading: false
            })
        } else {
            setErrors({
                nombre: '',
                email: '',
                rama: '',
                pass: '',
            });
            setFormState({
                error: false,
                message: null,
                loading: false
            })
        }

        setFormData({
            ...formData,
            [name]: value
        })
    }
    
    const handleClose = () => setIsOpen(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const errors: any = {};

        if (formData.nombre === '') {
            errors.nombre = 'El nombre es requerido';
        }
        
        if (formData.email === '') {
            errors.email = 'El email es requerido';
        }

        if (formData.rama === '' || formData.rama === '...') {
            errors.rama = 'La rama es requerida';
        }

        if (formData.pass === '') {
            errors.pass = 'La contraseña es requerida';
        }

        if (formData.pass2 === '' || formData.pass2 !== formData.pass) {
            errors.pass2 = 'Las contraseñas deben coincidir';
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setFormState({
                error: true,
                message: null,
                loading: false
            });
            return;
        }

        setFormState({
            error: false,
            message: null,
            loading: true
        });

        try {
            const response = await signUpNewUser({
                nombre: formData.nombre,
                email: formData.email,
                rama: formData.rama,
                password: formData.pass
            });

            console.log('Response signup:', response);
            
            if (!response || response.error) throw response?.error || new Error('Error registrando usuario. Por favor, intente nuevamente.');
            setFormState({
                error: false,
                message: '¡Solicitud de acceso enviada correctamente! Te llegará un email cuando tu cuenta sea activada.',
                loading: false
            });

        } catch (error) {
            console.error('Error during signup:', error);
            setFormState({
                error: true,
                message: 'Error registrando usuario. Por favor, intente nuevamente.',
                loading: false
            });
            return;
        }
    }
    
    return (
        <>
        <button onClick={() => setIsOpen(true)} className="text-gray-700 font-medium underline mt-4 inline-block cursor-pointer">
          ¿No tenés una cuenta? ¡Solicitá acceso aca!
        </button>
        <Modal showModal={isOpen} closeModal={handleClose}>
            <button onClick={handleClose} className="absolute right-2 top-2 cursor-pointer"><X /></button>
            <h2 className="text-2xl font-semibold">Registro</h2>
            <p className="mb-4">¡Completa el formulario de registro para solicitar acceso a la plataforma!</p>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <label className="flex flex-col">
                    Nombre completo:
                    <input
                        type="text"
                        className="border border-gray-300 rounded px-3 py-2 mt-1"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                    />
                    {errors.nombre && <p className='text-red-500 text-sm mt-1'>{errors.nombre}</p>}
                </label>
                <label className="flex flex-col">
                    Email:
                    <input
                        type="email"
                        className="border border-gray-300 rounded px-3 py-2 mt-1"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
                </label>
                <label className="flex flex-col">
                    Rama
                    <select
                        name="rama"
                        id="rama"
                        className={`border border-gray-300 rounded px-3 py-2 mt-1`}
                        defaultValue={formData.rama}
                        onChange={handleChange}
                    >
                        <option selected>...</option>
                        <option value="1">Manada</option>
                        <option value="2">Unidad</option>
                        <option value="3">Caminantes</option>
                        <option value="4">Rovers</option>
                    </select>
                    {errors.rama && <p className='text-red-500 text-sm mt-1'>{errors.rama}</p>}
                </label>

                <label className="flex flex-col">
                    Contraseña:
                    <div className="relative">
                        <input
                            type={seePassword ? 'text' : 'password'}
                            className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
                            name="pass"
                            value={formData.pass}
                            onChange={handleChange}
                        />
                        <span onClick={(ev) => {ev.preventDefault();setSeePassword(!seePassword)}} className={`absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 mt-0.5`}>
                            {
                                seePassword ?
                                <EyeClosed width={20} />
                                :
                                <EyeIcon width={20} />
                            }
                        </span>
                    </div>
                    {errors.pass && <p className='text-red-500 text-sm mt-1'>{errors.pass}</p>}
                </label>
                <label className="flex flex-col">
                    Repetir contraseña:
                    <div className="relative">
                        <input
                            type={seePassword2 ? 'text' : 'password'}
                            className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
                            name="pass2"
                            value={formData.pass2}
                            onChange={handleChange}
                        />
                        <span onClick={(ev) => {ev.preventDefault();setSeePassword2(!seePassword2)}} className={`absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 mt-0.5`}>
                            {
                                seePassword2 ?
                                <EyeClosed width={20} />
                                :
                                <EyeIcon width={20} />
                            }
                        </span>
                    </div>
                    {errors.pass2 && <p className='text-red-500 text-sm mt-1'>{errors.pass2}</p>}
                </label>

                <button
                    type="submit"
                    className="cursor-pointer bg-blue-600 text-white rounded px-4 py-2 mt-2 hover:bg-blue-700 transition disabled:bg-primary-faded disabled:cursor-default"
                    disabled={formState.loading || formState.error}
                >
                    Enviar solicitud
                </button>
            </form>
            {
                formState.message && <p className={`text-sm font-bold mt-3 text-center px-2 py-3 rounded-md ${formState.error ? 'bg-red-300 text-red-800' : 'bg-green-300 text-green-800'}`}>{formState.message}</p>
            }
        </Modal>
        </>

    )
}
