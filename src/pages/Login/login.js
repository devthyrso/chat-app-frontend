import React, { useState } from 'react'
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
import api from '../../services/api'
import { TbLockX } from "react-icons/tb";
import { Alert } from 'reactstrap'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showSpinner, setShowSpinner] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setShowSpinner(true);

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      })

      const token = response.data.token

      Cookies.set("token", token, { expires: 7, secure: false })
      Cookies.set("userId", response.data.user.id, { expires: 7, secure: false })
      Cookies.set("userName", response.data.user.name, { expires: 7, secure: false })

      navigate("/users")

    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("E-mail ou senha incorretos.");
      } else {
        setError("Erro ao fazer login.");
      }
      console.error('Erro ao fazer login:', error)
    } finally {
      setShowSpinner(false);
    }
  }

  return (
    <>
      <section className="sign-in-page d-flex align-items-center justify-content-center min-vh-100">
        <Container fluid className="d-flex align-items-center justify-content-center">
          <Row className="justify-content-center w-100">
            <Col md={8} lg={6} className="d-flex align-items-center justify-content-center">
              <div className="sign-in-from text-center p-4 w-100">
                <Link to="/login" className="d-inline-flex align-items-center justify-content-center gap-2">
                  <h2 className="logo-title" data-setting="app_name">
                    Chat App
                  </h2>
                </Link>
                <p className="mt-3 font-size-16">
                  Bem vindo ao Chat App.
                </p>
                {error && (
                  <Alert className='alertClass d-flex align-items-center' color="danger">
                    <TbLockX className='fs-5 marginAlertClass' />{error}
                  </Alert>
                )}
                <Form onSubmit={handleLogin} className="mt-5">
                  <Form.Group className="form-group text-start">
                    <h6 className="form-label fw-bold">E-mail</h6>
                    <Form.Control
                      type="email"
                      className="form-control mb-0"
                      placeholder="E-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="form-group text-start">
                    <h6 className="form-label fw-bold">Senha</h6>
                    <Form.Control
                      type="password"
                      className="form-control mb-0"
                      placeholder="Senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <div className="d-flex align-items-center justify-content-between">
                    <Link to="/auth/recoverpw" className="font-italic">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Button
                    variant="primary"
                    type="submit"
                    className="btn btn-primary mt-4 fw-semibold text-uppercase w-100"
                    disabled={showSpinner}
                  >
                    {showSpinner ? <div className="spinner-border spinner-border-sm" role="status"></div> : <div className='fw-semibold'>Entrar</div>}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SignIn;
