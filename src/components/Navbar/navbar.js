import React, { useState } from 'react'
import api from '../../services/api'
import { useNavigate, Link } from 'react-router-dom'
import { Offcanvas, Navbar, Container } from 'react-bootstrap'
import { TiThMenuOutline } from 'react-icons/ti'
import Cookies from 'js-cookie'
import { FaUsers, FaComments } from 'react-icons/fa'
import UserAvatarWithInitials from '../../components/UserAvatarWithInitials/UserAvatarWithInitials'
import Dropdown from 'react-bootstrap/Dropdown'
import DarkMode from '../DarkMode/DarkMode'
import { MdOutlineBarChart } from 'react-icons/md'

import './styleNavbar.css'

export default function Sidebar() {

    const history = useNavigate()

    const handleLogout = async (e) => {
        e.preventDefault()

        try {
            api.post('/api/logout')
                .then(response => {
                    console.log(response.data)
                    Cookies.remove('token')
                    Cookies.remove('userId')

                    history('/login')
                })
                .catch(error => {
                    console.log(error)
                })

        } catch (error) {
            console.error('Erro ao fazer logout:', error)
        }
    }

    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const showEditUserPage = (userId) => {
        history(`/user/edit/${userId}`)
    }

    return (
        <>
            <Navbar>
                <Container className='containerNavbar'>
                    <Navbar.Brand className='d-flex align-items-center' >
                        <div onClick={handleShow} className='button-canvas mx-auto px-3'>
                            <TiThMenuOutline className='TiThMenu'></TiThMenuOutline>
                        </div>

                    </Navbar.Brand>
                    <div className='d-flex align-items-center'>
                        <DarkMode />
                        <Dropdown
                            drop='down-centered'
                            className='d-flex align-items-center'>
                            <Dropdown.Toggle variant='success' id='dropdown-basic' type='submit' className='btnUserAvatarWithInitials'>
                                <UserAvatarWithInitials id={Cookies.get('userId')} name={Cookies.get('userName')} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='profileMenu'>
                                <Dropdown.Item className='dropdown-item fw-semibold profileItem' onClick={() => showEditUserPage(Cookies.get('userId'))}>Perfil</Dropdown.Item>
                                <Dropdown.Divider className='lineDividerDropPerfil' />
                                <Dropdown.Item onClick={handleLogout} className='dropdown-item text-danger fw-semibold profileItem'>Sair</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Container>
            </Navbar>
            <Offcanvas
                className='bg-color-sidebar'
                show={show}
                onHide={handleClose}
            >
                <hr className='hrLineDivider'></hr>
                <Offcanvas.Body>
                    <div>

                        <Link to='/users' className='classLink'>
                            <div className='divLink'>
                                <h5 className='divText'><FaUsers className='classIcon' />Usuários</h5>
                            </div>
                        </Link>

                        <Link to='/chat' className='classLink'>
                            <div className='divLink'>
                                <h5 className='divText'><FaComments  className='classIcon' />Chat</h5>
                            </div>
                        </Link>

                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}


