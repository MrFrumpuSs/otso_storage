import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Logo from '../assets/logo.svg';
import styles from '../styles/register.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router'
import Input from '../components/UI/Input/Input';
import Button from '../components/UI/Button/Button';
import Link from 'next/link'
import { IoReturnDownBackOutline } from "react-icons/io5";
import { BiErrorCircle, BiCheckCircle } from "react-icons/bi";

import { motion } from "framer-motion";
import AuthService from '../API/AuthService';
import Modal from '../components/UI/Modal/Modal';

const Register = () => {

    const { register, watch, handleSubmit, formState: { errors } } = useForm();
    const [btnLock, setBtnLock] = useState(false);
    const [modal, setModal] = useState(false);
    const [regError, setRegError] = useState('');
    const router = useRouter();

    const submitForm = async (data) => {
        setBtnLock(true);
        const response = await AuthService.registration(data);
        if(response.data?.error) {
            setRegError(response.data.error);
            setBtnLock(false);
        } else {
            setRegError('');
        }
        setModal(true);
    } 


    return (
        <div className={styles.register}>
            <form className={styles.register_form} onSubmit={handleSubmit(data => submitForm(data))}>
                <motion.div className={styles.logo} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}><Image src={Logo} alt="logotype" /></motion.div>
                <h1 className={styles.title}>Регистрация в Otso Storage</h1>
                <Input className={styles.input} placeholder="Иван" type="text" label="Имя" name="fname" errors={errors} field={register} validationSchema={{ required: "Поле должно быть заполнено" }}/>
                <Input className={styles.input} placeholder="Иванов" type="text" label="Фамилия" name="sname" errors={errors} field={register} validationSchema={{ required: "Поле должно быть заполнено" }}/>
                <Input className={styles.input} placeholder="expample@gmail.com" type="email" label="Почта" name="email" errors={errors} field={register} 
                validationSchema={
                    {
                        required: "Поле должно быть заполнено",
                        pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<,>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Не валидный email"
                        }
                    }
                }
                />
                
                
                <Input className={styles.input} type="text" label="Логин" name="login" errors={errors} field={register}
                validationSchema={
                    {
                        required: "Поле должно быть заполнено",
                        pattern: {
                            value: /^[A-Za-z0-9]+$/,
                            message: "Допустимы только латинские символы и цифры"
                        }
                    }
                }
                />
                <Input className={styles.input} type="password" label="Пароль" name="password" errors={errors} field={register} 
                validationSchema={
                    {
                        required: "Поле должно быть заполнено",
                        pattern: {
                            value: /^[A-Za-z0-9]+$/,
                            message: "Допустимы только латинские символы и цифры"
                        },
                        minLength: {
                            value: 6,
                            message: "Минимальная длинна пароля: 6 символов"
                        },
                        maxLength: {
                            value: 20,
                            message: "Максимальная длинна пароля: 20 символов"
                        }
                    }
                }/>
                <Input className={styles.input} type="password" label="Подтверждение пароля" name="confpassword" errors={errors} field={register} 
                validationSchema={
                    {
                        validate: (value) => {
                            if (watch('password') != value) {
                                return "Пароли не совпадают";
                            }
                        },
                    }
                }/>
                <Button className={styles.button} disabled={btnLock}>Зарегистрироваться</Button>
                <p className={styles.txt}>Уже есть аккаунт в Otso Storage? <Link href="/"><a className={styles.link}>Войти</a></Link></p>
                <p className={styles.back}><IoReturnDownBackOutline size='20px' className={styles.back_ico} color='#333F51'/> Вернутся на <Link href="/"><a className={styles.link}>главную</a></Link></p>
            </form>
            <Modal active={modal} className={styles.modal} setActive={setModal} closable={regError ? true : false}>
                {regError
                ?
                    <BiErrorCircle size='110px' color='#EF5944'></BiErrorCircle>
                :
                    <BiCheckCircle size='110px' color='#22C55E'></BiCheckCircle>
                }
                <h2 className={styles.m_title}>{regError ? 'Во время регистрации произошла ошибка!' : 'Успешная регистрация'}</h2>
                <p className={styles.m_description}>{regError ? regError : 'На вашу почту отправленна ссылка для подтверждения регистрации'}</p>
                
                {!regError &&
                    <Button className={styles.m_button} onClick={() => router.push('/login')}>Перейти к форме авторизации</Button>
                }
            </Modal>
        </div>
    );
};

export default Register;