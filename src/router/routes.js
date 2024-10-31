import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login/login'
import Register from '../pages/Login/register'
import Users from '../pages/Users/index.js'
import CreateUser from '../pages/Users/create.js'
import EditUser from '../pages/Users/edit.js'
import Chat from '../pages/Chat/index.js'

export default function AppRoutes() {
  
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path='/users' element={<Users />} />
      <Route path='/user/new' element={<CreateUser />} />
      <Route path='/user/edit/:id' element={<EditUser />} />

      <Route path="/chat/:userId" element={<Chat />} />
    </Routes>
  )
}
