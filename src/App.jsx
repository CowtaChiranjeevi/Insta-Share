import {BrowserRouter, Routes, Route} from 'react-router-dom'

import LoginForm from './components/LoginForm/LoginForm'
import Home from './components/Home/Home'
import MyProfile from './components/MyProfile/MyProfile'
import UserDetails from './components/UserDetails/UserDetails'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import NotFound from './components/NotFound/NotFound'

import './App.css'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-profile"
        element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id"
        element={
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

export default App
