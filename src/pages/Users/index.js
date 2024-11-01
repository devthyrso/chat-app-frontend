import React, { useEffect, useState, useMemo } from 'react'
import NavBar from '../../components/Navbar/navbar'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaUserPlus, FaTrash } from 'react-icons/fa'
import { BsPencilSquare } from 'react-icons/bs'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import { AiOutlineSearch } from 'react-icons/ai'
import api from '../../services/api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BsFillArrowRightSquareFill, BsFillArrowLeftSquareFill } from 'react-icons/bs'
import AnimationUsersLottie from './AnimationUsersLottie/AnimationUsersLottie'
import AnimationWarningLottie from '../../components/AnimationWarningDeleteConfim/AnimationWarningLottie'
import Loading from '../../components/LoaderComponent/loader'

import '../../components/styleComponents/styleModalDeleteConfimation.css'
import '../../components/styleComponents/styleHeaderContainer.css'
import '../../components/styleComponents/styleTableContainer.css'
import '../../components/styleComponents/styleFooterContainer.css'

const Index = () => {
    const history = useNavigate()
    const [users, setUsers] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [userIdToDelete, setUserIdToDelete] = useState('')
    const [userNameToDelete, setUserNameToDelete] = useState('')
    const [search, setSearch] = useState('')

    const [currentPage, setCurrentPage] = useState(1)
    const [usersPerPage] = useState(10)
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = (users || []).slice(indexOfFirstUser, indexOfLastUser)
    const nPages = users?.length > 0 ? Math.ceil(users.length / usersPerPage) : 1;
    const [loading, setLoading] = useState(true)

    const getUsers = async () => {
        try {
            const response = await api.get('/api/users');

            setUsers(response.data.users);
            setLoading(false);
        } catch (error) {
            console.error('Erro');
            toast.error('Erro ao carregar dados.', { autoClose: 3000 });
            setLoading(false);
        }
    };

    const showDeleteUserConfirmationModal = (userId, userName) => {
        setModalShow(true)
        setUserIdToDelete(userId)
        setUserNameToDelete(userName)
    }

    const deleteUser = async (userId) => {
        await api.delete(`/api/user/${userId}`).then(() => {
            getUsers()
            setModalShow(false)
            toast.success('Usuário deletado com sucesso!', { autoClose: 3000 })
        })
    }

    function DeleteUserConfirmationModal(props) {

        return (
            <Modal
                {...props}
                aria-labelledby='contained-modal-title-vcenter'
                centered
            >
                <Modal.Header id='modalHeader' closeButton>
                    <div id='divModalTitle'>
                        <Modal.Title id='modalTitle'>
                            <AnimationWarningLottie />
                        </Modal.Title>
                    </div>
                </Modal.Header>
                <Modal.Body id='modalBody'>
                    <h4>Exclusão de usuário.</h4>
                    <p>
                        Você tem certeza de que deseja remover este usuário<span className='d-flex justify-content-center mb-0'>{props.username} ?</span>
                    </p>
                </Modal.Body>
                <Modal.Footer id='modalFooter'>
                    <Button id='yesButton' onClick={() => deleteUser(props.userid)}>Sim</Button>
                    <Button id='noButton' onClick={props.onHide}>Não</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    const showEditUserPage = (userId) => {
        history(`/user/edit/${userId}`)
    }

    const Pagination = ({ nPages, currentPage, setCurrentPage }) => {
        if (nPages <= 1) return null;

        const range = (start, end) => {
            return Array(end - start + 1)
                .fill()
                .map((_, idx) => start + idx);
        };

        let pageNumbers = [];
        if (currentPage <= 3) {
            pageNumbers = [...range(1, Math.min(5, nPages))];
            if (nPages > 5) pageNumbers.push('...', nPages);
        } else if (currentPage > 3 && currentPage < nPages - 2) {
            pageNumbers = [1, '...', ...range(currentPage - 1, currentPage + 1), '...', nPages];
        } else {
            pageNumbers = [1, '...'];
            pageNumbers.push(...range(nPages - 4, nPages));
        }

        return (
            <nav className='d-flex justify-content-center align-items-center'>
                <BsFillArrowLeftSquareFill className='BsFillArrow' onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                <ul className='pagination pagination-sm' style={{ marginLeft: '1rem', marginRight: '1rem', marginTop: 'revert' }}>
                    {pageNumbers.map((number, index) => (
                        <li key={index} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                            <button onClick={() => typeof number === 'number' && setCurrentPage(number)} className='page-link'>
                                {number}
                            </button>
                        </li>
                    ))}
                </ul>
                <BsFillArrowRightSquareFill className='BsFillArrow' onClick={() => setCurrentPage(prev => Math.min(prev + 1, nPages))} />
            </nav>
        );
    };


    useEffect(() => {
        getUsers()
    }, [])

    const filteredUsers = useMemo(() => {
        const lowerSearch = search.toLowerCase()

        if (search === '') {
            return currentUsers
        } else {
            return users.filter((user) => user.name.toLowerCase().includes(lowerSearch) || user.email.toLowerCase().includes(lowerSearch) || user.id.toString().toLowerCase().includes(lowerSearch))
        }
    }, [search, users, currentUsers])

    const openChat = (userId) => {
        history(`/chat/${userId}`)
    }

    return (
        <>
            <NavBar />
            {loading ? (
                <div className='loading'><Loading /></div>
            ) : (
                <div id='divContainer' className='container'>
                    <DeleteUserConfirmationModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        userid={userIdToDelete}
                        username={userNameToDelete}
                    />

                    <div id='divContainer' className='container'>
                        <DeleteUserConfirmationModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            userid={userIdToDelete}
                            username={userNameToDelete}
                        />

                        <div className='headerContainer'>
                            <div className='divheaderTittleMobile'>
                                <div id='divHeaderTittle'><AnimationUsersLottie /><h3 id='tittleH2'> Usuários</h3></div>
                            </div>

                            <div id='div-input-group' className='div-input-group'>
                                <InputGroup id='input-group' className='input-group'>
                                    <InputGroup.Text id='search'><AiOutlineSearch /></InputGroup.Text>
                                    <Form.Control
                                        placeholder='pesquisar'
                                        aria-label='pesquisar'
                                        aria-describedby='search'
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </InputGroup>
                                <NavLink className='btnVoltarMobile' to='/user/new' style={{ textDecoration: 'none' }}>
                                    <Button id='buttonNew' className='borderbtnCreateEdit'><FaUserPlus id='iconButtonNew' className='iconButtonMobile' /><span className='novaPermissionMobile'>Novo Usuário</span></Button>
                                </NavLink>
                            </div>
                        </div>

                        <ToastContainer />

                        <div className='container overflow-auto mt-2'>
                            <Table id='tableList' striped bordered hover>
                                <thead className='border border-1'>
                                    <tr id='trList'>
                                        <th className='th-text-center textColors'>#ID</th>
                                        <th className='th-text-center textColors'>Nome</th>
                                        <th className='th-text-center textColors'>Email</th>
                                        <th id='thAction' className=' textColors'>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <tr key={user.id} className={`${user.active ? '' : ''} border border-1`}>
                                            <td className='td-text-center textColors'>{user.id}</td>
                                            <td className='td-text-center fontCustom'>{user.name}</td>
                                            <td className='td-text-center textColors'>{user.email}</td>
                                            <td className='text-center'>
                                                <Button className='editButton btnTableMoBile me-2' onClick={() => showEditUserPage(user.id)}><BsPencilSquare /> Editar</Button>
                                                <Button className='deleteButton btnTableMoBile' onClick={() => showDeleteUserConfirmationModal(user.id, user.name)}><FaTrash /> Excluir</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <Pagination
                            nPages={nPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default Index