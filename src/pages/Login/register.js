import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom"
import api from '../../services/api'
import { TbLockX } from "react-icons/tb";
import { Alert } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password_confirmation, setPasswordConfirmation] = useState('')
    const [showSpinner, setShowSpinner] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        setShowSpinner(true);

        try {
            await api.post('/api/auth/register', {
                name,
                email,
                password,
                password_confirmation,
            }).then(() => {

                toast.success('Registro realizado com sucesso!', {
                    autoClose: 2000,
                });
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            })

        } catch (error) {
            if (error.response && error.response.status === 422) {
                setError("Verifique os campos preenchidos.");
            } else {
                setError("Erro ao fazer registros.");
            }
            console.error('Erro ao fazer registro:', error)
        } finally {
            setShowSpinner(false);
        }
    }

    return (
        <>
            <section className="sign-in-page d-flex align-items-center justify-content-center min-vh-100">
                <ToastContainer />
                <Container>
                    <Row className="align-items-center justify-content-center">
                        <Col md={8} lg={6}>
                            <div className="sign-in-from text-center">
                                <Link to="/" className="d-inline-flex align-items-center justify-content-center gap-2">
                                    <h2 className="logo-title">Chat App</h2>
                                </Link>
                                <p className="mt-3 font-size-16">Bem-vindo ao Chat App.</p>
                                {error && (
                                    <Alert className='alertClass d-flex align-items-center' color="danger">
                                        <TbLockX className='fs-5 marginAlertClass' />{error}
                                    </Alert>
                                )}
                                <Form onSubmit={handleRegister} className="mt-5">
                                    <Form.Group className="form-group text-start">
                                        <h6 className="form-label fw-bold">Nome</h6>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nome completo"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group text-start">
                                        <h6 className="form-label fw-bold">E-mail</h6>
                                        <Form.Control
                                            type="email"
                                            placeholder="E-mail"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group text-start">
                                        <h6 className="form-label fw-bold">Senha</h6>
                                        <Form.Control
                                            type="password"
                                            placeholder="Senha"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group text-start">
                                        <h6 className="form-label fw-bold">Confirmar senha</h6>
                                        <Form.Control
                                            type="password"
                                            required
                                            placeholder="Confirmar senha"
                                            value={password_confirmation}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="btn btn-primary mt-4 fw-semibold text-uppercase w-100"
                                        disabled={showSpinner}
                                    >
                                        {showSpinner ? <div className="spinner-border spinner-border-sm" role="status"></div> : <span>Criar conta</span>}
                                    </Button>
                                    <h6 className="mt-5">
                                        Já tem uma conta? {" "}
                                        <Link to={"/login"}>Conecte-se</Link>
                                    </h6>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default Register;
