import React, { useState, useEffect } from 'react'
import NavBar from '../../components/Navbar/navbar'
import Button from 'react-bootstrap/Button'
import { NavLink } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import { FaUserCog } from 'react-icons/fa'
import { BsArrowReturnLeft } from 'react-icons/bs'
import api from '../../services/api'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import '../../components/styleComponents/styleHeaderContainer.css'
import '../../components/styleComponents/styleTableContainer.css'
import '../../components/styleComponents/styleFooterContainer.css'

const Edit = () => {
    const history = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const customId = 'success-toast-id'
    let { id } = useParams()

    const editUser = async (e) => {
        e.preventDefault()

        if (name === '' || email === '') {
            toast.error('Por favor preencha todos os campos.', { autoClose: 3000 })
        } else if (email.indexOf('@') === -1) {
            toast.error('O campo email deve conter o caractere @.', { autoClose: 3000 })
        } else if (password !== confPassword) {
            toast.error('Senha e confirmação de senha não conferem!', { autoClose: 3000 })

            setPassword('')
            setConfPassword('')
        } else if (password && password.length < 6) {
            toast.error('A senha deve possuir no mínimo 6 caracteres.', { autoClose: 3000 })

            setPassword('')
            setConfPassword('')
        } else {
            await api.put(`/api/user/${id}`, {
                name,
                email,
                password,
                password_confirmation: confPassword,

            }).then(() => {
                setName('')
                setEmail('')
                setPassword('')
                setConfPassword('')
                toast.success('Usuário editado com sucesso!', { toastId: customId, autoClose: 3000 })

                setInterval(() => {
                    history('/users')
                }, 3000)
            })
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/api/user/${id}`)
                const userData = response.data.user
                setName(userData.name)
                setEmail(userData.email)
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error)
                toast.error('Erro ao carregar dados do usuário.')
            }
        }
        fetchUser()
    }, [id])

    return (
        <>
            <NavBar />

            <div id='divContainer' className='container'>
                <div className='headerContainer editcreateMobile'>
                    <div className='divheaderTittleMobile'>
                        <div id='divHeaderTittle'><FaUserCog className='fs-1' /><h3 id='tittleH2'> Edição de usuário</h3></div>
                    </div>
                    <div className='divbtnVoltarMobile'>
                        <NavLink to='/users' style={{ textDecoration: 'none' }}>
                            <Button id='buttonBack'><BsArrowReturnLeft style={{ marginRight: '3px' }} /> Voltar</Button>
                        </NavLink>
                    </div>
                </div>

                <ToastContainer />

                <div>
                    <Form className='formGenMobile'>
                        <Row className='rowGenForm'>
                            <Col>
                                <Form.Group className='mb-3' controlid='formBasicName'>
                                    <Form.Label className='fw-semibold'>Nome</Form.Label>
                                    <Form.Control className='input-group-edit' type='text' placeholder='nome' value={name} onChange={(e) => setName(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className='mb-3' controlid='formBasicEmail'>
                                    <Form.Label className='fw-semibold'>Email</Form.Label>
                                    <Form.Control className='input-group-edit' type='email' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='rowGenForm'>
                            <Col>
                                <Form.Group className='mb-3' controlid='formBasicPassword'>
                                    <Form.Label className='fw-semibold'>Senha</Form.Label>
                                    <Form.Control className='input-group-edit' type='password' placeholder='senha' value={password} onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className='mb-3' controlid='formBasicConfirmationPassword'>
                                    <Form.Label className='fw-semibold'>Confirmação de senha</Form.Label>
                                    <Form.Control className='input-group-edit' type='password' placeholder='confirmação de senha' value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs lg="2">
                                <Button className='btnCreateMobile' onClick={editUser} id='buttonNew' type='submit'>Editar</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Edit